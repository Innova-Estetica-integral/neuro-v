import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - List all patients
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const clinicId = searchParams.get('clinic_id');

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        let query = supabase
            .from('patient')
            .select('*')
            .order('metadata_created', { ascending: false });

        if (search) {
            query = query.or(`name_text.ilike.%${search}%,telecom_email.ilike.%${search}%`);
        }

        if (clinicId) {
            query = query.eq('clinic_id', clinicId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ patients: data || [] });

    } catch (error) {
        console.error('Get patients error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Update patient
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { patientId, ...updates } = body;

        if (!patientId) {
            return NextResponse.json(
                { error: 'Patient ID required' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('patient')
            .update(updates)
            .eq('id', patientId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ patient: data });

    } catch (error) {
        console.error('Update patient error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
