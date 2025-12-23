import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/admin/patients/[id]
 * Obtiene un paciente específico con su historial
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get user's clinic
        const { data: profile } = await supabase
            .from('profiles')
            .select('clinic_id')
            .eq('id', user.id)
            .single();

        if (!profile?.clinic_id) {
            return NextResponse.json({ error: 'Sin clínica asociada' }, { status: 403 });
        }

        // Get patient with appointments
        const { data: patient, error: patientError } = await supabase
            .from('patient')
            .select(`
        *,
        appointments:appointment (
          id,
          start_time,
          status,
          service_type,
         payment_status,
          price,
          created_at
        )
      `)
            .eq('id', params.id)
            .eq('clinic_id', profile.clinic_id)
            .single();

        if (patientError) {
            if (patientError.code === 'PGRST116') {
                return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
            }
            throw patientError;
        }

        // Get BANT score if exists
        const { data: bantData } = await supabase
            .from('bant_scores')
            .select('*')
            .eq('patient_id', params.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        return NextResponse.json({
            patient: {
                ...patient,
                bant_score: bantData,
            },
        });

    } catch (error) {
        console.error('Error fetching patient:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}

/**
 * PATCH /api/admin/patients/[id]
 * Actualiza información del paciente
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get user's clinic
        const { data: profile } = await supabase
            .from('profiles')
            .select('clinic_id')
            .eq('id', user.id)
            .single();

        if (!profile?.clinic_id) {
            return NextResponse.json({ error: 'Sin clínica asociada' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name_text,
            telecom_email,
            telecom_phone,
            address_text,
            gender,
            birth_date,
            psychographic_profile,
        } = body;

        // Validate required fields
        if (!name_text) {
            return NextResponse.json(
                { error: 'El nombre es requerido' },
                { status: 400 }
            );
        }

        // Update patient
        const { data: updatedPatient, error } = await supabase
            .from('patient')
            .update({
                name_text,
                telecom_email,
                telecom_phone,
                address_text,
                gender,
                birth_date,
                psychographic_profile,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .eq('clinic_id', profile.clinic_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Paciente actualizado exitosamente',
            patient: updatedPatient,
        });

    } catch (error) {
        console.error('Error updating patient:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}

/**
 * DELETE /api/admin/patients/[id]
 * Elimina un paciente (soft delete)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get user's clinic
        const { data: profile } = await supabase
            .from('profiles')
            .select('clinic_id')
            .eq('id', user.id)
            .single();

        if (!profile?.clinic_id) {
            return NextResponse.json({ error: 'Sin clínica asociada' }, { status: 403 });
        }

        // Check if patient has appointments
        const { count } = await supabase
            .from('appointment')
            .select('id', { count: 'exact', head: true })
            .eq('patient_id', params.id)
            .neq('status', 'cancelled');

        if (count && count > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar paciente con citas activas' },
                { status: 400 }
            );
        }

        // Soft delete: mark as inactive
        const { data: deletedPatient, error } = await supabase
            .from('patient')
            .update({
                active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .eq('clinic_id', profile.clinic_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Paciente eliminado exitosamente',
            patient: deletedPatient,
        });

    } catch (error) {
        console.error('Error deleting patient:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}
