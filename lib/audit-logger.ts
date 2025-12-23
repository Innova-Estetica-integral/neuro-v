/**
 * Audit Logger - FHIR AuditEvent Creator
 * 
 * Creates audit trail for all data access and modifications
 * Required for Chilean law compliance
 */

import { createClient } from '@/lib/supabase/server';

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'execute';
export type AuditOutcome = 'success' | 'minor-failure' | 'serious-failure' | 'major-failure';

export interface AuditLogData {
    action: AuditAction;
    entityType: string; // Patient, Appointment, Consent, etc.
    entityId?: string;
    agentWho: string; // user ID or system name
    agentName?: string;
    outcome: AuditOutcome;
    description?: string;
    query?: string; // SQL query or API endpoint
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Create FHIR AuditEvent record
 */
export async function createAuditLog(data: AuditLogData): Promise<string | null> {
    try {
        const supabase = await createClient();

        const { data: auditEvent, error } = await supabase
            .from('audit_event')
            .insert({
                type_code: 'rest',
                action: data.action,
                agent_who_reference: data.agentWho,
                agent_name: data.agentName,
                entity_type: data.entityType,
                entity_id: data.entityId,
                entity_query: data.query,
                outcome_code: data.outcome,
                outcome_description: data.description,
                ip_address: data.ipAddress,
                user_agent: data.userAgent,
                source_site: 'web',
                source_type: 'application',
            })
            .select('id')
            .single();

        if (error) {
            console.error('Failed to create audit log:', error);
            return null;
        }

        return auditEvent.id;
    } catch (error) {
        console.error('Audit logger error:', error);
        return null;
    }
}

/**
 * Audit middleware for API routes
 */
export async function auditApiCall(
    req: Request,
    action: AuditAction,
    entityType: string,
    entityId?: string
): Promise<void> {
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const userAgent = req.headers.get('user-agent');

    // Get user from session if available
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await createAuditLog({
        action,
        entityType,
        entityId,
        agentWho: user?.id || 'anonymous',
        agentName: user?.email,
        outcome: 'success',
        description: `${action.toUpperCase()} ${entityType}`,
        query: new URL(req.url).pathname,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
    });
}
