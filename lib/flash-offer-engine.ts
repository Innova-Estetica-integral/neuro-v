/**
 * Flash Offer Engine - Revenue Engine V6
 * 
 * Purpose: Detect calendar gaps <24h and trigger automatic 20% discounts
 * Target: price_sensitive profiles for maximum conversion
 * Distribution: WhatsApp notifications
 */

import { createClient } from '@/lib/supabase/server';

export interface CalendarGap {
    date: Date;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    serviceType: string;
    normalPrice: number;
    discountedPrice: number;
    expiresAt: Date;
}

export interface FlashOffer {
    id: string;
    gapId: string;
    patientId: string;
    discountPercentage: number;
    originalPrice: number;
    finalPrice: number;
    validUntil: Date;
    sentVia: 'whatsapp' | 'email' | 'sms';
    sentAt: Date;
    clicked: boolean;
    converted: boolean;
}

const FLASH_OFFER_DISCOUNT = 20; // 20% OFF
const GAP_THRESHOLD_HOURS = 24;
const OFFER_EXPIRATION_HOURS = 12;

/**
 * Detect calendar gaps within next 24 hours
 */
export async function detectCalendarGaps(): Promise<CalendarGap[]> {
    const supabase = await createClient();

    const now = new Date();
    const tomorrow = new Date(now.getTime() + (GAP_THRESHOLD_HOURS * 60 * 60 * 1000));

    // Query appointments in next 24 hours
    const { data: appointments, error } = await supabase
        .from('appointment')
        .select('*')
        .gte('start_datetime', now.toISOString())
        .lte('start_datetime', tomorrow.toISOString())
        .order('start_datetime', { ascending: true });

    if (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }

    const gaps: CalendarGap[] = [];

    // Business hours: 9 AM - 7 PM
    const businessStart = 9;
    const businessEnd = 19;

    // Check each day in the next 24 hours
    const checkDate = new Date(now);
    checkDate.setHours(businessStart, 0, 0, 0);

    while (checkDate < tomorrow) {
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(businessEnd, 0, 0, 0);

        // Get appointments for this day
        const dayAppointments = appointments?.filter((apt: any) => {
            const aptDate = new Date(apt.start_datetime);
            return aptDate.toDateString() === checkDate.toDateString();
        }) || [];

        // If no appointments at all, entire day is a gap
        if (dayAppointments.length === 0) {
            gaps.push({
                date: new Date(checkDate),
                startTime: `${businessStart}:00`,
                endTime: `${businessEnd}:00`,
                durationMinutes: (businessEnd - businessStart) * 60,
                serviceType: 'any',
                normalPrice: 50000, // Base price
                discountedPrice: 50000 * (1 - FLASH_OFFER_DISCOUNT / 100),
                expiresAt: new Date(Date.now() + (OFFER_EXPIRATION_HOURS * 60 * 60 * 1000))
            });
        } else {
            // Find gaps between appointments
            let lastEnd = checkDate;

            for (const apt of dayAppointments) {
                const aptStart = new Date(apt.start_datetime);
                const gapMinutes = (aptStart.getTime() - lastEnd.getTime()) / (1000 * 60);

                // If gap >= 60 minutes, create flash offer
                if (gapMinutes >= 60) {
                    gaps.push({
                        date: new Date(lastEnd),
                        startTime: lastEnd.toTimeString().slice(0, 5),
                        endTime: aptStart.toTimeString().slice(0, 5),
                        durationMinutes: gapMinutes,
                        serviceType: apt.service_type || 'any',
                        normalPrice: apt.service_price_clp || 50000,
                        discountedPrice: (apt.service_price_clp || 50000) * (1 - FLASH_OFFER_DISCOUNT / 100),
                        expiresAt: new Date(Date.now() + (OFFER_EXPIRATION_HOURS * 60 * 60 * 1000))
                    });
                }

                lastEnd = new Date(apt.end_datetime);
            }

            // Check gap after last appointment
            const finalGapMinutes = (dayEnd.getTime() - lastEnd.getTime()) / (1000 * 60);
            if (finalGapMinutes >= 60) {
                gaps.push({
                    date: new Date(lastEnd),
                    startTime: lastEnd.toTimeString().slice(0, 5),
                    endTime: dayEnd.toTimeString().slice(0, 5),
                    durationMinutes: finalGapMinutes,
                    serviceType: 'any',
                    normalPrice: 50000,
                    discountedPrice: 50000 * (1 - FLASH_OFFER_DISCOUNT / 100),
                    expiresAt: new Date(Date.now() + (OFFER_EXPIRATION_HOURS * 60 * 60 * 1000))
                });
            }
        }

        // Move to next day
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(businessStart, 0, 0, 0);
    }

    return gaps;
}

/**
 * Get price-sensitive leads for flash offer targeting
 */
export async function getPriceSensitiveLeads(
    excludeRecentOffers: boolean = true
): Promise<any[]> {
    const supabase = await createClient();

    let query = supabase
        .from('patient')
        .select('*')
        .eq('psych_profile', 'price_sensitive')
        .eq('active', true)
        .is('next_renewal_date', null); // Don't spam existing customers

    if (excludeRecentOffers) {
        // Exclude leads who received offer in last 48 hours
        const cutoff = new Date(Date.now() - (48 * 60 * 60 * 1000));
        // This would require a join with pursuit_campaign table
        // Simplified for now
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching price-sensitive leads:', error);
        return [];
    }

    return data || [];
}

