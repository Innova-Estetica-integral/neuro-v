import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Role types
export type UserRole = 'clinic_admin' | 'clinic_agent' | 'receptionist' | 'super_admin';

// Check if user has specific role in clinic
export async function hasRole(
    userId: string,
    clinicId: string,
    requiredRole: UserRole
): Promise<boolean> {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('clinic_users')
            .select('role')
            .eq('user_id', userId)
            .eq('clinic_id', clinicId)
            .single();

        if (error || !data) return false;

        return data.role === requiredRole || data.role === 'super_admin';
    } catch (error) {
        console.error('Error checking role:', error);
        return false;
    }
}

// Check if user has any role in clinic
export async function hasAccessToClinic(
    userId: string,
    clinicId: string
): Promise<boolean> {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('clinic_users')
            .select('id')
            .eq('user_id', userId)
            .eq('clinic_id', clinicId)
            .single();

        return !error && !!data;
    } catch (error) {
        console.error('Error checking access:', error);
        return false;
    }
}

// Get user's role in clinic
export async function getUserRole(
    userId: string,
    clinicId: string
): Promise<UserRole | null> {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('clinic_users')
            .select('role')
            .eq('user_id', userId)
            .eq('clinic_id', clinicId)
            .single();

        if (error || !data) return null;

        return data.role as UserRole;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

// Get all clinics user has access to
export async function getUserClinics(userId: string) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('clinic_users')
            .select(`
        clinic_id,
        role,
        clinic:clinics (
          id,
          name,
          slug,
          is_active
        )
      `)
            .eq('user_id', userId);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error getting user clinics:', error);
        return [];
    }
}

// Permission helpers
export const permissions = {
    canManageClinic: (role: UserRole) => ['clinic_admin', 'super_admin'].includes(role),
    canViewReports: (role: UserRole) => ['clinic_admin', 'clinic_agent', 'super_admin'].includes(role),
    canManageAppointments: (role: UserRole) => ['clinic_admin', 'clinic_agent', 'receptionist', 'super_admin'].includes(role),
    canManagePatients: (role: UserRole) => ['clinic_admin', 'clinic_agent', 'super_admin'].includes(role),
    canManageUsers: (role: UserRole) => ['clinic_admin', 'super_admin'].includes(role),
};

// Middleware helper for API routes
export async function requireRole(userId: string, clinicId: string, requiredRole: UserRole) {
    const userRole = await getUserRole(userId, clinicId);

    if (!userRole) {
        throw new Error('Access denied: User has no role in this clinic');
    }

    if (userRole === 'super_admin') {
        return true; // Super admin has all permissions
    }

    if (userRole !== requiredRole) {
        throw new Error(`Access denied: Required role is ${requiredRole}`);
    }

    return true;
}
