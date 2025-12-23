/**
 * Mercado Pago Webhook Handler
 * 
 * Handles payment notifications from Mercado Pago
 * Updates appointment status on payment confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleWebhookNotification } from '@/lib/payment/mercado-pago';
import { createAuditLog } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    try {
        const body = await req.json();

        // Mercado Pago sends: { action, api_version, data: { id }, date_created, id, live_mode, type, user_id }
        const { type, data } = body;

        if (type !== 'payment') {
            return NextResponse.json({ status: 'ignored' }, { status: 200 });
        }

        const paymentId = data.id;

        // Verify payment
        const paymentResult = await handleWebhookNotification('payment', paymentId);

        if (!paymentResult.success) {
            console.error('Payment verification failed:', paymentResult.error);
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        // Get payment details to find appointment
        const { data: paymentData } = await supabase
            .from('appointment')
            .select('*')
            .eq('payment_transaction_id', paymentId)
            .single();

        if (!paymentData) {
            // Try to find by external reference (appointment_id)
            // This requires storing the preference ID or using metadata
            console.log('Appointment not found for payment:', paymentId);
            return NextResponse.json({ status: 'appointment_not_found' }, { status: 404 });
        }

        // Update appointment based on payment status
        if (paymentResult.status === 'approved') {
            const { error: updateError } = await supabase
                .from('appointment')
                .update({
                    payment_status: 'full_paid',
                    status: 'booked',
                    paid_at: new Date().toISOString(),
                    confirmed: true,
                    confirmed_at: new Date().toISOString(),
                    payment_method: 'mercadopago',
                })
                .eq('id', paymentData.id);

            if (updateError) {
                console.error('Failed to update appointment:', updateError);
                return NextResponse.json({ error: 'Update failed' }, { status: 500 });
            }

            // Update patient total spent
            const { data: currentPatient } = await supabase
                .from('patient')
                .select('total_spent_clp')
                .eq('id', paymentData.participant_patient_id)
                .single();

            const currentSpent = Number(currentPatient?.total_spent_clp || 0);
            const newTotal = currentSpent + (paymentResult.amount || 0);

            await supabase
                .from('patient')
                .update({
                    is_abandoned: false,
                    scarcity_level: 0,
                    total_spent_clp: newTotal,
                    last_interaction_at: new Date().toISOString(),
                })
                .eq('id', paymentData.participant_patient_id);

            // Create audit log
            await createAuditLog({
                action: 'update',
                entityType: 'Appointment',
                entityId: paymentData.id,
                agentWho: 'system:mercadopago',
                outcome: 'success',
                description: `Payment approved: ${paymentId}`,
            });

            // TODO: Send confirmation email/WhatsApp
            // TODO: Create calendar event
            // TODO: Send offline conversion to Google Ads

        } else if (paymentResult.status === 'rejected') {
            await supabase
                .from('appointment')
                .update({
                    payment_status: 'failed',
                    status: 'cancelled',
                    cancellation_reason: 'Payment rejected',
                })
                .eq('id', paymentData.id);
        }

        return NextResponse.json({
            status: 'processed',
            payment_status: paymentResult.status,
        });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Mercado Pago also sends GET requests for testing
export async function GET(req: NextRequest) {
    return NextResponse.json({ status: 'webhook_active' });
}
