import { createClient } from '@supabase/supabase-js';

export interface ReferralProgram {
    id: string;
    name: string;
    reward_type: 'discount' | 'credit' | 'free_procedure' | 'gift';
    reward_value: number;
    is_active: boolean;
}

export interface ReferralCode {
    id: string;
    code: string;
    patient_id: string;
    total_uses: number;
}

class ReferralEngine {
    private supabase;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    /**
     * Generates or retrieves a referral code for a specific patient
     */
    async getOrCreateCode(clinicId: string, patientId: string) {
        // Try to find existing
        const { data: existing } = await this.supabase
            .from('referral_codes')
            .select('*')
            .eq('clinic_id', clinicId)
            .eq('patient_id', patientId)
            .single();

        if (existing) return existing as ReferralCode;

        // Create new unique code (Pattern: NV-RANDOM4)
        const newCode = `NV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const { data, error } = await this.supabase
            .from('referral_codes')
            .insert({
                clinic_id: clinicId,
                patient_id: patientId,
                code: newCode
            })
            .select()
            .single();

        if (error) {
            console.error('[ReferralEngine] Code generation failure:', error);
            throw error;
        }

        return data as ReferralCode;
    }

    /**
     * Validates a code and tracks a potential conversion
     */
    async trackLead(params: {
        clinicId: string;
        code: string;
        referredPatientId: string;
    }) {
        const { data: codeData, error: codeError } = await this.supabase
            .from('referral_codes')
            .select('*')
            .eq('clinic_id', params.clinicId)
            .eq('code', params.code.toUpperCase())
            .single();

        if (codeError || !codeData) {
            throw new Error('Código de referido inválido');
        }

        const { error: convError } = await this.supabase
            .from('referral_conversions')
            .insert({
                clinic_id: params.clinicId,
                referring_patient_id: codeData.patient_id,
                referred_patient_id: params.referredPatientId,
                code_id: codeData.id,
                status: 'pending'
            });

        if (convError) throw convError;

        return { success: true, referringPatient: codeData.patient_id };
    }

    /**
     * Confirms a referral once the referred patient completes a procedure
     */
    async confirmConversion(params: {
        clinicId: string;
        referredPatientId: string;
    }) {
        const { data, error } = await this.supabase
            .from('referral_conversions')
            .update({ status: 'confirmed', converted_at: new Date().toISOString() })
            .eq('clinic_id', params.clinicId)
            .eq('referred_patient_id', params.referredPatientId)
            .eq('status', 'pending');

        if (error) throw error;
        return { success: true };
    }

    /**
     * List active programs for admin
     */
    async getPrograms(clinicId: string) {
        const { data } = await this.supabase
            .from('referral_programs')
            .select('*')
            .eq('clinic_id', clinicId);
        return data as ReferralProgram[];
    }
}

export const referralEngine = new ReferralEngine();
