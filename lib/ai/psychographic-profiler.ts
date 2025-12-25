import { createClient } from '@supabase/supabase-js';

/**
 * Real-Time Psychographic Profiler
 * Classifies users in <30 seconds based on behavioral patterns
 */

export type PsychProfile = 'impulsive' | 'analytic' | 'price_sensitive' | 'hesitant';

export interface BehaviorData {
    timeOnPage: number; // seconds
    clicksCount: number;
    scrollDepth: number; // percentage (0-100)
    viewedPricing: boolean;
    viewedTestimonials: boolean;
    viewedServices: boolean;
    deviceType: string;
    exitIntentTriggered: boolean;
}

/**
 * AI Classification Algorithm
 * Uses behavioral heuristics to categorize in <30s
 */
export function classifyPsychographicProfile(behavior: BehaviorData): PsychProfile {
    const { timeOnPage, clicksCount, viewedPricing, viewedTestimonials, scrollDepth, exitIntentTriggered } = behavior;

    // IMPULSIVE: Quick decision makers
    if (timeOnPage < 30 && clicksCount > 5 && scrollDepth > 70) {
        return 'impulsive';
    }

    // ANALYTIC: Research-oriented, detail seekers
    if (viewedTestimonials && timeOnPage > 120 && scrollDepth > 80) {
        return 'analytic';
    }

    // PRICE SENSITIVE: Focus on pricing, bounce probability high
    if (viewedPricing && timeOnPage > 60 && clicksCount < 3) {
        return 'price_sensitive';
    }

    // HESITANT: Indecisive, needs reassurance
    if (exitIntentTriggered || (timeOnPage > 90 && clicksCount < 5)) {
        return 'hesitant';
    }

    // Default fallback
    return 'hesitant';
}

/**
 * Dynamic UI Configuration per Profile
 */
export function getUIConfig(profile: PsychProfile) {
    const configs = {
        impulsive: {
            cta: 'RESERVAR AHORA',
            ctaStyle: 'bg-red-600 hover:bg-red-700 animate-pulse',
            urgency: 'high',
            showCountdown: true,
            showScarcity: true,
            animations: 'fast',
            headline: '¡Solo quedan 3 cupos hoy!',
            subheadline: 'Agenda en 60 segundos y asegura tu transformación',
            showTestimonials: false,
            showPricing: true,
            emphasize: 'results'
        },
        analytic: {
            cta: 'Ver Detalles Científicos',
            ctaStyle: 'bg-blue-600 hover:bg-blue-700',
            urgency: 'low',
            showCountdown: false,
            showScarcity: false,
            animations: 'smooth',
            headline: 'Tecnología Dermatológica de Vanguardia',
            subheadline: 'Certificados internacionales y evidencia clínica',
            showTestimonials: true,
            showPricing: false,
            emphasize: 'credentials'
        },
        price_sensitive: {
            cta: 'Ver Promociones',
            ctaStyle: 'bg-green-600 hover:bg-green-700',
            urgency: 'medium',
            showCountdown: true,
            showScarcity: false,
            animations: 'smooth',
            headline: '20% OFF en Huecos de Última Hora',
            subheadline: 'Aprovecha descuentos exclusivos hoy',
            showTestimonials: false,
            showPricing: true,
            emphasize: 'savings'
        },
        hesitant: {
            cta: 'Agendar Consulta Sin Compromiso',
            ctaStyle: 'bg-purple-600 hover:bg-purple-700',
            urgency: 'low',
            showCountdown: false,
            showScarcity: false,
            animations: 'gentle',
            headline: 'Tu Primera Consulta es 100% Confidencial',
            subheadline: 'Sin presión. Habla con un experto y decide después.',
            showTestimonials: true,
            showPricing: false,
            emphasize: 'safety'
        }
    };

    return configs[profile];
}

/**
 * Track and update patient psychographic profile in real-time
 */
export async function updatePatientProfile(
    patientId: string,
    clinicId: string,
    behaviorData: BehaviorData
) {
    const profile = classifyPsychographicProfile(behaviorData);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update patient with detected profile
    const { error: updateError } = await supabase
        .from('patient')
        .update({
            psych_profile: profile,
            last_interaction_at: new Date().toISOString(),
            ltv_total: 0 // Placeholder: would be updated by billing events
        })
        .eq('id', patientId)
        .eq('clinic_id', clinicId);

    if (updateError) {
        console.error('Failed to update psychographic profile:', updateError);
    }

    // Create behavior session record
    const { error: sessionError } = await supabase
        .from('behavior_session')
        .insert({
            clinic_id: clinicId,
            patient_id: patientId,
            duration_sec: behaviorData.timeOnPage,
            page_views: 1,
            clicks: behaviorData.clicksCount,
            scroll_depth_max: behaviorData.scrollDepth,
            viewed_pricing: behaviorData.viewedPricing,
            viewed_testimonials: behaviorData.viewedTestimonials,
            viewed_services: behaviorData.viewedServices,
            exit_intent_triggered: behaviorData.exitIntentTriggered,
            device_type: behaviorData.deviceType,
            ended_at: new Date().toISOString()
        });

    if (sessionError) {
        console.error('Failed to create behavior session:', sessionError);
    }

    return profile;
}

/**
 * Get personalized pursuit message based on profile
 */
export function getPursuitMessage(
    profile: PsychProfile,
    tier: '15min' | '2h' | 'eod',
    patientName: string
): string {
    const messages = {
        impulsive: {
            '15min': `¡${patientName}! Tu cupo se va a liberar en 10 minutos si no confirmas. ¿Lista para brillar? 🔥`,
            '2h': `⚠️ ALERTA ${patientName}: Solo queda 1 cupo hoy. Otras personas están viendo este mismo horario. ¿Confirmas AHORA?`,
            'eod': `🚨 ÚLTIMA LLAMADA ${patientName}: FLASH OFFER: 20% OFF si confirmas antes de medianoche. Después de esto, precio vuelve a normal. ¿SÍ o NO?`
        },
        analytic: {
            '15min': `Hola ${patientName}, notamos que estabas revisando información sobre nuestros tratamientos. ¿Necesitas más datos técnicos antes de decidir?`,
            '2h': `${patientName}, basados en tu perfil, este procedimiento tiene una efectividad comprobada del 94.2%. ¿Agendamos tu evaluación?`,
            'eod': `${patientName}, te enviamos el estudio científico completo por email. Si tienes dudas técnicas, responde este mensaje.`
        },
        price_sensitive: {
            '15min': `${patientName}, vimos que estabas comparando precios. Tenemos un descuento exclusivo disponible hoy. ¿Quieres saber más?`,
            '2h': `DESCUENTO ESPECIAL para ${patientName}: 15% OFF si confirmas en las próximas 2 horas. Solo por hoy.`,
            'eod': `💰 ${patientName}: Tu mejor precio está aquí: 20% OFF hasta medianoche. Mañana vuelve al precio regular ($XX.XXX).`
        },
        hesitant: {
            '15min': `Hola ${patientName}, entendemos que es una decisión importante. ¿Quieres hablar con un especialista sin compromiso?`,
            '2h': `${patientName}, tu privacidad es garantizada. Puedes hacer todas las preguntas que necesites antes de decidir.`,
            'eod': `${patientName}, estamos aquí para ti. Si no estás lista hoy, podemos reagendar cuando te sientas cómoda. Sin presión.`
        }
    };

    return messages[profile][tier];
}
