'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import {
    LucideZap,
    LucideBrainCircuit
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics/tracker';
import { parseUTM } from '@/lib/utils/utm';
import { UnifiedHome } from '@/components/UnifiedHome';
import { SalesAssistant } from '@/components/SalesAssistant';

function CorporateHomeContent() {
    const searchParams = useSearchParams();

    // UTM-based tracking
    useEffect(() => {
        const utm = parseUTM(searchParams);
        analytics.trackUTM(utm);

        analytics.page('home', {
            utm
        });
    }, [searchParams]);

    return (
        <main className="min-h-screen">
            {/* Unified Navigation (Extracted from solutions-test logic) */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform text-white shadow-lg">NV</div>
                        <span className="font-black tracking-tighter text-2xl uppercase text-gray-900">NeuroV <span className="text-indigo-600">V7.5</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/solutions-test" className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Portafolio</Link>
                        <Link href="/demo?qualified=true" className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Clínica en Vivo</Link>
                        <Link href="/#agenda" className="bg-indigo-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Agendar Demo</Link>
                    </div>
                </div>
            </nav>

            {/* Cinematic Unified Content */}
            <UnifiedHome />

            {/* Global Sales Assistant */}
            <SalesAssistant mode="technical" />

            {/* Minimal Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2025 NeuroV Engine • Executive Technology for Aesthetics</p>
                </div>
            </footer>
        </main>
    );
}

export default function CorporateHomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
            <CorporateHomeContent />
        </Suspense>
    );
}
