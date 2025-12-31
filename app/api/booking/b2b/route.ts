import { NextResponse } from 'next/server';
import { googleCalendarService } from '@/lib/integrations/google-calendar';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, date, time } = body;

        if (!name || !email || !date || !time) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        // Calculate start/end time (simplified example)
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + 30 * 60000); // 30 mins session

        const booking = await googleCalendarService.createB2BEvent({
            customerName: name,
            customerEmail: email,
            startTime: start.toISOString(),
            endTime: end.toISOString()
        });

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            link: booking.htmlLink,
            isMock: (booking as any).isMock
        });

    } catch (error: any) {
        console.error('B2B Booking Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
