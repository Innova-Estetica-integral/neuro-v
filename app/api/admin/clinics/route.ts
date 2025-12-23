import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const {
            name, slug, address, phone, email,
            provider, environment,
            mercadopagoAccessToken, mercadopagoPublicKey,
            transbankCommerceCode, transbankApiKey,
            adminName, adminEmail
        } = data;

        // Validate
        if (!name || !slug || !email || !provider || !environment || !adminName || !adminEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Create clinic
        const { data: clinic, error: clinicError } = await supabase
            .from('clinics')
            .insert({
                name,
                slug: slug.toLowerCase(),
                address,
                phone,
                email
            })
            .select()
            .single();

        if (clinicError) {
            return NextResponse.json(
                { error: clinicError.message },
                { status: 400 }
            );
        }

        // 2. Store payment credentials (encrypted)
        // Note: In production, use pgsodium for encryption
        // For now, storing as-is (will add encryption in next iteration)
        const credentials: any = {
            clinic_id: clinic.id,
            provider,
            environment
        };

        if (provider === 'mercadopago') {
            credentials.access_token_encrypted = mercadopagoAccessToken;  // TODO: encrypt
            credentials.public_key = mercadopagoPublicKey;
        } else if (provider === 'transbank') {
            credentials.commerce_code = transbankCommerceCode;
            credentials.api_key_encrypted = transbankApiKey;  // TODO: encrypt
        }

        const { error: credError } = await supabase
            .from('payment_credentials')
            .insert(credentials);

        if (credError) {
            // Rollback clinic creation
            await supabase.from('clinics').delete().eq('id', clinic.id);
            return NextResponse.json(
                { error: credError.message },
                { status: 400 }
            );
        }

        // 3. Create admin user with auto-generated password
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: tempPassword,
            email_confirm: false,
            user_metadata: {
                name: adminName
            }
        });

        if (authError) {
            // Rollback
            await supabase.from('clinics').delete().eq('id', clinic.id);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // 4. Associate admin user with clinic
        const { error: clinicUserError } = await supabase
            .from('clinic_users')
            .insert({
                clinic_id: clinic.id,
                user_id: authData.user.id,
                role: 'clinic_admin'
            });

        if (clinicUserError) {
            // Rollback
            await supabase.from('clinics').delete().eq('id', clinic.id);
            await supabase.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json(
                { error: clinicUserError.message },
                { status: 400 }
            );
        }

        // 5. TODO: Send welcome email with temp password

        return NextResponse.json({
            success: true,
            clinicId: clinic.id,
            adminUserId: authData.user.id
        });

    } catch (error) {
        console.error('Clinic creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // List all clinics
        const { data: clinics, error } = await supabase
            .from('clinics')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ clinics });

    } catch (error) {
        console.error('Get clinics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
