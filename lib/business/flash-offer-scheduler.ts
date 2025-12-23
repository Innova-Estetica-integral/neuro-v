import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage } from '../integrations/whatsapp';

/**
 * Flash Offer Engine: Gap Detection & Automated Discounts
 * Detects <24h calendar gaps and triggers 20% OFF offers to price_sensitive leads
 */

export interface CalendarGap {
    clinic_id: string;
    gap_start: Date;
    gap_end: Date;
    duration_minutes: number;
    recommended_service: string;
}

/**
 * Detect gaps in clinic's calendar within next 24 hours
 */
export async function detectCalendarGaps(
    clinicId: string,
    minDurationMinutes: number = 60
): Promise<CalendarGap[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get all appointments in next 24h
    const { data: appointments } = await supabase
        .from('appointment')
        .select('start_datetime, end_datetime, service_type_display')
        .eq('clinic_id', clinicId)
        .eq('status', 'booked')
        .gte('start_datetime', now.toISOString())
        .lte('start_datetime', next24h.toISOString())
        .order('start_datetime', { ascending: true });

    if (!appointments || appointments.length === 0) {
        // No appointments - entire day is a gap
        return [{
            clinic_id: clinicId,
            gap_start: now,
            gap_end: next24h,
            duration_minutes: 24 * 60,
            recommended_service: 'Any service'
        }];
    }

    const gaps: CalendarGap[] = [];

    // Check gap before first appointment
    const firstAppointment = new Date(appointments[0].start_datetime);
    const gapBeforeFirst = (firstAppointment.getTime() - now.getTime()) / (1000 * 60);

    if (gapBeforeFirst >= minDurationMinutes) {
        gaps.push({
            clinic_id: clinicId,
            gap_start: now,
            gap_end: firstAppointment,
            duration_minutes: gapBeforeFirst,
            recommended_service: appointments[0].service_type_display
        });
    }

    // Check gaps between appointments
    for (let i = 0; i < appointments.length - 1; i++) {
        const currentEnd = new Date(appointments[i].end_datetime);
        const nextStart = new Date(appointments[i + 1].start_datetime);
        const gapDuration = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);

        if (gapDuration >= minDurationMinutes) {
            gaps.push({
                clinic_id: clinicId,
                gap_start: currentEnd,
                gap_end: nextStart,
                duration_minutes: gapDuration,
                recommended_service: appointments[i + 1].service_type_display
            });
        }
    }

    // Check gap after last appointment
    const lastAppointment = new Date(appointments[appointments.length - 1].end_datetime);
    const gapAfterLast = (next24h.getTime() - lastAppointment.getTime()) / (1000 * 60);

    if (gapAfterLast >= minDurationMinutes) {
        gaps.push({
            clinic_id: clinicId,
            gap_start: lastAppointment,
            gap_end: next24h,
            duration_minutes: gapAfterLast,
            recommended_service: 'Express service'
        });
    }

    return gaps;
}

/**
 * Create flash offer (20% OFF) for detected gap
 */
export async function createFlashOffer(
    clinicId: string,
    gap: CalendarGap,
    discountPercentage: number = 20,
    expiresInHours: number = 12
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    // Find price_sensitive leads who haven't booked yet
    const { data: targetLeads } = await supabase
        .from('patient')
        .select('id, name_text, telecom_whatsapp, psych_profile')
        .eq('clinic_id', clinicId)
        .eq('psych_profile', 'price_sensitive')
        .eq('is_abandoned', true)
        .is('next_renewal_date', null); // Not already scheduled

    if (!targetLeads || targetLeads.length === 0) {
        return { sent: 0, message: 'No price_sensitive leads found' };
    }

    let sentCount = 0;

    for (const lead of targetLeads) {
        const message = `🔥 FLASH OFFER para ${lead.name_text}!

⏰ Hueco disponible: ${gap.gap_start.toLocaleString('es-CL')}
💰 20% OFF (solo ${expiresInHours} horas)
⚡ Cupo limitado: Solo 1 persona puede reservarlo

¿Quieres aprovechar este descuento exclusivo? Responde SÍ para reservar.

Expira: ${expiresAt.toLocaleString('es-CL')}`;

        try {
            await sendWhatsAppMessage(lead.telecom_whatsapp, message);

            // Log pursuit campaign
            await supabase.from('pursuit_campaign').insert({
                clinic_id: clinicId,
                patient_id: lead.id,
                campaign_type: 'flash_offer',
                trigger_event: `gap_detected_${gap.duration_minutes}min`,
                channel: 'whatsapp',
                subject: 'Flash Offer 20% OFF',
                message_body: message
            });

            sentCount++;
        } catch (error) {
            console.error(`Failed to send flash offer to ${lead.id}:`, error);
        }
    }

    return {
        sent: sentCount,
        gap: gap,
        expires_at: expiresAt
    };
}

/**
 * Scheduled job: Run every hour to detect and send flash offers
 */
export async function runFlashOfferScheduler() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all active clinics
    const { data: clinics } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('is_active', true);

    if (!clinics) return;

    for (const clinic of clinics) {
        const gaps = await detectCalendarGaps(clinic.id);

        for (const gap of gaps) {
            await createFlashOffer(clinic.id, gap);
        }
    }
}
