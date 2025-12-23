import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatApiError } from '@/lib/utils/error-handler';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's clinic_id from profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('clinic_id')
            .eq('id', user.id)
            .single();

        if (!profile?.clinic_id) {
            return NextResponse.json({ error: 'No clinic associated' }, { status: 403 });
        }

        const clinicId = profile.clinic_id;
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || '30d';

        // Calculate date range
        const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
        const days = daysMap[range] || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch stats in parallel
        const [
            leadCountResult,
            appointmentCountResult,
            revenueResult,
            dailyAppointmentsResult,
            recentAppointmentsResult,
        ] = await Promise.all([
            // Total leads
            supabase
                .from('patient')
                .select('id', { count: 'exact', head: true })
                .eq('clinic_id', clinicId),

            // Confirmed appointments
            supabase
                .from('appointment')
                .select('id', { count: 'exact', head: true })
                .eq('clinic_id', clinicId)
                .eq('status', 'confirmed'),

            // Total revenue (completed paid appointments)
            supabase
                .from('appointment')
                .select('price')
                .eq('clinic_id', clinicId)
                .eq('payment_status', 'full_paid')
                .eq('status', 'completed'),

            // Daily appointments for chart (last N days)
            supabase
                .from('appointment')
                .select('start_time')
                .eq('clinic_id', clinicId)
                .gte('start_time', startDate.toISOString())
                .order('start_time', { ascending: true }),

            // Recent appointments with patient info
            supabase
                .from('appointment')
                .select(`
          id,
          start_time,
          service_type,
          status,
          price,
          patient:patient_id (
            id,
            name,
            email
          )
        `)
                .eq('clinic_id', clinicId)
                .order('created_at', { ascending: false })
                .limit(10),
        ]);

        // Process revenue
        const totalRevenue = (revenueResult.data || []).reduce(
            (sum, apt) => sum + (apt.price || 0),
            0
        );

        // Process daily appointments for chart
        const dailyMap = new Map<string, number>();
        (dailyAppointmentsResult.data || []).forEach((apt) => {
            const date = new Date(apt.start_time).toISOString().split('T')[0];
            dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
        });

        const dailyAppointments = Array.from(dailyMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate conversion rate
        const totalLeads = leadCountResult.count || 0;
        const confirmedAppointments = appointmentCountResult.count || 0;
        const conversionRate = totalLeads > 0
            ? ((confirmedAppointments / totalLeads) * 100).toFixed(1)
            : '0.0';

        return NextResponse.json({
            totalLeads,
            confirmedAppointments,
            totalRevenue,
            conversionRate: parseFloat(conversionRate),
            dailyAppointments,
            recentAppointments: recentAppointmentsResult.data || [],
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}
