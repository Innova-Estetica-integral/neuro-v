import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/patient/profile
 * Obtiene el perfil del paciente autenticado
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get patient profile
        const { data: patient, error } = await supabase
            .from('patient')
            .select(`
        id,
        name_text,
        telecom_email,
        telecom_phone,
        address_text,
        gender,
        birth_date,
        psychographic_profile,
        created_at
      `)
            .eq('id', user.id)
            .single();

        if (error) {
            throw error;
        }

        if (!patient) {
            return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ patient });

    } catch (error) {
        console.error('Error fetching patient profile:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}

/**
 * PATCH /api/patient/profile
 * Actualiza el perfil del paciente autenticado
 */
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { name_text, telecom_phone, address_text } = body;

        // Validate required fields
        if (!name_text) {
            return NextResponse.json(
                { error: 'El nombre es requerido' },
                { status: 400 }
            );
        }

        // Update patient profile
        const { data: updatedPatient, error } = await supabase
            .from('patient')
            .update({
                name_text,
                telecom_phone,
                address_text,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Perfil actualizado exitosamente',
            patient: updatedPatient,
        });

    } catch (error) {
        console.error('Error updating patient profile:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}
