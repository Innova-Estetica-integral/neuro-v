import { createClient } from '@supabase/supabase-js';

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    current_stock: number;
    min_stock_alert: number;
    unit: string;
}

export type TransactionType = 'in' | 'out' | 'adjustment' | 'reservation';

/**
 * InventoryManager
 * Coordinates stock movements and automated alerts for the Revenue Engine.
 */
class InventoryManager {
    private supabase;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // Operational service access
        );
    }

    /**
     * Records a stock movement and updates the master record
     */
    async logTransaction(params: {
        clinicId: string;
        itemId: string;
        type: TransactionType;
        quantity: number;
        reason: string;
        userId?: string;
        procedureId?: string;
    }) {
        const { error } = await this.supabase
            .from('inventory_transactions')
            .insert({
                clinic_id: params.clinicId,
                item_id: params.itemId,
                type: params.type,
                quantity: params.quantity,
                reason: params.reason,
                user_id: params.userId,
                procedure_id: params.procedureId
            });

        if (error) {
            console.error('[InventoryManager] Transaction failure:', error);
            throw error;
        }

        return { success: true };
    }

    /**
     * Checks for items below the critical threshold.
     * Donna uses this to notify the clinic admin.
     */
    async getCriticalStockAlerts(clinicId: string) {
        const { data, error } = await this.supabase
            .from('inventory_items')
            .select('*')
            .eq('clinic_id', clinicId)
            .eq('is_active', true)
            .filter('current_stock', 'lte', 'min_stock_alert');

        if (error) {
            console.error('[InventoryManager] Alert query failure:', error);
            return [];
        }

        return data as InventoryItem[];
    }

    /**
     * Fetch full inventory for admin dashboard
     */
    async getClinicInventory(clinicId: string) {
        const { data, error } = await this.supabase
            .from('inventory_items')
            .select('*')
            .eq('clinic_id', clinicId)
            .order('name');

        if (error) {
            console.error('[InventoryManager] Fetch failure:', error);
            return [];
        }

        return data as InventoryItem[];
    }
}

export const inventoryManager = new InventoryManager();
