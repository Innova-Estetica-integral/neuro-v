/**
 * LTV Retention Matrix - Revenue Engine V6
 * 
 * Purpose: Maximize Customer Lifetime Value through automated retention
 * Strategy: Service-specific renewal cycles (e.g., Botox = 120 days)
 * Automation: Predictive reminders + auto-renewal options
 */

import { createClient } from '@/lib/supabase/server';

export interface ServiceRenewalConfig {
    serviceType: string;
    renewalIntervalDays: number;
    reminderSchedule: number[]; // Days before renewal to send reminder
    autoRenewEnabled: boolean;
    expectedLTV: number; // Expected lifetime value in CLP
}

export interface RetentionSchedule {
    id: string;
    patientId: string;
    patientName: string;
    serviceType: string;
    lastServiceDate: Date;
    nextRenewalDate: Date;
    daysUntilRenewal: number;
    autoRenewEnabled: boolean;
    status: 'active' | 'completed' | 'cancelled' | 'expired';
}

// Service renewal configurations
export const SERVICE_CONFIGS: Record<string, ServiceRenewalConfig> = {
    'botox': {
        serviceType: 'Toxina Botulínica (Botox)',
        renewalIntervalDays: 120, // 4 months
        reminderSchedule: [30, 14, 7, 1], // 30d, 2w, 1w, 1d before
        autoRenewEnabled: true,
        expectedLTV: 500000 // $500k CLP over 2 years
    },
    'filler': {
        serviceType: 'Rellenos Dérmicos (Fillers)',
        renewalIntervalDays: 180, // 6 months
        reminderSchedule: [45, 21, 7],
        autoRenewEnabled: true,
        expectedLTV: 800000
    },
    'laser': {
        serviceType: 'Tratamiento Láser',
        renewalIntervalDays: 90, // 3 months
        reminderSchedule: [30, 14, 3],
        autoRenewEnabled: false,
        expectedLTV: 1200000
    },
    'facial': {
        serviceType: 'Limpieza Facial Profunda',
        renewalIntervalDays: 60, // 2 months
        reminderSchedule: [21, 7, 1],
        autoRenewEnabled: true,
        expectedLTV: 300000
    },
    'peel': {
        serviceType: 'Peeling Químico',
        renewalIntervalDays: 45, // 1.5 months
        reminderSchedule: [14, 7, 2],
        autoRenewEnabled: false,
        expectedLTV: 250000
    }
};

/**
 * Create retention schedule after service completion
 */
