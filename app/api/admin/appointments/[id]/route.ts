import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatApiError } from '@/lib/utils/error-handler';

/**
 * GET /api/admin/appointments/[id]
 * Obtiene una cita específica
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

        // Get appointment with patient info
        const { data: appointment, error } = await supabase
            .from('appointment')
            .select(`
        *,
        patient:patient_id (
          id,
          name_text,
          telecom_email,
          telecom_phone,
          psychographic_profile
        ),
        practitioner:practitioner_id (
          id,
          name_text
        )
      `)
            .eq('id', params.id)
            .eq('clinic_id', profile.clinic_id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ appointment });

    } catch (error) {
        console.error('Error fetching appointment:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}

/**
 * PATCH /api/admin/appointments/[id]
 * Actualiza una cita
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
        const { start_time, status, service_type, practitioner_id, notes } = body;

        // Update appointment
        const { data: updatedAppointment, error } = await supabase
            .from('appointment')
            .update({
                start_time,
                status,
                service_type,
                practitioner_id,
                notes,
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
            message: 'Cita actualizada exitosamente',
            appointment: updatedAppointment,
        });

    } catch (error) {
        console.error('Error updating appointment:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}

/**
 * DELETE /api/admin/appointments/[id]
 * Cancela una cita (soft delete)
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

        // Soft delete: set status to cancelled
        const { data: cancelledAppointment, error } = await supabase
            .from('appointment')
            .update({
                status: 'cancelled',
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
            message: 'Cita cancelada exitosamente',
            appointment: cancelledAppointment,
        });

    } catch (error) {
        console.error('Error cancelling appointment:', error);
        const apiError = formatApiError(error);
        return NextResponse.json(
            { error: apiError.error },
            { status: apiError.statusCode }
        );
    }
}
