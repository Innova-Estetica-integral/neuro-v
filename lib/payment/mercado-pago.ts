/**
 * Mercado Pago Integration - Revenue Engine V6
 * 
 * Purpose: Primary payment gateway for Chilean market
 * Features: Checkout preferences, payment verification, webhooks
 */

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    options: {
        timeout: 5000,
    }
});

const preference = new Preference(client);
const payment = new Payment(client);

export interface PaymentPreferenceData {
    appointmentId: string;
    patientId: string;
    patientEmail: string;
    patientName: string;
    serviceTitle: string;
    amount: number; // In CLP
    discountPercentage?: number;
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    status?: string;
    amount?: number;
    error?: string;
}

/**
 * Create payment preference (checkout URL)
 */
export async function createPaymentPreference(
    data: PaymentPreferenceData
): Promise<{
    preferenceId: string;
    initPoint: string; // Checkout URL
    sandboxInitPoint: string;
}> {
    const finalAmount = data.discountPercentage
        ? data.amount * (1 - data.discountPercentage / 100)
        : data.amount;

    const preferenceData = {
        body: {
            items: [
                {
                    id: data.appointmentId,
                    title: data.serviceTitle,
                    description: `Reserva de cita - ${data.serviceTitle}`,
                    quantity: 1,
                    unit_price: finalAmount,
                    currency_id: 'CLP',
                },
            ],
            payer: {
                name: data.patientName,
                email: data.patientEmail,
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?appointment_id=${data.appointmentId}`,
                failure: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/failure?appointment_id=${data.appointmentId}`,
                pending: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/pending?appointment_id=${data.appointmentId}`,
            },
            auto_return: 'approved' as const,
            external_reference: data.appointmentId,
            notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`,
            metadata: {
                appointment_id: data.appointmentId,
                patient_id: data.patientId,
            },
            statement_descriptor: 'CLINICA ESTETICA',
            binary_mode: true, // Only approved or rejected (no pending)
        },
    };

    const result = await preference.create(preferenceData);

    return {
        preferenceId: result.id!,
        initPoint: result.init_point!,
        sandboxInitPoint: result.sandbox_init_point!,
    };
}

/**
 * Verify payment status
 */
export async function verifyPayment(paymentId: string): Promise<PaymentResult> {
    try {
        const paymentData = await payment.get({ id: paymentId });

        return {
            success: paymentData.status === 'approved',
            paymentId: paymentData.id?.toString(),
            status: paymentData.status,
            amount: paymentData.transaction_amount,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Process refund
 * TODO: Fix refund API - current SDK version doesn't support this method
 */
export async function processRefund(
    paymentId: string,
    amount?: number
): Promise<{ success: boolean; refundId?: string; error?: string }> {
    // Temporarily disabled - SDK API changed
    return {
        success: false,
        error: 'Refund functionality temporarily unavailable. Contact support.'
    };

    /* Original code - API not available in current SDK
    try {
        const refund = await payment.refund({
            id: paymentId,
            body: amount ? { amount } : undefined,
        });

        return {
            success: true,
            refundId: refund.id?.toString(),
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
    */
}

/**
 * Handle webhook notification
 */
export async function handleWebhookNotification(
    topic: string,
    resourceId: string
): Promise<PaymentResult> {
    if (topic !== 'payment') {
        return { success: false, error: 'Invalid topic' };
    }

    return await verifyPayment(resourceId);
}