export async function createRetentionSchedule(
    patientId: string,
    appointmentId: string,
    serviceType: string
): Promise<string | null> {
    const supabase = await createClient();

    const config = Object.values(SERVICE_CONFIGS).find(
        c => c.serviceType.toLowerCase().includes(serviceType.toLowerCase())
    );

    if (!config) {
        console.log(`No retention config for service: ${serviceType}`);
        return null;
    }

    const { data: appointment } = await supabase
        .from('appointment')
        .select('start_datetime')
        .eq('id', appointmentId)
        .single();

    if (!appointment) return null;

    const lastServiceDate = new Date(appointment.start_datetime);
    const nextRenewalDate = new Date(lastServiceDate);
    nextRenewalDate.setDate(nextRenewalDate.getDate() + config.renewalIntervalDays);

    const { data, error } = await supabase
        .from('retention_schedule')
        .insert({
            patient_id: patientId,
            last_appointment_id: appointmentId,
            service_type: config.serviceType,
            renewal_interval_days: config.renewalIntervalDays,
            last_service_date: lastServiceDate.toISOString().split('T')[0],
            next_renewal_date: nextRenewalDate.toISOString().split('T')[0],
            auto_renewal_enabled: config.autoRenewEnabled,
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating retention schedule:', error);
        return null;
    }

    // Update patient with next renewal date
    await supabase
        .from('patient')
        .update({
            last_service_date: lastServiceDate.toISOString().split('T')[0],
            next_renewal_date: nextRenewalDate.toISOString().split('T')[0]
        })
        .eq('id', patientId);

    return data.id;
}

/**
 * Get active retention schedules due for reminders
 */
export async function getSchedulesDueForReminder(
    daysBeforeRenewal: number
): Promise<RetentionSchedule[]> {
    const supabase = await createClient();

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBeforeRenewal);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('retention_schedule')
        .select(`
      *,
      patient:patient_id (
        name_text,
        telecom_email,
        telecom_whatsapp
      )
    `)
        .eq('status', 'active')
        .eq('next_renewal_date', targetDateStr);

    if (error || !data) {
        console.error('Error fetching schedules:', error);
        return [];
    }

    // Filter by reminder flags
    const reminderField = `reminder_sent_${daysBeforeRenewal}d` as keyof typeof data[0];

    return data
        .filter((schedule: any) => {
            // Create dynamic check for reminder field
            if (daysBeforeRenewal === 30) return !schedule.reminder_sent_30d;
            if (daysBeforeRenewal === 7) return !schedule.reminder_sent_7d;
            if (daysBeforeRenewal === 1) return !schedule.reminder_sent_1d;
            return true;
        })
        .map((schedule: any) => ({
            id: schedule.id,
            patientId: schedule.patient_id,
            patientName: schedule.patient.name_text,
            serviceType: schedule.service_type,
            lastServiceDate: new Date(schedule.last_service_date),
            nextRenewalDate: new Date(schedule.next_renewal_date),
            daysUntilRenewal: Math.ceil(
                (new Date(schedule.next_renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
            autoRenewEnabled: schedule.auto_renewal_enabled,
            status: schedule.status
        }));
}

/**
 * Generate renewal reminder message
 */
export function generateRenewalMessage(
    schedule: RetentionSchedule,
    daysBeforeRenewal: number
): {
    subject: string;
    body: string;
    cta: string;
} {
    const firstName = schedule.patientName.split(' ')[0];
    const config = Object.values(SERVICE_CONFIGS).find(
        c => c.serviceType === schedule.serviceType
    );

    const messages = {
        30: {
            subject: `${firstName}, es hora de renovar tu ${schedule.serviceType} ✨`,
            body: `Hola ${firstName},\n\n¡El tiempo vuela! 🕐\n\nHan pasado ${config?.renewalIntervalDays} días desde tu último ${schedule.serviceType}.\n\n📅 Fecha recomendada de renovación: ${schedule.nextRenewalDate.toLocaleDateString('es-CL')}\n\nPara mantener tus resultados óptimos, es momento de agendar tu próxima sesión.\n\n🎁 BENEFICIO DE CLIENTE VIP:\n- Prioridad en agenda\n- 15% descuento de fidelidad\n- Sin costo de consulta\n\n¿Agendamos tu renovación?`,
            cta: 'Renovar Ahora con Descuento'
        },
        14: {
            subject: `${firstName}, tu renovación está cerca - Agenda prioritaria ⏰`,
            body: `Hola ${firstName},\n\nTu ${schedule.serviceType} necesita renovarse pronto.\n\n📆 Quedan solo 2 semanas para tu fecha óptima de renovación.\n\nComo cliente VIP, tienes:\n✅ Acceso prioritario a agenda\n✅ 15% OFF garantizado\n✅ Recordatorios personalizados\n\nLos cupos se están llenando rápido.\n\n¿Aseguramos tu espacio ahora?`,
            cta: 'Agendar Mi Renovación'
        },
        7: {
            subject: `⚡ ${firstName}, última semana - Ofertas terminando`,
            body: `⚡ ALERTA ${firstName}\n\nTu renovación de ${schedule.serviceType} es EN 7 DÍAS.\n\n🔴 URGENTE: Los cupos preferentes se están agotando\n\n💎 TU OFERTA VIP:\n- 15% descuento fidelidad\n- Prioridad en horarios\n- Producto de regalo\n\n⏰ Oferta válida solo esta semana\n\n¿Confirmamos tu espacio antes que se llene?`,
            cta: '¡SÍ, Confirmar Ahora!'
        },
        1: {
            subject: `🚨 ${firstName}, RENOVACIÓN MAÑANA - Últimos cupos`,
            body: `🚨 RECORDATORIO FINAL ${firstName}\n\nTu ${schedule.serviceType} debe renovarse MAÑANA.\n\n¿Ya agendaste?\n\nSi no, tenemos UNA oportunidad más:\n\n🎁 OFERTA ÚLTIMA HORA:\n- 20% OFF (aumentamos descuento)\n- Cupo disponible: HOY a las 18:00\n- Regalo especial incluido\n\nSi no renuevas pronto, tus resultados comenzarán a disminuir.\n\n¿Tomamos este último cupo?`,
            cta: 'Tomar Último Cupo'
        }
    };

    return messages[daysBeforeRenewal as keyof typeof messages] || messages[30];
}

/**
 * Send renewal reminders
 */
export async function sendRenewalReminders(
    daysBeforeRenewal: number
): Promise<{
    sent: number;
    errors: string[];
}> {
    const supabase = await createClient();
    const errors: string[] = [];
    let sent = 0;

    const schedules = await getSchedulesDueForReminder(daysBeforeRenewal);

    for (const schedule of schedules) {
        try {
            const message = generateRenewalMessage(schedule, daysBeforeRenewal);

            // Create campaign
            const { error: campaignError } = await supabase
                .from('pursuit_campaign')
                .insert({
                    patient_id: schedule.patientId,
                    campaign_type: 'renewal',
                    trigger_event: `${daysBeforeRenewal}d_before_renewal`,
                    channel: 'whatsapp',
                    subject: message.subject,
                    message_body: message.body
                });

            if (campaignError) {
                errors.push(`Failed to create renewal campaign for ${schedule.patientName}`);
                continue;
            }

            // Mark reminder as sent
            const reminderField =
                daysBeforeRenewal === 30 ? 'reminder_sent_30d' :
                    daysBeforeRenewal === 7 ? 'reminder_sent_7d' :
                        daysBeforeRenewal === 1 ? 'reminder_sent_1d' : null;

            if (reminderField) {
                await supabase
                    .from('retention_schedule')
                    .update({ [reminderField]: true })
                    .eq('id', schedule.id);
            }

            // TODO: Send actual WhatsApp/Email
            // await sendMessage('whatsapp', schedule, message);

            sent++;

        } catch (err: any) {
            errors.push(`Error processing schedule ${schedule.id}: ${err.message}`);
        }
    }

    return { sent, errors };
}

/**
 * Calculate predicted LTV for patient
 */
export async function calculatePredictedLTV(patientId: string): Promise<number> {
    const supabase = await createClient();

    // Get patient's service history
    const { data: appointments } = await supabase
        .from('appointment')
        .select('service_price_clp, start_datetime, service_type_display')
        .eq('participant_patient_id', patientId)
        .eq('payment_status', 'full_paid')
        .order('start_datetime', { ascending: false });

    if (!appointments || appointments.length === 0) return 0;

    // Calculate average spend
    const totalSpent = appointments.reduce((sum: number, apt: any) => sum + Number(apt.service_price_clp), 0);
    const avgSpend = totalSpent / appointments.length;

    // Identify primary service
    const serviceCounts = appointments.reduce((acc: any, apt: any) => {
        const type = apt.service_type_display;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const primaryService = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a])[0];

    // Find config for primary service
    const config = Object.values(SERVICE_CONFIGS).find(
        c => primaryService?.toLowerCase().includes(c.serviceType.toLowerCase())
    );

    if (!config) {
        // Simple calculation: average spend * 8 visits over 2 years
        return Math.floor(avgSpend * 8);
    }

    // Calculate visits per year
    const visitsPerYear = Math.floor(365 / config.renewalIntervalDays);

    // Predict 2-year LTV
    const predictedLTV = Math.floor(avgSpend * visitsPerYear * 2);

    // Store prediction
    await supabase
        .from('ltv_prediction')
        .insert({
            patient_id: patientId,
            predicted_ltv_clp: predictedLTV,
            confidence_score: appointments.length >= 3 ? 0.85 : 0.60,
            prediction_factors: {
                avg_spend: avgSpend,
                visit_count: appointments.length,
                primary_service: primaryService,
                visits_per_year: visitsPerYear
            },
            model_version: 'v1.0'
        });

    // Update patient record
    await supabase
        .from('patient')
        .update({ predicted_ltv_clp: predictedLTV })
        .eq('id', patientId);

    return predictedLTV;
}

/**
 * Process auto-renewals
 */
export async function processAutoRenewals(): Promise<{
    renewed: number;
    errors: string[];
}> {
    const supabase = await createClient();
    const errors: string[] = [];
    let renewed = 0;

    // Get schedules due for auto-renewal (renewal date is today)
    const today = new Date().toISOString().split('T')[0];

    const { data: schedules } = await supabase
        .from('retention_schedule')
        .select('*')
        .eq('auto_renewal_enabled', true)
        .eq('next_renewal_date', today)
        .eq('status', 'active');

    if (!schedules) return { renewed: 0, errors };

    for (const schedule of schedules) {
        try {
            // Create new appointment
            const config = Object.values(SERVICE_CONFIGS).find(
                c => c.serviceType === schedule.service_type
            );

            if (!config) continue;

            const appointmentDate = new Date(schedule.next_renewal_date);
            appointmentDate.setHours(10, 0, 0, 0); // Default 10 AM

            const { data: newAppointment, error: aptError } = await supabase
                .from('appointment')
                .insert({
                    participant_patient_id: schedule.patient_id,
                    status: 'proposed',
                    service_type_code: Object.keys(SERVICE_CONFIGS).find(
                        k => SERVICE_CONFIGS[k].serviceType === schedule.service_type
                    ),
                    service_type_display: schedule.service_type,
                    start_datetime: appointmentDate.toISOString(),
                    end_datetime: new Date(appointmentDate.getTime() + (60 * 60 * 1000)).toISOString(),
                    service_price_clp: 50000, // Would fetch from price list
                    discount_percentage: 15, // VIP discount
                    payment_status: 'pending',
                    notes: 'Auto-renewal de cliente VIP'
                })
                .select()
                .single();

            if (aptError) {
                errors.push(`Failed to create auto-renewal appointment: ${aptError.message}`);
                continue;
            }

            // Mark old schedule as completed
            await supabase
                .from('retention_schedule')
                .update({ status: 'completed' })
                .eq('id', schedule.id);

            // Create new retention schedule
            await createRetentionSchedule(
                schedule.patient_id,
                newAppointment.id,
                schedule.service_type
            );

            renewed++;

        } catch (err: any) {
            errors.push(`Error processing auto-renewal ${schedule.id}: ${err.message}`);
        }
    }

    return { renewed, errors };
}
