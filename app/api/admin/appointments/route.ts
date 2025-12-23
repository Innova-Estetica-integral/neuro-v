import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - List appointments
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clinicId = searchParams.get('clinic_id');
        const status = searchParams.get('status');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        let query = supabase
            .from('appointment')
            .select(`
        *,
        patient:participant_patient_id (
          name_text,
          telecom_email,
          telecom_phone
        )
      `)
            .order('start', { ascending: false });

        if (clinicId) query = query.eq('clinic_id', clinicId);
        if (status) query = query.eq('status', status);
        if (startDate) query = query.gte('start', startDate);
        if (endDate) query = query.lte('start', endDate);

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ appointments: data || [] });

    } catch (error) {
        console.error('Get appointments error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create appointment
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const appointmentData = {
            clinic_id: body.clinic_id,
            participant_patient_id: body.patient_id,
            start: body.start,
            end: body.end,
            status: body.status || 'booked',
            service_type_display: body.service_type,
            final_price_clp: body.price,
            location_text: body.location,
            metadata_created: new Date().toISOString(),
            metadata_last_updated: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('appointment')
            .insert(appointmentData)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ appointment: data });

    } catch (error) {
        console.error('Create appointment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Update appointment
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { appointmentId, ...updates } = body;

        if (!appointmentId) {
            return NextResponse.json(
                { error: 'Appointment ID required' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('appointment')
            .update({
                ...updates,
                metadata_last_updated: new Date().toISOString()
            })
            .eq('id', appointmentId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ appointment: data });

    } catch (error) {
        console.error('Update appointment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
