/**
 * Mock Payment Gateway - For Testing & Development
 * Simulates payment flow without real transactions
 */

export interface MockPaymentData {
    appointmentId: string;
    patientId: string;
    amount: number;
    patientEmail: string;
    patientName: string;
}

export interface MockPaymentResult {
    success: boolean;
    paymentId: string;
    checkoutUrl: string;
    status: 'approved' | 'rejected' | 'pending';
}

/**
 * Simulate payment creation with 80% success rate
 */
export async function createMockPayment(
    data: MockPaymentData
): Promise<MockPaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 80% success, 15% pending, 5% failure
    const random = Math.random();
    let status: 'approved' | 'rejected' | 'pending';

    if (random < 0.8) {
        status = 'approved';
    } else if (random < 0.95) {
        status = 'pending';
    } else {
        status = 'rejected';
    }

    // Build checkout URL with result
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resultPage = status === 'approved' ? 'success' :
        status === 'rejected' ? 'failure' : 'pending';

    const checkoutUrl = `${baseUrl}/booking/${resultPage}?appointment_id=${data.appointmentId}&payment_id=${paymentId}&mock=true`;

    return {
        success: true,
        paymentId,
        checkoutUrl,
        status
    };
}

/**
 * Simulate payment verification
 */
export async function verifyMockPayment(
    paymentId: string
): Promise<{
    success: boolean;
    status: 'approved' | 'rejected' | 'pending';
    amount?: number;
}> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract status from payment ID or random
    const isMock = paymentId.startsWith('MOCK_');

    if (!isMock) {
        return { success: false, status: 'rejected' };
    }

    // Simulate 90% approval rate on verification
    const status = Math.random() > 0.1 ? 'approved' : 'rejected';

    return {
        success: status === 'approved',
        status,
        amount: Math.floor(Math.random() * 200000) + 30000 // 30k-230k CLP
    };
}

/**
 * Mock payment gateway selector
 * Returns mock if in development or MOCK_PAYMENTS=true
 */
export function shouldUseMockPayments(): boolean {
    return (
        process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_MOCK_PAYMENTS === 'true'
    );
}
