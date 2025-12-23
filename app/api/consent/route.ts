import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    try {
        const {
            patientId,
            clinicId,
            consents,
            signatureData,
            ipAddress,
            userAgent
        } = await request.json();

        // Validate required consents
        if (!consents.law_21668 || !consents.law_19628 || !consents.law_20584) {
            return NextResponse.json(
                { error: 'All required consents must be accepted' },
                { status: 400 }
            );
        }

        if (!signatureData) {
            return NextResponse.json(
                { error: 'Signature is required' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // TODO: Upload signature image to storage
        // For now, storing as base64 (not recommended for production)
        const signatureUrl = signatureData; // Would be storage URL

        // Get client IP from headers
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

        // Create consent record
        const { data: consent, error: consentError } = await supabase
            .from('consent')
            .insert({
                clinic_id: clinicId,
                patient_id: patientId,
                status: 'active',
                scope_coding_code: 'treatment',  // FHIR code
                category_coding_code: 'HIPAA-Authorization',
                // Store consent details in provision jsonb field
                provision: {
                    law_21668: consents.law_21668,
                    law_19628: consents.law_19628,
                    law_20584: consents.law_20584,
                    marketing: consents.marketing,
                    whatsapp: consents.whatsapp
                },
                signature_url: signatureUrl,
                ip_address: ip,
                user_agent: userAgent,
                datetime: new Date().toISOString()
            })
            .select()
            .single();

        if (consentError) {
            return NextResponse.json(
                { error: consentError.message },
                { status: 400 }
            );
        }

        // TODO: Generate PDF comprobante
        // TODO: Send email with consent copy

        return NextResponse.json({
            success: true,
            consentId: consent.id
        });

    } catch (error) {
        console.error('Consent creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
