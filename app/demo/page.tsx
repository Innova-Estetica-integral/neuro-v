'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideShieldCheck, LucideShieldAlert, LucideDatabase, LucideCode2, LucideKey, LucideCalendar, LucideZap, LucideArrowRight, LucideLock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import Link from 'next/link';
import { ClinicSimulator } from '@/components/ClinicSimulator';

function DemoContent() {
    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Cinematic Nav */}
            <nav className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black shrink-0 text-white shadow-lg">NV</Link>
                    <div>
                        <span className="font-black tracking-widest uppercase text-xs block text-indigo-400">Security Suite Alpha</span>
                        <span className="font-black tracking-tight text-xl uppercase">NeuroV Simulator</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Operation Feed</span>
                    </div>
                    <Link href="/#agenda">
                        <PremiumButton variant="primary" size="sm" className="rounded-full px-8">Agendar Demo Real</PremiumButton>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tightest leading-none mb-6">
                        VE A LA <span className="text-indigo-500">IA</span> OPERAR TU CLÍNICA.
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl leading-relaxed font-medium">
                        Nuestro simulador en tiempo real utiliza la arquitectura pgsodium y el motor Donna para gestionar leads, pagos y agendas de forma autónoma.
                    </p>
                </div>

                <ClinicSimulator />
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-mesh opacity-20" />
            <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        </div>
    );
}

export default function DemoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <DemoContent />
        </Suspense>
    );
}
