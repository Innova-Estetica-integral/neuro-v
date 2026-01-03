'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideBrainCircuit } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { GrowthLanding } from '@/components/GrowthLanding';
import { SalesAssistant } from '@/components/SalesAssistant';
import { SalesBookingWizard } from '@/components/booking/SalesBookingWizard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { Footer } from '@/components/Footer';

function BookingSection() {
    const searchParams = useSearchParams();
    const isQualified = searchParams.get('qualified') === 'true';

    return (
        <section id="agenda" className="relative z-10 bg-black/40 border-y border-white/5 py-20">
            <SalesBookingWizard isQualified={isQualified} />
        </section>
    );
}

export default function GrowthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
            <GrowthPageContent />
        </Suspense>
    );
}

function GrowthPageContent() {
    const { profile } = usePsychographic();

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 bg-mesh relative overflow-x-hidden">
            {/* Background Grain/Noise */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

            {/* Navbar Simplified for Growth */}
            <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={() => window.location.href = '/'}>
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                            <LucideBrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">
                            NEURO<span className="text-purple-500">V</span> <span className="text-[10px] text-gray-500 ml-2">GROWTH</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <PremiumButton variant="primary" size="sm" onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}>
                            RESERVAR DEMO
                        </PremiumButton>
                    </div>
                </div>
            </nav>

            <main className="relative">
                <GrowthLanding />
                <BookingSection />
                <SalesAssistant mode="growth" />

                <Footer />
            </main>
        </div>
    );
}
