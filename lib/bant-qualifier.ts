/**
 * BANT Qualifier - Revenue Engine V6
 * 
 * BANT Framework:
 * - Budget: Minimum $30,000 CLP required
 * - Authority: Decision maker identification
 * - Need: Pain point severity scoring
 * - Timeline: Expected purchase timeframe
 * 
 * Purpose: Auto-disqualify low-value leads and prioritize high-intent prospects
 */

export type BANTStatus = 'unqualified' | 'qualified' | 'disqualified' | 'pending';

export interface BANTScore {
    budget: number; // In CLP
    budgetScore: number; // 0-100
    authority: boolean;
    authorityScore: number; // 0-100
    need: number; // 0-100
    needScore: number; // 0-100
    timeline: number; // Days
    timelineScore: number; // 0-100
    totalScore: number; // 0-100
    status: BANTStatus;
    qualifiedAt?: Date;
    disqualifiedReason?: string;
}

export interface BANTQualificationInput {
    budget?: number;
    authority?: boolean;
    needAnswers?: string[]; // Responses to need-qualification questions
    timeline?: number; // Days until expected purchase
    jobTitle?: string;
    companySize?: string;
}

const MINIMUM_BUDGET_CLP = 30000;
const QUALIFIED_THRESHOLD = 70; // Total score must be >= 70 to qualify

/**
 * Calculate budget score
 * Linear scale from $30k to $500k+
 */
function calculateBudgetScore(budget: number): number {
    if (budget < MINIMUM_BUDGET_CLP) return 0;
    if (budget >= 500000) return 100;

    // Linear interpolation between 30k and 500k
    return Math.floor(((budget - MINIMUM_BUDGET_CLP) / (500000 - MINIMUM_BUDGET_CLP)) * 100);
}

/**
 * Calculate authority score
 * Based on job title and decision-making power
 */
function calculateAuthorityScore(
    authority: boolean,
    jobTitle?: string
): number {
    if (!authority) return 0;

    // High authority titles
    const highAuthorityTitles = [
        'owner', 'dueño', 'director', 'ceo', 'gerente general',
        'presidente', 'socio', 'fundador'
    ];

    // Medium authority titles
    const mediumAuthorityTitles = [
        'gerente', 'jefe', 'coordinador', 'encargado'
    ];

    if (!jobTitle) return 50; // Default if they claim authority but no title

    const titleLower = jobTitle.toLowerCase();

    if (highAuthorityTitles.some(title => titleLower.includes(title))) {
        return 100;
    }

    if (mediumAuthorityTitles.some(title => titleLower.includes(title))) {
        return 70;
    }

    return 40; // Low authority
}

/**
 * Calculate need score
 * Based on urgency and pain point severity
 */
function calculateNeedScore(needAnswers?: string[]): number {
    if (!needAnswers || needAnswers.length === 0) return 30; // Default low need

    let score = 0;

    // High urgency indicators
    const urgentKeywords = [
        'urgente', 'inmediato', 'ya', 'pronto', 'necesito',
        'problema', 'crisis', 'perdiendo', 'competencia'
    ];

    // Pain point indicators
    const painKeywords = [
        'difícil', 'complicado', 'frustrado', 'lento', 'caro',
        'ineficiente', 'manual', 'error', 'pérdida'
    ];

    const allText = needAnswers.join(' ').toLowerCase();

    // Count urgency indicators
    const urgencyCount = urgentKeywords.filter(kw => allText.includes(kw)).length;
    const painCount = painKeywords.filter(kw => allText.includes(kw)).length;

    // Scoring
    score += Math.min(urgencyCount * 15, 50); // Max 50 for urgency
    score += Math.min(painCount * 10, 50); // Max 50 for pain points

    return Math.min(score, 100);
}

/**
 * Calculate timeline score
 * Shorter timeline = higher score
 */
function calculateTimelineScore(timeline: number): number {
    if (timeline <= 7) return 100; // Within week
    if (timeline <= 14) return 90; // Within 2 weeks
    if (timeline <= 30) return 75; // Within month
    if (timeline <= 60) return 50; // Within 2 months
    if (timeline <= 90) return 30; // Within quarter
    return 10; // More than 90 days
}

/**
 * Main BANT qualification function
 */
