/**
 * Transbank Webhook Handler
 * 
 * Handles return callback from Transbank Webpay Plus
 * Commits transaction and updates appointment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { commitTransaction } from '@/lib/payment/transbank';
import { createAuditLog } from '@/lib/audit-logger';
import { billingService } from '@/lib/integrations/billing-service';

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    try {
        const formData = await req.formData();
        const token = formData.get('token_ws') as string;

        if (!token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?error=no_token`
            );
        }

        // Commit transaction
        const result = await commitTransaction(token);

        if (!result.success) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?error=${encodeURIComponent(result.error || 'unknown')}`
            );
        }

        // Extract appointment ID from buy_order
        // Format: ORD-{appointmentId}-{timestamp}
        const appointmentId = result.buyOrder?.split('-')[1];

        if (!appointmentId) {
            console.error('Could not extract appointment ID from buy order:', result.buyOrder);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?error=invalid_order`
            );
        }

        // Update appointment
        const { error: updateError } = await supabase
            .from('appointment')
            .update({
                payment_status: 'full_paid',
                status: 'booked',
                paid_at: new Date().toISOString(),
                confirmed: true,
                confirmed_at: new Date().toISOString(),
                payment_method: 'transbank',
                payment_transaction_id: result.authorizationCode,
            })
            .eq('id', appointmentId);

        if (updateError) {
            console.error('Failed to update appointment:', updateError);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?error=update_failed`
            );
        }

        // Get appointment to update patient
        const { data: appointment } = await supabase
            .from('appointment')
            .select('participant_patient_id, final_price_clp')
            .eq('id', appointmentId)
            .single();

        if (appointment) {
            // Get current total spent
            const { data: patientData } = await supabase
                .from('patient')
                .select('total_spent_clp')
                .eq('id', appointment.participant_patient_id)
                .single();

            const currentTotal = patientData?.total_spent_clp || 0;
            const newTotal = currentTotal + (result.amount || 0);

            // Update patient
            await supabase
                .from('patient')
                .update({
                    is_abandoned: false,
                    scarcity_level: 0,
                    total_spent_clp: newTotal,
                    last_interaction_at: new Date().toISOString(),
                })
                .eq('id', appointment.participant_patient_id);
        }


        // Create audit log
        await createAuditLog({
            action: 'update',
            entityType: 'Appointment',
            entityId: appointmentId,
            agentWho: 'system:transbank',
            outcome: 'success',
            description: `Payment approved: ${result.authorizationCode}`,
        });

        // --- NEW: Generate Electronic Boleta ---
        try {
            const { data: appointmentData } = await supabase
                .from('appointment')
                .select('*, patient(*), clinics(*)')
                .eq('id', appointmentId)
                .single();

            if (appointmentData) {
                const billingRequest = {
                    customerName: appointmentData.patient.full_name,
                    customerEmail: appointmentData.patient.email,
                    items: [
                        {
                            name: 'Servicio Clínico NeuroV',
                            quantity: 1,
                            price: result.amount || 0
                        }
                    ],
                    paymentType: 'cre' as const,
                    externalId: result.authorizationCode
                };

                await billingService.processBillingAfterPayment(
                    appointmentData.clinic_id,
                    appointmentId,
                    billingRequest
                );
            }
        } catch (billingErr) {
            console.error('Non-blocking billing error in Transbank Return:', billingErr);
        }
        // --- END: Generate Electronic Boleta ---

        // TODO: Send confirmation email/WhatsApp
        // TODO: Send offline conversion to Google Ads

        // Redirect to success page
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?appointment_id=${appointmentId}`
        );

    } catch (error: any) {
        console.error('Transbank webhook error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?error=server_error`
        );
    }
}

export async function GET(req: NextRequest) {
    // Handle in case Transbank sends GET
    return await POST(req);
}
