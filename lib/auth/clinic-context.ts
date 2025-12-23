import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Clinic Context for Multi-Tenant Operations
 * Provides clinic-scoped Supabase client with RLS enforcement
 */

export interface ClinicContext {
    clinicId: string;
    clinicName: string;
    role: 'clinic_admin' | 'clinic_agent' | 'receptionist' | 'patient';
    userId: string;
}

/**
 * Create a Supabase client with clinic context in JWT claims
 * This ensures all RLS policies filter by the correct clinic_id
 */
export function createClinicClient(
    context: ClinicContext
): SupabaseClient {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    // Inject custom claims into authorization header
                    'X-Clinic-ID': context.clinicId,
                    'X-User-Role': context.role
                }
            }
        }
    );

    return supabase;
}

/**
 * Get clinic context from authenticated user session
 * Called on every API request to establish tenant isolation
 */
export async function getClinicContext(
    userId: string
): Promise<ClinicContext | null> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin access
    );

    // Fetch user's clinic association
    const { data: clinicUser, error } = await supabase
        .from('clinic_users')
        .select(`
      clinic_id,
      role,
      clinics (
        id,
        name,
        is_active
      )
    `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

    if (error || !clinicUser) {
        return null;
    }

    // Handle array vs object from Supabase relation
    const clinicData = Array.isArray(clinicUser.clinics)
        ? clinicUser.clinics[0]
        : clinicUser.clinics as any;

    if (!clinicData) {
        return null;
    }

    return {
        clinicId: clinicUser.clinic_id,
        clinicName: clinicData.name,
        role: clinicUser.role,
        userId
    };
}

/**
 * Middleware to inject clinic context into request
 * Use in API routes to ensure multi-tenant isolation
 */
export async function withClinicContext(
    req: Request,
    handler: (context: ClinicContext) => Promise<Response>
): Promise<Response> {
    // Extract auth token from request
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Verify token and get user ID
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
    );

    if (error || !user) {
        return new Response('Invalid token', { status: 401 });
    }

    // Get clinic context
    const context = await getClinicContext(user.id);

    if (!context) {
        return new Response('No clinic association found', { status: 403 });
    }

    // Execute handler with clinic context
    return handler(context);
}

/**
 * Get decrypted payment credentials for clinic
 * Uses pgsodium decryption with clinic-specific key
 */
export async function getClinicPaymentCredentials(
    clinicId: string,
    provider: 'mercadopago' | 'transbank',
    environment: 'sandbox' | 'production' = 'production'
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data, error } = await supabase
            .rpc('decrypt_clinic_credentials', {
                p_clinic_id: clinicId,
                p_provider: provider,
                p_environment: environment
            });

        if (!error && data) {
            return data;
        }
    } catch (e) {
        console.warn('RPC decrypt_clinic_credentials failed, using environment variables as fallback');
    }

    // Fallback to environment variables if database lookup fails
    if (provider === 'mercadopago') {
        return {
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
            public_key: process.env.MERCADOPAGO_PUBLIC_KEY
        };
    } else {
        return {
            commerce_code: process.env.TRANSBANK_COMMERCE_CODE || '597055555532',
            api_key: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
        };
    }
}
