// UTM Parameter Utilities
// Tools for parsing, managing, and routing based on UTM campaign parameters

export interface UTMParams {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    content?: string | null;
    term?: string | null;
}

/**
 * Parse UTM parameters from URLSearchParams
 */
export function parseUTM(searchParams: URLSearchParams): UTMParams {
    return {
        source: searchParams.get('utm_source'),
        medium: searchParams.get('utm_medium'),
        campaign: searchParams.get('utm_campaign'),
        content: searchParams.get('utm_content'),
        term: searchParams.get('utm_term')
    };
}

/**
 * Determine if traffic should be redirected to Growth landing page
 * based on UTM source
 */
export function shouldRedirectToGrowth(utm: UTMParams): boolean {
    // Sources that indicate marketing/sales-focused audience
    const growthSources = [
        'instagram',
        'facebook',
        'tiktok',
        'whatsapp',
        'google_ads',
        'facebook_ads',
        'social'
    ];

    if (!utm.source) return false;

    return growthSources.some(source =>
        utm.source?.toLowerCase().includes(source)
    );
}

/**
 * Determine if traffic should stay on Technical landing page
 * based on UTM source
 */
export function shouldStayOnTechnical(utm: UTMParams): boolean {
    // Sources that indicate technical/medical audience
    const technicalSources = [
        'linkedin',
        'medical',
        'doctor',
        'tech',
        'engineering',
        'healthcare'
    ];

    if (!utm.source) return false;

    return technicalSources.some(source =>
        utm.source?.toLowerCase().includes(source)
    );
}

/**
 * Generate a campaign URL with UTM parameters
 */
export function generateCampaignURL(
    baseURL: string,
    campaign: {
        source: string;
        medium: string;
        campaign: string;
        content?: string;
        term?: string;
    }
): string {
    const url = new URL(baseURL);

    url.searchParams.set('utm_source', campaign.source);
    url.searchParams.set('utm_medium', campaign.medium);
    url.searchParams.set('utm_campaign', campaign.campaign);

    if (campaign.content) {
        url.searchParams.set('utm_content', campaign.content);
    }

    if (campaign.term) {
        url.searchParams.set('utm_term', campaign.term);
    }

    return url.toString();
}

/**
 * Preserve UTM parameters when navigating
 */
export function preserveUTMParams(
    targetPath: string,
    currentSearchParams: URLSearchParams
): string {
    const utm = parseUTM(currentSearchParams);
    const hasUTM = Object.values(utm).some(v => v != null);

    if (!hasUTM) return targetPath;

    const url = new URL(targetPath, window.location.origin);

    Object.entries(utm).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(`utm_${key}`, value);
        }
    });

    return url.pathname + url.search;
}

/**
 * Get campaign name for analytics
 */
export function getCampaignName(utm: UTMParams): string {
    if (utm.campaign) return utm.campaign;
    if (utm.source) return `${utm.source}_${utm.medium || 'organic'}`;
    return 'direct';
}
