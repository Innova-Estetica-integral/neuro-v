/**
 * WhatsApp Business API Integration
 * Sends personalized messages for pursuit campaigns and flash offers
 */

export interface WhatsAppMessage {
    to: string; // Phone number with country code (e.g., +56912345678)
    message: string;
    mediaUrl?: string; // Optional image/video
}

/**
 * Send WhatsApp message using WhatsApp Business API
 */
export async function sendWhatsAppMessage(
    phoneNumber: string,
    message: string,
    mediaUrl?: string
): Promise<{ success: boolean; messageId?: string }> {

    const whatsappApiUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_BUSINESS_PHONE_ID}/messages`;

    const payload: any = {
        messaging_product: 'whatsapp',
        to: phoneNumber.replace(/[^\d+]/g, ''), // Clean phone number
        type: mediaUrl ? 'image' : 'text'
    };

    if (mediaUrl) {
        payload.image = {
            link: mediaUrl,
            caption: message
        };
    } else {
        payload.text = {
            body: message
        };
    }

    try {
        const response = await fetch(whatsappApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
        }

        const data = await response.json();

        return {
            success: true,
            messageId: data.messages[0].id
        };
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return {
            success: false
        };
    }
}

/**
 * Send WhatsApp reminder for upcoming appointment
 */
export async function sendAppointmentReminder(
    appointmentId: string,
    hoursUntil: 24 | 2
) {
    // Implementation would fetch appointment details and send reminder
    // Using template messages for better delivery rates

    const templates = {
        24: `Hola {{name}}! 

📅 Recordatorio: Tu cita es mañana a las {{time}}
🏥 Servicio: {{service}}
📍 Dirección: {{address}}

¿Necesitas reagendar? Responde CAMBIAR`,

        2: `¡{{name}}! Tu cita es en 2 horas ⏰

🕐 Hora: {{time}}
💆‍♀️ {{service}}

Te esperamos!`
    };

    // Would be implemented with full appointment data
    return templates[hoursUntil];
}