export function qualifyBANT(input: BANTQualificationInput): BANTScore {
    const budget = input.budget || 0;
    const authority = input.authority || false;
    const timeline = input.timeline || 999;

    // Calculate individual scores
    const budgetScore = calculateBudgetScore(budget);
    const authorityScore = calculateAuthorityScore(authority, input.jobTitle);
    const needScore = calculateNeedScore(input.needAnswers);
    const timelineScore = calculateTimelineScore(timeline);

    // Weighted total score
    // Budget: 40%, Authority: 25%, Need: 20%, Timeline: 15%
    const totalScore = Math.floor(
        (budgetScore * 0.4) +
        (authorityScore * 0.25) +
        (needScore * 0.2) +
        (timelineScore * 0.15)
    );

    // Determine status
    let status: BANTStatus = 'pending';
    let disqualifiedReason: string | undefined;

    // Auto-disqualify if budget below minimum
    if (budget < MINIMUM_BUDGET_CLP) {
        status = 'disqualified';
        disqualifiedReason = `Budget below minimum requirement ($${MINIMUM_BUDGET_CLP.toLocaleString('es-CL')} CLP)`;
    }
    // Qualified if total score >= threshold
    else if (totalScore >= QUALIFIED_THRESHOLD) {
        status = 'qualified';
    }
    // Disqualify if very low scores
    else if (totalScore < 40) {
        status = 'disqualified';
        disqualifiedReason = 'Low BANT score (insufficient budget, authority, need, or timeline)';
    }

    const result: BANTScore = {
        budget,
        budgetScore,
        authority,
        authorityScore,
        need: needScore,
        needScore,
        timeline,
        timelineScore,
        totalScore,
        status,
        disqualifiedReason
    };

    if (status === 'qualified') {
        result.qualifiedAt = new Date();
    }

    return result;
}

/**
 * Get recommended next action based on BANT status
 */
export function getBANTRecommendation(score: BANTScore): {
    action: string;
    priority: 'high' | 'medium' | 'low';
    message: string;
} {
    switch (score.status) {
        case 'qualified':
            return {
                action: 'schedule_call',
                priority: 'high',
                message: 'Lead calificado - Agendar consulta inmediatamente'
            };

        case 'pending':
            if (score.budgetScore < 50) {
                return {
                    action: 'nurture_budget',
                    priority: 'medium',
                    message: 'Educar sobre ROI y opciones de financiamiento'
                };
            }
            if (score.authorityScore < 50) {
                return {
                    action: 'identify_decision_maker',
                    priority: 'medium',
                    message: 'Identificar tomador de decisiones real'
                };
            }
            return {
                action: 'nurture',
                priority: 'low',
                message: 'Lead en evaluación - Continuar nutriendo'
            };

        case 'disqualified':
            return {
                action: 'discard',
                priority: 'low',
                message: score.disqualifiedReason || 'Lead descalificado'
            };

        case 'unqualified':
        default:
            return {
                action: 'qualify',
                priority: 'medium',
                message: 'Completar calificación BANT'
            };
    }
}

/**
 * Generate BANT qualification questions
 */
export function getBANTQuestions(): {
    budget: string[];
    authority: string[];
    need: string[];
    timeline: string[];
} {
    return {
        budget: [
            '¿Cuál es tu presupuesto estimado para este tratamiento?',
            '¿Has considerado opciones de financiamiento?',
            '¿Qué inversión estás dispuesto a hacer en tu bienestar?'
        ],
        authority: [
            '¿Eres tú quien toma la decisión final sobre este tratamiento?',
            '¿Necesitas consultar con alguien más antes de decidir?',
            '¿Cuál es tu rol/posición?'
        ],
        need: [
            '¿Qué te motiva a buscar este tratamiento ahora?',
            '¿Qué problema específico quieres resolver?',
            '¿Qué tan urgente es esto para ti?',
            '¿Qué has intentado antes?'
        ],
        timeline: [
            '¿Cuándo te gustaría comenzar el tratamiento?',
            '¿Hay alguna fecha límite o evento especial?',
            '¿Estás listo para agendar hoy mismo?'
        ]
    };
}

/**
 * Priority scoring for lead routing
 * Combines BANT with behavioral signals
 */
export function calculateLeadPriority(
    bantScore: BANTScore,
    psychProfile: 'impulsive' | 'analytic' | 'price_sensitive' | 'hesitant',
    scarcityLevel: number
): {
    priority: number; // 1-100
    routing: 'hot' | 'warm' | 'cold';
    recommendedChannel: 'call' | 'whatsapp' | 'email';
} {
    let priority = bantScore.totalScore;

    // Boost for impulsive profiles
    if (psychProfile === 'impulsive') {
        priority += 10;
    }

    // Boost for high scarcity
    if (scarcityLevel >= 70) {
        priority += 15;
    }

    // Normalize
    priority = Math.min(priority, 100);

    // Determine routing
    let routing: 'hot' | 'warm' | 'cold';
    let recommendedChannel: 'call' | 'whatsapp' | 'email';

    if (priority >= 80) {
        routing = 'hot';
        recommendedChannel = 'call';
    } else if (priority >= 60) {
        routing = 'warm';
        recommendedChannel = 'whatsapp';
    } else {
        routing = 'cold';
        recommendedChannel = 'email';
    }

    return {
        priority,
        routing,
        recommendedChannel
    };
}
