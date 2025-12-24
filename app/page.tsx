'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideZap,
    LucideBrainCircuit,
    LucideShieldCheck,
    LucideActivity,
    LucideTrendingUp,
    LucideChevronRight,
    LucideDatabase,
    LucideArrowRight,
    LucideLock,
    LucideServer,
    LucideCheckCircle2
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { PsychographicAdapter, ProfileSection } from '@/components/PsychographicAdapter';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { SalesAssistant } from '@/components/SalesAssistant';
import { SalesBookingWizard } from '@/components/booking/SalesBookingWizard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { TechnicalLanding } from '@/components/TechnicalLanding';
import { GrowthLanding } from '@/components/GrowthLanding';
import { useState, useEffect } from 'react';

function BookingSection() {
    const searchParams = useSearchParams();
    const isQualified = searchParams.get('qualified') === 'true';

    return (
        <section id="agenda" className="relative z-10 bg-black/40 border-y border-white/5 py-20">
            <SalesBookingWizard isQualified={isQualified} />
        </section>
    );
}

export default function CorporateHomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
            <CorporateHomeContent />
        </Suspense>
    );
}

function CorporateHomeContent() {
    const { profile } = usePsychographic();
    const [viewMode, setViewMode] = useState<'technical' | 'growth'>('technical');

    // Sync viewMode with profile on initial load, but allow manual override
    useEffect(() => {
        if (profile === 'analytic') {
            setViewMode('technical');
        } else if (profile === 'impulsive' || profile === 'price_sensitive' || profile === 'hesitant') {
            setViewMode('growth');
        }
    }, [profile]);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 bg-mesh relative overflow-x-hidden">
            {/* Background Grain/Noise */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={() => window.location.href = '/'}>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <LucideBrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">
                            NEURO<span className="text-indigo-500">V</span>
                        </span>
                    </div>

                    {/* Persona Toggle Switch */}
                    <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-full border border-white/10">
                        <button
                            onClick={() => setViewMode('technical')}
                            className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'technical' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Enfoque Técnico
                        </button>
                        <button
                            onClick={() => setViewMode('growth')}
                            className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'growth' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Enfoque Marketing
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <PremiumButton variant="primary" size="sm" onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}>
                            RESERVAR CUPO
                        </PremiumButton>
                    </div>
                </div>
            </nav>

            <main className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, x: viewMode === 'technical' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: viewMode === 'technical' ? 20 : -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {viewMode === 'technical' ? (
                            <TechnicalLanding profile={profile} />
                        ) : (
                            <GrowthLanding />
                        )}
                    </motion.div>
                </AnimatePresence>

                <BookingSection />
                <SalesAssistant mode={viewMode} />

                {/* Footer */}
                <footer className="container mx-auto px-6 py-20 border-t border-white/5 text-center text-gray-500 text-sm">
                    <p>© 2025 NEURO-VENTAS V6. Todos los derechos reservados.</p>
                    <p className="mt-2 text-gray-600 font-mono tracking-widest uppercase">Tecnología Revenue Engine de Alto Impulso</p>
                </footer>
            </main>
        </div>
    );
}

