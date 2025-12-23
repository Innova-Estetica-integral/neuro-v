import { WebpayPlus, Environment, Options } from 'transbank-sdk';

/**
 * Transbank Payment Class - Supports dynamic credentials for multi-tenancy
 */
export class TransbankPayment {
    private tx: any;

    constructor(commerceCode: string, apiKey: string, isProd: boolean) {
        const options = new Options(
            commerceCode,
            apiKey,
            isProd ? Environment.Production : Environment.Integration
        );
        this.tx = new WebpayPlus.Transaction(options);
    }

    async createTransaction(data: {
        buy_order: string;
        session_id: string;
        amount: number;
        return_url: string;
    }) {
        return await this.tx.create(
            data.buy_order,
            data.session_id,
            data.amount,
            data.return_url
        );
    }

    async commit(token: string) {
        return await this.tx.commit(token);
    }

    async status(token: string) {
        return await this.tx.status(token);
    }

    async refund(token: string, amount: number) {
        return await this.tx.refund(token, amount);
    }
}

// Keep existing exports for backward compatibility if needed, using default credentials
const isProd = process.env.NODE_ENV === 'production';
const defaultOptions = new Options(
    process.env.TRANSBANK_COMMERCE_CODE || '597055555532',
    process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
    isProd ? Environment.Production : Environment.Integration
);
const defaultTx = new WebpayPlus.Transaction(defaultOptions);

export async function initTransaction(data: any) {
    const buyOrder = `ORD-${data.appointmentId}-${Date.now()}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/transbank/return`;
    return await defaultTx.create(buyOrder, data.sessionId, data.amount, returnUrl);
}

export async function commitTransaction(token: string) {
    return await defaultTx.commit(token);
}
