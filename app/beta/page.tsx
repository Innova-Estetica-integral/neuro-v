'use client';

import React, { Suspense } from 'react';
import { BetaHero } from '@/components/beta/BetaHero';
import { DonnaGlassAssistant } from '@/components/beta/DonnaGlassAssistant';
import { BentoHubDefinitive } from '@/components/beta/BentoHubDefinitive';
import { BetaFinalSection } from '@/components/beta/BetaFinalSection';
import { BrainCircuit } from 'lucide-react';

export default function BetaPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Navegación básica para Beta */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-gray-200/50 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_8px_16px_rgba(0,242,255,0.1)]">
                            <BrainCircuit className="w-6 h-6 text-[#00f2ff] stroke-[1.2] drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
                        </div>
                        <span className="font-black tracking-tighter text-2xl uppercase text-gray-900">NeuroV <span className="text-indigo-600">BETA V7.5</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                        >
                            Agendar Demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cinematic Hero & Trust Bar */}
            <BetaHero />

            {/* 9-Pillar Bento Hub */}
            <BentoHubDefinitive />

            {/* Support / Onboarding Executive placeholder or mention as per blueprint section 6 */}
            <section className="py-24 px-6 bg-indigo-50/30 border-t border-indigo-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block italic">Foco en Resultados</span>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tightest mb-8 leading-none text-gray-900 uppercase italic">Tu clínica activa <br />en tiempo récord.</h2>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">
                            Nuestra garantía es simple: implementación completa y operativa en 48 horas. No vendemos software, entregamos una clínica funcionando.
                        </p>
                    </div>
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-200/50 border border-indigo-50">
                        <div className="text-4xl font-black text-indigo-600 mb-2">48H</div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Garantía de Tiempo de Respuesta</p>
                    </div>
                </div>
            </section>

            {/* Comparison Table & Final CTA */}
            <BetaFinalSection />

            {/* Floating Donna Assistant */}
            <DonnaGlassAssistant />

            {/* Basic Footer */}
            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2025 NeuroV Engine • La Edición Definitiva</p>
                </div>
            </footer>
        </main>
    );
}
