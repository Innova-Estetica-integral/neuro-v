/**
 * Psychographic Adapter
 * Adapts UI components and content based on user's psychological profile
 */

export type PsychProfile = 'impulsive' | 'analytic' | 'price_sensitive' | 'hesitant';

export interface UIConfig {
    showScarcityCounters: boolean;
    showTechnicalData: boolean;
    showValuePropositions: boolean;
    showTrustSignals: boolean;
    showTestimonials: boolean;
    showCertifications: boolean;
    urgencyLevel: 'high' | 'medium' | 'low';
    colorScheme: 'urgent' | 'professional' | 'trustworthy' | 'calm';
}

export interface Lead {
    id: string;
    email: string;
    phone?: string;
    name: string;
    psych_profile: PsychProfile;
    scarcity_level: number;
    created_at: string;
    updated_at: string;
    source?: string;
    last_interaction_at?: string;
    is_abandoned: boolean;
}

export interface Appointment {
    id: string;
    lead_id: string;
    appointment_date: string;
    service_type: string;
    service_price?: number;
    payment_status: 'pending' | 'deposit_paid' | 'full_paid';
    is_flash_offer: boolean;
    created_at: string;
    updated_at: string;
    notes?: string;
    confirmed: boolean;
}

/**
 * Get UI configuration based on psychographic profile
 */
export function getUIConfig(profile: PsychProfile): UIConfig {
    switch (profile) {
        case 'impulsive':
            return {
                showScarcityCounters: true,
                showTechnicalData: false,
                showValuePropositions: true,
                showTrustSignals: false,
                showTestimonials: true,
                showCertifications: false,
                urgencyLevel: 'high',
                colorScheme: 'urgent',
            };

        case 'analytic':
            return {
                showScarcityCounters: false,
                showTechnicalData: true,
                showValuePropositions: false,
                showTrustSignals: true,
                showTestimonials: true,
                showCertifications: true,
                urgencyLevel: 'low',
                colorScheme: 'professional',
            };

        case 'price_sensitive':
            return {
                showScarcityCounters: true,
                showTechnicalData: false,
                showValuePropositions: true,
                showTrustSignals: false,
                showTestimonials: false,
                showCertifications: false,
                urgencyLevel: 'medium',
                colorScheme: 'trustworthy',
            };

        case 'hesitant':
            return {
                showScarcityCounters: false,
                showTechnicalData: false,
                showValuePropositions: true,
                showTrustSignals: true,
                showTestimonials: true,
                showCertifications: true,
                urgencyLevel: 'low',
                colorScheme: 'calm',
            };

        default:
            return {
                showScarcityCounters: false,
                showTechnicalData: false,
                showValuePropositions: true,
                showTrustSignals: true,
                showTestimonials: true,
                showCertifications: false,
                urgencyLevel: 'medium',
                colorScheme: 'trustworthy',
            };
    }
}

/**
 * Get color scheme classes based on profile
 */
export function getColorScheme(scheme: UIConfig['colorScheme']): string {
    switch (scheme) {
        case 'urgent':
            return 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500';
        case 'professional':
            return 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900';
        case 'trustworthy':
            return 'bg-gradient-to-br from-green-700 via-teal-600 to-blue-700';
        case 'calm':
            return 'bg-gradient-to-br from-slate-700 via-gray-700 to-zinc-700';
        default:
            return 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900';
    }
}

/**
 * Get messaging copy based on profile
 */
export function getMessaging(profile: PsychProfile) {
    switch (profile) {
        case 'impulsive':
            return {
                headline: '¡Últimos Cupos Disponibles!',
                subheadline: 'No pierdas esta oportunidad única',
                cta: 'Reservar Ahora',
                urgencyText: 'Solo quedan 3 espacios hoy',
            };

        case 'analytic':
            return {
                headline: 'Tecnología de vanguardia en estética',
                subheadline: 'Respaldado por certificaciones internacionales',
                cta: 'Ver Detalles Técnicos',
                urgencyText: 'Agenda una consulta personalizada',
            };

        case 'price_sensitive':
            return {
                headline: 'Mejor precio garantizado',
                subheadline: 'Sin costos ocultos, paga lo justo',
                cta: 'Ver Planes',
                urgencyText: 'Promoción válida hasta fin de mes',
            };

        case 'hesitant':
            return {
                headline: 'Transformación segura y profesional',
                subheadline: 'Miles de clientes satisfechos nos respaldan',
                cta: 'Conocer Más',
                urgencyText: 'Garantía de satisfacción 100%',
            };

        default:
            return {
                headline: 'Tu mejor versión te espera',
                subheadline: 'Profesionales expertos en estética',
                cta: 'Comenzar',
                urgencyText: 'Agenda tu cita hoy',
            };
    }
}

/**
 * Calculate scarcity level based on time and interactions
 */
export function calculateScarcityLevel(
    createdAt: string,
    interactionCount: number,
    hasAbandoned: boolean
): number {
    const now = new Date();
    const created = new Date(createdAt);
    const minutesElapsed = (now.getTime() - created.getTime()) / 1000 / 60;

    let scarcity = 0;

    // Base scarcity increases with time
    if (minutesElapsed > 60) scarcity += 30;
    else if (minutesElapsed > 30) scarcity += 20;
    else if (minutesElapsed > 15) scarcity += 10;

    // Low interaction = higher scarcity
    if (interactionCount < 3) scarcity += 20;

    // Abandoned cart = maximum scarcity
    if (hasAbandoned) scarcity += 50;

    return Math.min(scarcity, 100);
}

/**
 * Determine if user should see flash offer
 */
export function shouldShowFlashOffer(
    profile: PsychProfile,
    scarcityLevel: number
): boolean {
    if (profile === 'impulsive' && scarcityLevel > 50) return true;
    if (profile === 'price_sensitive' && scarcityLevel > 30) return true;
    return false;
}
