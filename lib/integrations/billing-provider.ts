export interface BillingItem {
    name: string;
    quantity: number;
    price: number;
    code?: string;
}

export interface BillingRequest {
    customerName: string;
    customerEmail: string;
    items: BillingItem[];
    paymentType: 'cas' | 'deb' | 'cre'; // Cash, Debit, Credit
    externalId: string; // Internal neurov transaction ID
}

export interface BillingResponse {
    success: boolean;
    dteId?: string;
    pdfUrl?: string;
    error?: string;
}

export interface BillingProvider {
    generateBoleta(request: BillingRequest, clinicRut: string, apiKey: string): Promise<BillingResponse>;
    getDTEStatus(dteId: string): Promise<any>;
}
