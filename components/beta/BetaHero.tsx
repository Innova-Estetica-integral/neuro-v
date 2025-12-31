'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ShieldCheck, ChevronRight } from 'lucide-react';
import { PremiumButton } from '../ui/PremiumButton';
import Link from 'next/link';

export function BetaHero() {
    return (
        <section className="relative pt-24 pb-12 sm:pt-60 sm:pb-40 px-12 sm:px-12 bg-[#F9FAFB] overflow-hidden">
            {/* Background elements from solutions-test */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Header / Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 mb-10 group cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-gray-200/50 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_8px_16px_rgba(0,242,255,0.15)]">
                            <BrainCircuit className="w-7 h-7 text-[#00f2ff] stroke-[1.2] drop-shadow-[0_0_10px_rgba(0,242,255,0.6)]" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase text-gray-900">
                            NeuroV <span className="text-indigo-600">BETA V7.5</span>
                        </span>
                    </motion.div>

                    {/* Shield Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-10"
                    >
                        <ShieldCheck size={14} /> ECOSISTEMA 360° NEUROV
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.05] tracking-tightest mb-8 max-w-5xl break-words"
                    >
                        Tu Clínica Digital. <br />
                        <span className="text-indigo-600">Lista para operar <br className="sm:hidden" /> en 48 horas.</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg sm:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium mb-12"
                    >
                        Centraliza y automatiza tu clínica: agenda, bonos, boletas y marketing. Tu asistente Donna gestiona la logística administrativa y previsional, mientras tú te enfocas en tus pacientes.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
                    >
                        <PremiumButton variant="primary" size="lg" className="relative px-12 py-7 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 overflow-hidden group">
                            <motion.div
                                animate={{ x: [-200, 250] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[30deg] pointer-events-none"
                            />
                            COMENZAR AHORA
                        </PremiumButton>
                        <button className="px-12 py-7 bg-white border border-indigo-500/20 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm flex items-center justify-center gap-2">
                            VER DEMO EN VIVO <ChevronRight size={16} />
                        </button>
                    </motion.div>

                    {/* Trust Bar Placeholder (Will be a separate component) */}
                    <div className="mt-24 sm:mt-32 w-full">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">TECNOLOGÍA VALIDADA POR EL ECOSISTEMA DE SALUD</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                            {/* Trust logos placeholders */}
                            <img src="/assets/logotipos/Logo_de_Servicio_de_Impuestos_Internos.svg.png" alt="SII" className="h-8 sm:h-10 object-contain" />
                            <img src="/assets/logotipos/fonasa.png" alt="Fonasa" className="h-8 sm:h-10 object-contain" />
                            <img src="/assets/logotipos/LOGO-BUK.png" alt="BUK" className="h-8 sm:h-10 object-contain" />
                            <img src="/assets/logotipos/hl7_fhir.png" alt="FHIR" className="h-6 sm:h-8 object-contain" />
                            <img src="/assets/logotipos/CENS-cropped-logotipo-cens.png" alt="CENS" className="h-8 sm:h-10 object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
