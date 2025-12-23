import { NextRequest, NextResponse } from 'next/server';
import { createAppointmentCheckout } from '@/lib/business/payment-gating';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { clinicId, serviceId, serviceName, price, userData, appointmentDate } = body;

        // 1. In a production app, we would:
        // - Create/Update patient record (Supabase)
        // - Create appointment record in 'proposed' status
        // - Associate GCLID and UTMS

        // For the demo and high-speed execution, we assume the patient will be created
        // or updated upon successful payment via webhook (closing the loop).

        // 2. Generate checkout URL using the selected payment provider for the clinic
        // (Defaulting to Mercado Pago for demo)
        const checkoutResult = await createAppointmentCheckout(
            'temp-appointment-id', // appointmentId
            clinicId,              // clinicId
            'mercadopago',          // preferredGateway
            { price, serviceName } // Overrides for demo mode
        );

        return NextResponse.json({
            checkoutUrl: checkoutResult.paymentUrl,
            appointmentId: checkoutResult.appointmentId
        });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
