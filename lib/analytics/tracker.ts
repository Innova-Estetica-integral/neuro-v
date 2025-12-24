// Analytics Tracking Utility
// Unified wrapper for Vercel Analytics and development logging

type AnalyticsEvent = string;
type AnalyticsProperties = Record<string, any>;

class Analytics {
    /**
     * Track a custom event
     */
    track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
        // Vercel Analytics (if available)
        if (typeof window !== 'undefined' && (window as any).va) {
            (window as any).va('event', event, properties);
        }

        // Console logging in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics]', event, properties || {});
        }

        // You can add other analytics providers here
        // Example: PostHog, Mixpanel, etc.
    }

    /**
     * Track a page view
     */
    page(name: string, properties?: AnalyticsProperties) {
        this.track('page_view', { page: name, ...properties });
    }

    /**
     * Track user identification
     */
    identify(userId: string, traits?: AnalyticsProperties) {
        this.track('identify', { userId, ...traits });
    }

    /**
     * Track Sales Assistant interactions
     */
    salesAssistant = {
        opened: (mode: 'technical' | 'growth') => {
            this.track('sales_assistant_opened', { mode });
        },
        stepCompleted: (step: string, data?: AnalyticsProperties) => {
            this.track('sales_assistant_step_completed', { step, ...data });
        },
        qualified: (status: 'elite' | 'growth', revenue: number) => {
            this.track('sales_assistant_qualified', { status, revenue });
        },
        ctaClicked: (destination: string) => {
            this.track('sales_assistant_cta_clicked', { destination });
        }
    };

    /**
     * Track Booking Wizard funnel
     */
    bookingWizard = {
        started: (qualified: boolean) => {
            this.track('booking_wizard_started', { qualified });
        },
        stepCompleted: (step: number, stepName: string) => {
            this.track('booking_wizard_step_completed', { step, stepName });
        },
        abandoned: (lastStep: number) => {
            this.track('booking_wizard_abandoned', { lastStep });
        },
        completed: (bookingData: AnalyticsProperties) => {
            this.track('booking_wizard_completed', bookingData);
        }
    };

    /**
     * Track UTM parameters
     */
    trackUTM(params: {
        source?: string | null;
        medium?: string | null;
        campaign?: string | null;
        content?: string | null;
        term?: string | null;
    }) {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null)
        );

        if (Object.keys(cleanParams).length > 0) {
            this.track('utm_tracked', cleanParams);
        }
    }
}

export const analytics = new Analytics();
