/**
 * Abandoned Cart Pursuit System - Revenue Engine V6
 * 
 * Trigger Strategy:
 * - 15 minutes: Soft reminder (gentle nudge)
 * - 2 hours: Urgency + scarcity (limited spots)
 * - EOD: Ultimatum + flash offer (last chance)
 * 
 * Personalization: Profile-specific messaging
 * Channels: Email + WhatsApp
 */

import { createClient } from '@/lib/supabase/server';

export type PursuitTrigger = '15min' | '2h' | 'eod';
export type PursuitChannel = 'email' | 'whatsapp' | 'sms';

export interface AbandonedCart {
    appointmentId: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    psychProfile: 'impulsive' | 'analytic' | 'price_sensitive' | 'hesitant';
    serviceType: string;
    servicePrice: number;
    createdAt: Date;
    minutesSinceCreated: number;
    scarcityLevel: number;
}

export interface PursuitMessage {
    subject: string;
    body: string;
    cta: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Find abandoned carts ready for pursuit
 */
export async function findAbandonedCarts(trigger: PursuitTrigger): Promise<AbandonedCart[]> {
    const supabase = await createClient();

    let minMinutes: number;
    let maxMinutes: number;

    switch (trigger) {
        case '15min':
            minMinutes = 15;
            maxMinutes = 30; // Don't spam if already sent
            break;
        case '2h':
            minMinutes = 120;
            maxMinutes = 150;
            break;
        case 'eod':
            // End of day: 6-8 hours
            minMinutes = 360;
            maxMinutes = 480;
            break;
    }

    const cutoffMin = new Date(Date.now() - (maxMinutes * 60 * 1000));
    const cutoffMax = new Date(Date.now() - (minMinutes * 60 * 1000));

    const { data, error } = await supabase
        .from('appointment')
        .select(`
      id,
      participant_patient_id,
      service_type_display,
      service_price_clp,
      created_at,
      patient:participant_patient_id (
        id,
        name_text,
        telecom_email,
        telecom_whatsapp,
        psych_profile,
        scarcity_level
      )
    `)
        .eq('payment_status', 'pending')
        .eq('status', 'proposed')
        .gte('created_at', cutoffMin.toISOString())
        .lte('created_at', cutoffMax.toISOString());

    if (error || !data) {
        console.error('Error finding abandoned carts:', error);
        return [];
    }

    // Check if already contacted for this trigger
    const appointmentIds = data.map((apt: any) => apt.id);

    const { data: existingCampaigns } = await supabase
        .from('pursuit_campaign')
        .select('appointment_id')
        .in('appointment_id', appointmentIds)
        .eq('trigger_event', trigger);

    const contactedIds = new Set(existingCampaigns?.map((c: any) => c.appointment_id) || []);

    return data
        .filter((apt: any) => !contactedIds.has(apt.id))
        .map((apt: any) => ({
            appointmentId: apt.id,
            patientId: apt.patient.id,
            patientName: apt.patient.name_text,
            patientEmail: apt.patient.telecom_email,
            patientPhone: apt.patient.telecom_whatsapp,
            psychProfile: apt.patient.psych_profile,
            serviceType: apt.service_type_display,
            servicePrice: apt.service_price_clp,
            createdAt: new Date(apt.created_at),
            minutesSinceCreated: Math.floor((Date.now() - new Date(apt.created_at).getTime()) / (1000 * 60)),
            scarcityLevel: apt.patient.scarcity_level
        }));
}

/**
 * Generate pursuit message based on profile and trigger
 */
export function generatePursuitMessage(
    cart: AbandonedCart,
    trigger: PursuitTrigger
): PursuitMessage {
    const firstName = cart.patientName.split(' ')[0];
    const price = cart.servicePrice.toLocaleString('es-CL');

    // Profile-specific messaging
    const messages = {
        '15min': {
            impulsive: {
                subject: `${firstName}, ¡tu cupo se está agotando! ⚡`,
                body: `Hola ${firstName},\n\nVimos que estabas a punto de agendar tu ${cart.serviceType}.\n\n⏰ Los cupos se están llenando RÁPIDO. Solo quedan 2 espacios disponibles hoy.\n\nNo pierdas esta oportunidad de transformar tu imagen.\n\n💰 Precio: $${price} CLP\n🎯 Cupos restantes: 2\n\n¿Lista para confirmar?`,
                cta: 'Confirmar Ahora',
                urgencyLevel: 'high' as const
            },
            analytic: {
                subject: `${firstName}, completemos tu evaluación`,
                body: `Hola ${firstName},\n\nNotamos que iniciaste el proceso de agendamiento para ${cart.serviceType}.\n\nNuestro equipo médico está listo para tu consulta personalizada donde:\n\n✓ Evaluaremos tu caso específico\n✓ Diseñaremos un plan de tratamiento a medida\n✓ Responderemos todas tus preguntas técnicas\n\n💰 Inversión: $${price} CLP\n📊 Tasa de satisfacción: 97%\n\n¿Agendamos tu evaluación?`,
                cta: 'Agendar Evaluación',
                urgencyLevel: 'low' as const
            },
            price_sensitive: {
                subject: `${firstName}, precio especial válido por tiempo limitado`,
                body: `Hola ${firstName},\n\nBuenas noticias: El precio que viste para ${cart.serviceType} está garantizado por las próximas 24 horas.\n\n💰 Tu precio: $${price} CLP\n✅ Garantía de mejor precio\n✅ Facilidades de pago disponibles\n✅ Sin costos ocultos\n\nEste precio especial expira pronto.\n\n¿Quieres asegurar tu cupo?`,
                cta: 'Asegurar Precio',
                urgencyLevel: 'medium' as const
            },
            hesitant: {
                subject: `${firstName}, estamos aquí para ayudarte`,
                body: `Hola ${firstName},\n\nVimos que estabas interesada en ${cart.serviceType}. Es normal tener dudas.\n\nNuestro equipo ha ayudado a más de 500 personas como tú a conseguir los resultados que desean.\n\n💯 Garantía de satisfacción\n🏥 Clínica certificada\n👨‍⚕️ Médicos especialistas\n\n¿Tienes alguna pregunta? Estamos para ayudarte.\n\n💰 Inversión: $${price} CLP`,
                cta: 'Resolver Dudas',
                urgencyLevel: 'low' as const
            }
        },
        '2h': {
            impulsive: {
                subject: `⚠️ ${firstName}, ÚLTIMA OPORTUNIDAD - Cupos casi agotados`,
                body: `⚠️ ALERTA ${firstName},\n\nHan pasado 2 horas y tu cupo para ${cart.serviceType} está a punto de liberarse.\n\n🔴 SOLO QUEDA 1 CUPO HOY\n⏰ Se liberará en 15 minutos\n💰 $${price} CLP\n\nOtras personas están viendo este mismo horario.\n\n¿Confirmas AHORA o liberamos tu cupo?`,
                cta: '¡CONFIRMAR YA!',
                urgencyLevel: 'critical' as const
            },
            analytic: {
                subject: `${firstName}, información adicional sobre tu tratamiento`,
                body: `Hola ${firstName},\n\nPara ayudarte en tu decisión sobre ${cart.serviceType}, aquí está la información técnica completa:\n\n📋 Procedimiento:\n- Duración: 45-60 minutos\n- Anestesia: Local (indoloro)\n- Recuperación: Inmediata\n- Resultados: Visibles en 7-14 días\n\n📊 Evidencia clínica:\n- 97% de satisfacción\n- 10+ años de experiencia\n- Certificación internacional\n\n💰 Inversión: $${price} CLP\n\n¿Necesitas más detalles técnicos?`,
                cta: 'Ver Detalles Completos',
                urgencyLevel: 'medium' as const
            },
            price_sensitive: {
                subject: `${firstName}, agregamos 10% descuento adicional 🎁`,
                body: `¡Excelente noticia ${firstName}!\n\nPara ${cart.serviceType}, acabamos de aprobar un descuento adicional del 10% especialmente para ti.\n\n💰 Precio original: $${price} CLP\n🎯 Tu precio especial: $${Math.floor(cart.servicePrice * 0.9).toLocaleString('es-CL')} CLP\n💝 Ahorras: $${Math.floor(cart.servicePrice * 0.1).toLocaleString('es-CL')} CLP\n\n⏰ Válido solo por 2 horas más\n\nEste es el mejor precio que podemos ofrecer.\n\n¿Aprovechamos este descuento?`,
                cta: 'Aprovechar Descuento',
                urgencyLevel: 'high' as const
            },
            hesitant: {
                subject: `${firstName}, testimonios de pacientes como tú`,
                body: `Hola ${firstName},\n\nSabemos que elegir es importante. Por eso queremos que conozcas a personas que ya dieron el paso:\n\n⭐⭐⭐⭐⭐ "Fue la mejor decisión. El equipo me acompañó en todo momento."\n- Carolina M., ${cart.serviceType}\n\n⭐⭐⭐⭐⭐ "Tenía miedo, pero la experiencia fue increíble. Resultados superaron mis expectativas."\n- Andrea P., ${cart.serviceType}\n\n📱 ¿Quieres hablar con alguien que ya lo hizo?\n💯 Garantía de satisfacción total\n💰 $${price} CLP\n\n¿Agendamos una llamada sin compromiso?`,
                cta: 'Hablar con Especialista',
                urgencyLevel: 'low' as const
            }
        },
        'eod': {
            impulsive: {
                subject: `🚨 ${firstName}, CIERRE OFICIAL - Flash Offer 20% OFF`,
                body: `🚨 ÚLTIMA LLAMADA ${firstName}\n\nEste es el ÚLTIMO mensaje.\n\nPor la cancelación de hoy, activamos FLASH OFFER:\n\n⚡ 20% OFF en ${cart.serviceType}\n💰 Precio normal: $${price} CLP\n🎯 TU PRECIO: $${Math.floor(cart.servicePrice * 0.8).toLocaleString('es-CL')} CLP\n\n⏰ EXPIRA A MEDIANOCHE (en ${24 - new Date().getHours()} horas)\n\nDespués de esto, precio vuelve a normal.\n\nÚLTIMA OPORTUNIDAD. ¿SÍ o NO?`,
                cta: '¡QUIERO MI 20% OFF!',
                urgencyLevel: 'critical' as const
            },
            analytic: {
                subject: `${firstName}, análisis completo de costo-beneficio`,
                body: `Hola ${firstName},\n\nPara cerrar el día, aquí está el análisis completo de ${cart.serviceType}:\n\n📊 RETORNO DE INVERSIÓN:\n- Inversión única: $${price} CLP\n- Duración resultados: 4-6 meses\n- Costo mensual: ~$${Math.floor(cart.servicePrice / 5).toLocaleString('es-CL')} CLP\n- Valor intangible: Confianza y bienestar\n\n✅ GARANTÍAS:\n- Satisfacción 100% o devolución\n- Seguimiento médico incluido\n- Retoque gratis si necesario\n\n📈 +500 casos exitosos documentados\n\n¿Programamos tu procedimiento?`,
                cta: 'Revisar Propuesta',
                urgencyLevel: 'medium' as const
            },
            price_sensitive: {
                subject: `${firstName}, FLASH 20% OFF + Financiamiento 0% interés`,
                body: `🎁 OFERTA FINAL ${firstName}\n\nPara ${cart.serviceType}:\n\n💎 PROMOCIÓN DOBLE:\n1️⃣ 20% descuento inmediato\n2️⃣ Pago en 3 cuotas SIN interés\n\n💰 Precio: $${Math.floor(cart.servicePrice * 0.8).toLocaleString('es-CL')} CLP\n📅 3 cuotas de: $${Math.floor((cart.servicePrice * 0.8) / 3).toLocaleString('es-CL')} CLP\n\n⏰ Solo válido HOY\n🎯 Cupos limitados: 1\n\nEsta es nuestra MEJOR oferta del año.\n\nNo volverás a ver este precio.\n\n¿Lo tomamos?`,
                cta: 'ACEPTAR OFERTA',
                urgencyLevel: 'critical' as const
            },
            hesitant: {
                subject: `${firstName}, garantía extendida especial para ti`,
                body: `Hola ${firstName},\n\nEntendemos que tomar la decisión sobre ${cart.serviceType} no es fácil.\n\nPor eso, solo para ti, activamos:\n\n🛡️ GARANTÍA EXTENDIDA:\n✅ 60 días de satisfacción garantizada\n✅ Consultas ilimitadas post-procedimiento\n✅ Retoque gratis si no estás 100% feliz\n✅ Opción de cambio de tratamiento\n\n💯 CERO RIESGO para ti\n\n💰 Inversión: $${price} CLP\n👥 +500 pacientes satisfechos\n\n¿Te sentirías más tranquila con estas garantías?\n\nEstamos para cuidarte. 💙`,
                cta: 'Sí, con Garantías Procedo',
                urgencyLevel: 'medium' as const
            }
        }
    };

    return messages[trigger][cart.psychProfile];
}

/**
 * Execute pursuit campaign
 */
export async function executePursuitCampaign(
    trigger: PursuitTrigger,
    channel: PursuitChannel = 'whatsapp'
): Promise<{
    contacted: number;
    errors: string[];
}> {
    const supabase = await createClient();
    const errors: string[] = [];
    let contacted = 0;

    // Find abandoned carts
    const carts = await findAbandonedCarts(trigger);

    if (carts.length === 0) {
        return { contacted: 0, errors: [] };
    }

    // Send messages
    for (const cart of carts) {
        try {
            const message = generatePursuitMessage(cart, trigger);

            // Create campaign record
            const { error: campaignError } = await supabase
                .from('pursuit_campaign')
                .insert({
                    patient_id: cart.patientId,
                    appointment_id: cart.appointmentId,
                    campaign_type: 'abandoned_cart',
                    trigger_event: trigger,
                    channel,
                    subject: message.subject,
                    message_body: message.body
                });

            if (campaignError) {
                errors.push(`Failed to create campaign for ${cart.patientEmail}`);
                continue;
            }

            // TODO: Send actual message via channel (WhatsApp/Email)
            // await sendMessage(channel, cart, message);

            contacted++;

            // Update patient scarcity level
            await supabase
                .from('patient')
                .update({
                    scarcity_level: Math.min(cart.scarcityLevel + (trigger === 'eod' ? 30 : 15), 100)
                })
                .eq('id', cart.patientId);

        } catch (err: any) {
            errors.push(`Error processing cart ${cart.appointmentId}: ${err.message}`);
        }
    }

    return { contacted, errors };
}

/**
 * Scheduled job: Run all pursuit triggers
 */
export async function runPursuitScheduler() {
    const results = {
        '15min': await executePursuitCampaign('15min'),
        '2h': await executePursuitCampaign('2h'),
        'eod': await executePursuitCampaign('eod')
    };

    return results;
}
