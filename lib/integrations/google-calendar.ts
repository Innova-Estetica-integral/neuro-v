import { google } from 'googleapis';

/**
 * B2B Google Calendar Service
 * Handles strategic session bookings.
 */
export class GoogleCalendarService {
    private calendar;
    private isConfigured: boolean = false;

    constructor() {
        const credentials = process.env.GOOGLE_CALENDAR_CREDENTIALS;
        const token = process.env.GOOGLE_CALENDAR_TOKEN;

        if (credentials && token) {
            try {
                const auth = new google.auth.OAuth2();
                auth.setCredentials(JSON.parse(token));
                this.calendar = google.calendar({ version: 'v3', auth });
                this.isConfigured = true;
            } catch (error) {
                console.error('Error initializing Google Calendar:', error);
            }
        }
    }

    async createB2BEvent(data: {
        customerName: string;
        customerEmail: string;
        startTime: string;
        endTime: string;
        description?: string;
    }) {
        if (!this.isConfigured) {
            console.log('[MOCK CALENDAR] Creating event for:', data.customerEmail);
            return {
                id: `mock-id-${Date.now()}`,
                status: 'confirmed',
                htmlLink: 'https://calendar.google.com/mock',
                isMock: true
            };
        }

        const event = {
            summary: `NeuroV Estrategias: ${data.customerName}`,
            description: data.description || 'Sesión de consultoría estratégica NeuroV.',
            start: {
                dateTime: data.startTime,
                timeZone: 'America/Santiago',
            },
            end: {
                dateTime: data.endTime,
                timeZone: 'America/Santiago',
            },
            attendees: [{ email: data.customerEmail }],
            conferenceData: {
                createRequest: {
                    requestId: `neurov-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        try {
            if (!this.calendar) throw new Error('Calendar not initialized');
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                requestBody: event,
                conferenceDataVersion: 1,
            });

            return {
                id: response.data.id,
                status: response.data.status,
                htmlLink: response.data.htmlLink,
                isMock: false
            };
        } catch (error) {
            console.error('API Error creating calendar event:', error);
            throw error;
        }
    }
}

export const googleCalendarService = new GoogleCalendarService();
