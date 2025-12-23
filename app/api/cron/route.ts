/**
 * Scheduled Jobs API - Revenue Engine V6
 * 
 * Cron endpoint for automated tasks:
 * - Flash offer generation (hourly)
 * - Abandoned cart pursuit (every 15 min)
 * - Renewal reminders (daily)
 * - Auto-renewals (daily)
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { dispatchFlashOffers, checkFlashOfferConversions, expireFlashOffers } from '@/lib/flash-offer-engine';
import { runPursuitScheduler } from '@/lib/pursuit/abandoned-cart';
import { sendRenewalReminders, processAutoRenewals } from '@/lib/retention/ltv-matrix';

// Vercel Cron Secret for security
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const job = searchParams.get('job');

    try {
        let result;

        switch (job) {
            case 'flash-offers':
                // Run every hour
                result = await dispatchFlashOffers();
                return NextResponse.json({
                    job: 'flash-offers',
                    created: result.created,
                    sent: result.sent,
                    errors: result.errors,
                });

            case 'flash-check':
                // Check conversions every 30 min
                await checkFlashOfferConversions();
                return NextResponse.json({ job: 'flash-check', status: 'completed' });

            case 'flash-expire':
                // Expire old offers every hour
                const expired = await expireFlashOffers();
                return NextResponse.json({ job: 'flash-expire', expired });

            case 'pursuit':
                // Run every 15 minutes
                result = await runPursuitScheduler();
                return NextResponse.json({
                    job: 'pursuit',
                    results: result,
                });

            case 'renewals-30d':
                // Run daily
                result = await sendRenewalReminders(30);
                return NextResponse.json({
                    job: 'renewals-30d',
                    sent: result.sent,
                    errors: result.errors,
                });

            case 'renewals-7d':
                // Run daily
                result = await sendRenewalReminders(7);
                return NextResponse.json({
                    job: 'renewals-7d',
                    sent: result.sent,
                    errors: result.errors,
                });

            case 'renewals-1d':
                // Run daily
                result = await sendRenewalReminders(1);
                return NextResponse.json({
                    job: 'renewals-1d',
                    sent: result.sent,
                    errors: result.errors,
                });

            case 'auto-renewals':
                // Run daily
                result = await processAutoRenewals();
                return NextResponse.json({
                    job: 'auto-renewals',
                    renewed: result.renewed,
                    errors: result.errors,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid job specified' },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error(`Cron job ${job} failed:`, error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
