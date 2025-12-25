import { OpenFacturaProvider } from './open-factura';
import { BillingRequest, BillingResponse } from './billing-provider';

/**
 * Orchestrator for billing operations.
 * Handles provider selection and error logging.
 */
class BillingService {
    private provider: OpenFacturaProvider;

    constructor() {
        this.provider = new OpenFacturaProvider();
    }

    async processBillingAfterPayment(clinicId: string, request: BillingRequest, clinicRut: string, apiKey: string): Promise<BillingResponse> {
        console.log(`[BillingService] Initiating boleta for clinic ${clinicId} (Customer: ${request.customerName})`);

        // In a real flow, clinicRut and apiKey would be fetched from the clinic_integrations table
        // or passed by the caller who already has the session/context.

        const result = await this.provider.generateBoleta(request, clinicRut, apiKey);

        if (result.success) {
            console.log(`[BillingService] Boleta generated: ${result.dteId}`);
            // Logic for DB persistence and WhatsApp delivery will go here
        } else {
            console.error(`[BillingService] Boleta failure for clinic ${clinicId}: ${result.error}`);
        }

        return result;
    }
}

export const billingService = new BillingService();
