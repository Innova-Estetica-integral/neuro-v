import { createClient } from '@supabase/supabase-js';
import { createPaymentPreference } from '../payment/mercado-pago';
import { TransbankPayment } from '../payment/transbank';
import { createMockPayment, shouldUseMockPayments } from '../payment/mock-payment';
import { getClinicPaymentCredentials } from '../auth/clinic-context';

/**
 * Absolute Payment-Gating Enforcement
 * BUSINESS RULE: No appointment confirmation without 100% prepayment
 */

export interface PaymentGatingResult {
    allowed: boolean;
    reason?: string;
    requiredAmount?: number;
    paymentUrl?: string;
}

/**
 * Validate payment status before allowing appointment confirmation
 * Called by the database trigger AND application layer (defense in depth)
 */
export async function enforcePaymentGating(
    appointmentId: string,
    targetStatus: 'booked' | 'arrived' | 'fulfilled'
): Promise<PaymentGatingResult> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch appointment with payment status
    const { data: appointment, error } = await supabase
        .from('appointment')
        .select('id, clinic_id, payment_status, final_price_clp, participant_patient_id')
        .eq('id', appointmentId)
        .single();

    if (error || !appointment) {
        return {
            allowed: false,
            reason: 'Appointment not found'
        };
    }

    // CRITICAL: Enforce 100% prepayment
    if (appointment.payment_status !== 'full_paid') {
        return {
            allowed: false,
            reason: 'Payment required: All appointments must be fully paid before confirmation',
            requiredAmount: appointment.final_price_clp
        };
    }

    // Payment verified
    return {
        allowed: true
    };
}

/**
 * Create payment checkout for appointment
 * Routes to correct clinic's payment gateway credentials
 */
export async function createAppointmentCheckout(
    appointmentId: string,
    clinicId: string,
    preferredGateway: 'mercadopago' | 'transbank' = 'mercadopago',
    overrides?: { price?: number; serviceName?: string }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get appointment details
    let appointment: any = null;

    if (appointmentId.startsWith('temp-') && shouldUseMockPayments()) {
        console.log('🧪 DEMO MODE: Using temporary appointment data');
        appointment = {
            id: appointmentId,
            final_price_clp: overrides?.price || 55000,
            service_type_display: overrides?.serviceName || 'Tratamiento Estético Demo',
            participant_patient_id: 'temp-patient-id',
            patient: {
                name_text: 'Paciente Demo',
                telecom_email: 'demo@neuroventas.com',
                telecom_phone: '+56900000000'
            }
        };
    } else {
        const { data, error } = await supabase
            .from('appointment')
            .select(`
          id,
          final_price_clp,
          service_type_display,
          start_datetime,
          participant_patient_id,
          patient!participant_patient_id (
            name_text,
            telecom_email,
            telecom_phone
          )
        `)
            .eq('id', appointmentId)
            .single();

        if (error || !data) {
            throw new Error(`Appointment not found: ${appointmentId}`);
        }
        appointment = data;
    }

    // Type assertion and null check for patient data
    const patientData = Array.isArray(appointment.patient)
        ? appointment.patient[0]
        : appointment.patient as any;

    if (!patientData) {
        throw new Error('Patient data not found');
    }

    let paymentUrl: string;

    // Use mock payment in development or when enabled
    if (shouldUseMockPayments()) {
        console.log('🧪 MOCK PAYMENT MODE: Using simulated payment gateway');

        const mockResult = await createMockPayment({
            appointmentId,
            patientId: appointment.participant_patient_id,
            patientEmail: patientData.telecom_email,
            patientName: patientData.name_text,
            amount: appointment.final_price_clp
        });

        paymentUrl = mockResult.checkoutUrl;

        // Skip DB update for temp appointment IDs to avoid RLS/FK errors
        if (!appointmentId.startsWith('temp-')) {
            await supabase
                .from('appointment')
                .update({
                    payment_method: 'mock',
                    payment_transaction_id: mockResult.paymentId
                })
                .eq('id', appointmentId);
        }

    } else if (preferredGateway === 'mercadopago') {
        // Only fetch real credentials if not in mock mode
        const credentials = await getClinicPaymentCredentials(
            clinicId,
            preferredGateway,
            process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        );

        const preference = await createPaymentPreference({
            appointmentId,
            patientId: appointment.participant_patient_id,
            patientEmail: patientData.telecom_email,
            patientName: patientData.name_text,
            serviceTitle: appointment.service_type_display,
            amount: appointment.final_price_clp
        });

        paymentUrl = preference.initPoint;

        // Store payment transaction ID
        await supabase
            .from('appointment')
            .update({
                payment_method: 'mercadopago',
                payment_transaction_id: preference.preferenceId
            })
            .eq('id', appointmentId);

    } else {
        // Only fetch real credentials if not in mock mode
        const credentials = await getClinicPaymentCredentials(
            clinicId,
            preferredGateway,
            process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        );

        const tbk = new TransbankPayment(
            credentials.commerce_code,
            credentials.api_key,
            process.env.NODE_ENV === 'production'
        );

        const transaction = await tbk.createTransaction({
            buy_order: appointmentId,
            session_id: `session_${appointmentId}`,
            amount: appointment.final_price_clp,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/transbank/return`
        });

        paymentUrl = transaction.url + '?token_ws=' + transaction.token;

        await supabase
            .from('appointment')
            .update({
                payment_method: 'transbank',
                payment_transaction_id: transaction.token
            })
            .eq('id', appointmentId);
    }

    return {
        paymentUrl,
        appointmentId,
        amount: appointment.final_price_clp
    };
}

/**
 * Process successful payment callback
 * Updates appointment and triggers confirmation flow
 */
export async function confirmPayment(
    appointmentId: string,
    transactionId: string,
    paymentMethod: string
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update appointment with payment confirmation
    const { data, error } = await supabase
        .from('appointment')
        .update({
            payment_status: 'full_paid',
            paid_at: new Date().toISOString(),
            status: 'booked', // Now allowed since payment_status = full_paid
            confirmed: true,
            confirmed_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select()
        .single();

    if (error) {
        throw new Error(`Payment confirmation failed: ${error.message}`);
    }

    // Create audit trail
    await supabase.rpc('create_audit_log', {
        p_action: 'update',
        p_entity_type: 'Appointment',
        p_entity_id: appointmentId,
        p_agent_who: 'payment_system',
        p_outcome: 'success'
    });

    // TODO: Send confirmation email/WhatsApp
    // TODO: Send Google Ads offline conversion

    return data;
}
