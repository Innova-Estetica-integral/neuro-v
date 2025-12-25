import { BillingProvider, BillingRequest, BillingResponse } from './billing-provider';

/**
 * Implementation for OpenFactura (Haulmer) API
 * Docs: https://openfactura.cl/documentacion/
 */
export class OpenFacturaProvider implements BillingProvider {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.OPENFACTURA_API_KEY || '';
        this.apiUrl = process.env.OPENFACTURA_API_URL || 'https://api.openfactura.cl/v1';
    }

    async generateBoleta(request: BillingRequest, clinicRut: string, apiKey: string): Promise<BillingResponse> {
        if (!apiKey || !clinicRut) {
            return { success: false, error: 'OpenFactura credentials for clinic are missing' };
        }

        try {
            // Mapeo NeuroV -> SII (Código 39: Boleta Electrónica)
            const payload = {
                dte: {
                    Encabezado: {
                        IdDoc: {
                            TipoDTE: 39,
                            FchEmis: new Date().toISOString().split('T')[0],
                            IndServicio: 3 // Venta de servicios
                        },
                        Emisor: {
                            RUTEmisor: clinicRut,
                        },
                        Receptor: {
                            RUTRecep: '66666666-6', // RUT Genérico para boletas nominativas simples
                            RznSocRecep: request.customerName,
                            Contacto: request.customerEmail
                        },
                        Totales: {
                            MntTotal: request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        }
                    },
                    Detalle: request.items.map((item, index) => ({
                        NroLinDet: index + 1,
                        NmbItem: item.name,
                        QtyItem: item.quantity,
                        PrcItem: item.price,
                        MntItem: item.price * item.quantity
                    }))
                }
            };

            const response = await fetch(`${this.apiUrl}/dte`, {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error communicating with OpenFactura');
            }

            return {
                success: true,
                dteId: data.folio,
                pdfUrl: data.pdf_url
            };

        } catch (error: any) {
            console.error('OpenFactura Integration Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getDTEStatus(dteId: string): Promise<any> {
        // Implementation for status check if needed
        return { status: 'mocked_ok' };
    }
}