/**
 * Create and dispatch flash offers
 */
export async function dispatchFlashOffers(): Promise<{
    created: number;
    sent: number;
    errors: string[];
}> {
    const supabase = await createClient();
    const errors: string[] = [];

    // 1. Detect gaps
    const gaps = await detectCalendarGaps();

    if (gaps.length === 0) {
        return { created: 0, sent: 0, errors: [] };
    }

    // 2. Get target leads
    const leads = await getPriceSensitiveLeads();

    if (leads.length === 0) {
        errors.push('No price-sensitive leads found');
        return { created: 0, sent: 0, errors };
    }

    let created = 0;
    let sent = 0;

    // 3. Create offers for each gap
    for (const gap of gaps) {
        for (const lead of leads.slice(0, 5)) { // Max 5 leads per gap
            try {
                // Create appointment with flash offer
                const { data: appointment, error: aptError } = await supabase
                    .from('appointment')
                    .insert({
                        participant_patient_id: lead.id,
                        status: 'proposed',
                        service_type_code: 'flash-offer',
                        service_type_display: `Flash Offer: ${gap.serviceType}`,
                        start_datetime: gap.date.toISOString(),
                        end_datetime: new Date(gap.date.getTime() + (gap.durationMinutes * 60 * 1000)).toISOString(),
                        service_price_clp: gap.normalPrice,
                        discount_percentage: FLASH_OFFER_DISCOUNT,
                        is_flash_offer: true,
                        flash_offer_expires_at: gap.expiresAt.toISOString(),
                        payment_status: 'pending'
                    })
                    .select()
                    .single();

                if (aptError) {
                    errors.push(`Failed to create appointment for ${lead.telecom_email}: ${aptError.message}`);
                    continue;
                }

                created++;

                // 4. Create pursuit campaign record
                const message = generateFlashOfferMessage(lead, gap);

                const { error: campaignError } = await supabase
                    .from('pursuit_campaign')
                    .insert({
                        patient_id: lead.id,
                        appointment_id: appointment.id,
                        campaign_type: 'flash_offer',
                        trigger_event: 'gap_detected',
                        channel: 'whatsapp',
                        subject: '⚡ OFERTA FLASH: 20% OFF',
                        message_body: message
                    });

                if (campaignError) {
                    errors.push(`Failed to create campaign for ${lead.telecom_email}`);
                    continue;
                }

                // 5. Send WhatsApp (would integrate with WhatsApp API)
                // For now, just mark as sent
                sent++;

                // TODO: Actual WhatsApp dispatch
                // await sendWhatsAppMessage(lead.telecom_whatsapp, message);

            } catch (err: any) {
                errors.push(`Error processing lead ${lead.id}: ${err.message}`);
            }
        }
    }

    return { created, sent, errors };
}

/**
 * Generate personalized flash offer message
 */
function generateFlashOfferMessage(lead: any, gap: CalendarGap): string {
    const name = lead.name_given?.[0] || 'Cliente';
    const price = gap.discountedPrice.toLocaleString('es-CL');
    const time = gap.startTime;
    const date = gap.date.toLocaleDateString('es-CL', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return `¡Hola ${name}! ⚡

Tenemos una OFERTA FLASH exclusiva para ti:

🎯 20% OFF en tu tratamiento
💰 Precio especial: $${price} CLP
📅 ${date} a las ${time}
⏰ Esta oferta expira en 12 horas

Este cupo está disponible SOLO porque tuvimos una cancelación de última hora.

¿Quieres aprovechar esta oportunidad?

Responde "SÍ" para agendar ahora 👇`;
}

/**
 * Check if flash offer converted
 */
export async function checkFlashOfferConversions() {
    const supabase = await createClient();

    // Get all active flash offers
    const { data: flashOffers } = await supabase
        .from('appointment')
        .select(`
      *,
      pursuit_campaign!inner(*)
    `)
        .eq('is_flash_offer', true)
        .eq('pursuit_campaign.campaign_type', 'flash_offer')
        .eq('pursuit_campaign.converted', false)
        .gt('flash_offer_expires_at', new Date().toISOString());

    if (!flashOffers) return;

    // Check for conversions (payment completed)
    for (const offer of flashOffers) {
        if (offer.payment_status === 'full_paid') {
            // Mark campaign as converted
            await supabase
                .from('pursuit_campaign')
                .update({
                    converted: true,
                    converted_at: new Date().toISOString(),
                    conversion_value_clp: offer.final_price_clp
                })
                .eq('appointment_id', offer.id);

            // Update patient
            await supabase
                .from('patient')
                .update({
                    is_abandoned: false,
                    scarcity_level: 0
                })
                .eq('id', offer.participant_patient_id);
        }
    }
}

/**
 * Expire old flash offers
 */
export async function expireFlashOffers() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('appointment')
        .update({ status: 'cancelled', cancellation_reason: 'Flash offer expired' })
        .eq('is_flash_offer', true)
        .eq('payment_status', 'pending')
        .lt('flash_offer_expires_at', new Date().toISOString())
        .select();

    return data?.length || 0;
}
