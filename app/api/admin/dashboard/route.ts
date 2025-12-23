import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clinicId = searchParams.get('clinic_id');
        const startDate = searchParams.get('start_date') || new Date(new Date().setDate(1)).toISOString();
        const endDate = searchParams.get('end_date') || new Date().toISOString();

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Total appointments this month
        let appointmentsQuery = supabase
            .from('appointment')
            .select('*', { count: 'exact' })
            .gte('start', startDate)
            .lte('start', endDate);

        if (clinicId) {
            appointmentsQuery = appointmentsQuery.eq('clinic_id', clinicId);
        }

        const { data: appointments, count: totalAppointments } = await appointmentsQuery;

        // Revenue this month (only confirmed/fulfilled)
        const confirmedAppointments = appointments?.filter(
            (apt: any) => apt.status === 'fulfilled' || apt.status === 'booked'
        ) || [];

        const totalRevenue = confirmedAppointments.reduce(
            (sum: number, apt: any) => sum + (apt.final_price_clp || 0),
            0
        );

        // New patients this month
        const { count: newPatients } = await supabase
            .from('patient')
            .select('*', { count: 'exact' })
            .gte('metadata_created', startDate)
            .lte('metadata_created', endDate);

        // Conversion rate (booked / total leads)
        const { count: totalLeads } = await supabase
            .from('patient')
            .select('*', { count: 'exact' });

        const conversionRate = totalLeads ? ((totalAppointments || 0) / totalLeads * 100).toFixed(1) : '0';

        // Appointments by day (for chart)
        const appointmentsByDay = appointments?.reduce((acc: any, apt: any) => {
            const date = new Date(apt.start).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {}) || {};

        const chartData = Object.entries(appointmentsByDay).map(([date, count]) => ({
            date,
            count
        })).sort((a, b) => a.date.localeCompare(b.date));

        // Recent appointments
        const { data: recentAppointments } = await supabase
            .from('appointment')
            .select(`
        *,
        patient:participant_patient_id (
          name_text,
          telecom_email
        )
      `)
            .order('start', { ascending: false })
            .limit(10);

        return NextResponse.json({
            stats: {
                totalAppointments: totalAppointments || 0,
                totalRevenue,
                newPatients: newPatients || 0,
                conversionRate: `${conversionRate}%`
            },
            chartData,
            recentAppointments: recentAppointments || []
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
