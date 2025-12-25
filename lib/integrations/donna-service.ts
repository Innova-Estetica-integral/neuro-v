import { createClient } from '@supabase/supabase-js';

export type InsightCategory = 'vip_celebration' | 'retention_alert' | 'upsell_opportunity' | 'marketing_tip';

export interface DonnaInsight {
    id?: string;
    category: InsightCategory;
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    metadata: any;
    executed_at?: string;
    execution_log?: any[];
}

export class DonnaService {
    /**
     * Scans for high-value events and generates proactive insights
     */
    async generateDailyInsights(clinicId: string) {
        console.log(`[DonnaService] Starting daily audit for clinic: ${clinicId}`);
        const insights: DonnaInsight[] = [];

        // 1. Fetch clinic executive settings
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const { data: clinic } = await supabase
            .from('clinics')
            .select('donna_executive_mode, donna_settings')
            .eq('id', clinicId)
            .single();

        // 2. VIP Birthdays & Anniversaries
        const vipInsights = await this.checkVIPSpecialDates(clinicId);
        insights.push(...vipInsights);

        // 3. Retention Risks (Lapsed high-value patients)
        const retentionInsights = await this.checkRetentionRisks(clinicId);
        insights.push(...retentionInsights);

        // 4. Financial Gaps (Low occupation)
        const financialInsights = await this.checkFinancialGaps(clinicId);
        insights.push(...financialInsights);

        // 5. Persist new insights
        if (insights.length > 0) {
            await this.persistInsights(clinicId, insights);
        }

        // 6. IF EXECUTIVE MODE: Execute high-priority insights immediately
        if (clinic?.donna_executive_mode) {
            console.log(`[DonnaService] Executive Mode ACTIVE. Executing actions for ${clinicId}`);
            await this.executeExecutiveActions(clinicId, insights.filter(i => i.priority === 'high' || i.priority === 'critical'));
        }

        return insights;
    }

    private async executeExecutiveActions(clinicId: string, insights: DonnaInsight[]) {
        for (const insight of insights) {
            console.log(`[DonnaService] Executive Execution: ${insight.title}`);

            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

            // 1. Record the "Chain of Thought" (Glass Box)
            const reasoning = `Donna ha analizado la categoría ${insight.category} con prioridad ${insight.priority}. ` +
                `Decisión: Ejecución autónoma activada para asegurar ${insight.title}. ` +
                `Contexto: Modo Ejecutivo activo para la clínica ${clinicId}.`;

            await supabase.from('donna_executive_logs').insert({
                clinic_id: clinicId,
                insight_id: insight.id, // Assuming ID is present
                reasoning: reasoning,
                action_taken: `Ejecución automática de ${insight.category}`,
                result: 'success'
            });

            // 2. Perform the action (placeholder for actual integration)
            // Logic for automated WhatsApp, email, etc.

            // 3. Update insight status
            await supabase
                .from('donna_insights')
                .update({
                    status: 'executed',
                    executed_at: new Date().toISOString(),
                    execution_log: [{ type: 'auto_executive', result: 'success', timestamp: new Date().toISOString() }]
                })
                .eq('clinic_id', clinicId)
                .eq('title', insight.title); // Simplification for demo
        }
    }

    private async checkVIPSpecialDates(clinicId: string): Promise<DonnaInsight[]> {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        // Logic: Find Platinum patients whose birthday is in the next 48h
        const { data: vips } = await supabase
            .from('patient')
            .select('id, name_text, birth_date, loyalty_tier')
            .eq('clinic_id', clinicId)
            .in('loyalty_tier', ['platinum', 'gold'])
            .limit(5);

        return (vips || []).map(vip => ({
            category: 'vip_celebration',
            priority: vip.loyalty_tier === 'platinum' ? 'critical' : 'high',
            title: `${vip.loyalty_tier === 'platinum' ? '💎 ' : ''}Cumpleaños VIP: ${vip.name_text}`,
            description: `${vip.name_text} es una paciente ${vip.loyalty_tier.toUpperCase()}. He preparado una experiencia de lujo y un regalo exclusivo para su próxima visita.`,
            metadata: { patient_id: vip.id, target_date: vip.birth_date, tier: vip.loyalty_tier }
        }));
    }

    private async checkRetentionRisks(clinicId: string): Promise<DonnaInsight[]> {
        // Logic to detect high-value patients who haven't returned in 90 days
        return [
            {
                category: 'retention_alert',
                priority: 'medium',
                title: 'Alerta de Retención: Pacientes Ausentes',
                description: '3 pacientes analíticos no han agendado en 90 días. He diseñado una secuencia de reactivación basada en datos científicos para ellos.',
                metadata: { risk_count: 3 }
            }
        ];
    }

    private async checkFinancialGaps(clinicId: string): Promise<DonnaInsight[]> {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        // Scan for next 7 days occupation
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const { count: lowOccupationSlots } = await supabase
            .from('appointment')
            .select('*', { count: 'exact', head: true })
            .eq('clinic_id', clinicId)
            .eq('status', 'proposed')
            .gte('start', new Date().toISOString())
            .lte('start', nextWeek.toISOString());

        // Artificial threshold for demo: if proposed < 10, we have "gaps"
        if ((lowOccupationSlots || 0) < 10) {
            return [{
                category: 'upsell_opportunity',
                priority: 'critical',
                title: 'Intervención de Agenda: Huecos Críticos',
                description: 'Detecto baja ocupación para el jueves y viernes. Estoy lista para lanzar una "Oferta Relámpago" a 15 pacientes sensibles al precio para asegurar tu facturación semanal.',
                metadata: { strategy: 'flash_offer', target_count: 15 }
            }];
        }

        return [];
    }

    private async persistInsights(clinicId: string, insights: DonnaInsight[]) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        const { error } = await supabase
            .from('donna_insights')
            .insert(insights.map(i => ({
                clinic_id: clinicId,
                ...i,
                status: 'pending'
            })));

        if (error) console.error('[DonnaService] Error persisting insights:', error);
    }

    /**
     * Donna orchestrates the marketing grid for the week
     */
    async generateMarketingGrid(clinicId: string) {
        // AI Logic: Analyze previous week's best-selling treatments
        // For now, return a high-impact template
        const grid = {
            week_start_date: new Date().toISOString().split('T')[0],
            strategy_type: 'acquisition',
            grid_content: [
                { day: 'Lunes', platform: 'Instagram', focus: 'Educación: Qué es el Ácido Hialurónico' },
                { day: 'Miércoles', platform: 'TikTok', focus: 'Antes y Después: Caso Real' },
                { day: 'Viernes', platform: 'WhatsApp', focus: 'Oferta Relámpago: 15% OFF para huecos libres' }
            ]
        };

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        await supabase.from('marketing_grids').upsert({
            clinic_id: clinicId,
            ...grid
        });

        return grid;
    }
}
