'use client';

import { motion } from 'framer-motion';
import {
    LucideBrainCircuit,
    LucideDatabase,
    LucideLock,
    LucideShieldCheck,
    LucideServer,
    LucideArrowRight,
    LucideActivity,
    LucideTrendingUp,
    LucideZap
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';

export function TechnicalLanding({ profile }: { profile: string }) {
    return (
        <div className="space-y-32">
            {/* Hero Section - Technical Focus */}
            <section className="container mx-auto px-6 pt-20 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 backdrop-blur-md">
                        <LucideBrainCircuit className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-black text-indigo-300 tracking-[0.2em] uppercase">
                            Arquitectura Basada en Evidencia Clínica
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] tracking-tight">
                        Interoperabilidad <span className="text-gradient">FHIR R4</span> & Conversión Psico-Digital
                    </h1>

                    <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 sm:mb-12 leading-relaxed font-medium">
                        Aseguramos la integridad de los datos bajo Ley 21.668 mientras nuestro asistente virtual incrementa tus tasas de agendamiento en un 275%.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-6">
                        <PremiumButton
                            variant="secondary"
                            size="lg"
                            className="shine-effect w-full sm:w-auto px-12 rounded-3xl text-sm sm:text-lg"
                            onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                            icon={<LucideArrowRight />}
                        >
                            AGENDAR DEMO TÉCNICA
                        </PremiumButton>

                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                            Validado para Clínicas Estéticas en Chile
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Authority Stats Section */}
            <section id="roi" className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <StatsCard icon={<LucideTrendingUp />} label="ROI Promedio" value="+143%" sub="Primer año" />
                    <StatsCard icon={<LucideZap />} label="No-Shows" value="0%" sub="Garantizado por contrato" />
                    <StatsCard icon={<LucideBrainCircuit />} label="Precisión IA" value="98.2%" sub="Perfilado psicográfico" />
                    <StatsCard icon={<LucideShieldCheck />} label="Normativa" value="100%" sub="Cumplimiento Ley 21.668" />
                </div>
            </section>

            {/* Value Pillars Section */}
            <section id="tecnologia" className="container mx-auto px-6 py-20">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 italic">Ingeniería de Conversión</h2>
                    <div className="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <FeatureBlock
                        icon={<LucideBrainCircuit />}
                        title="Perfilado en Tiempo Real"
                        desc="Detección de sesgos cognitivos en <30s para adaptar la interfaz dinámicamente según el perfil psicológico del paciente."
                    />
                    <FeatureBlock
                        icon={<LucideActivity />}
                        title="Scoring BANT Automático"
                        desc="Calificación algorítmica de leads basada en presupuesto, autoridad, necesidad y tiempo de decisión."
                    />
                    <FeatureBlock
                        icon={<LucideDatabase />}
                        title="Integración FHIR R4"
                        desc="Interoperabilidad nativa estandarizada para garantizar la portabilidad y seguridad de la ficha clínica electrónica."
                    />
                </div>
            </section>

            {/* Medical Grade Security Section */}
            <section id="seguridad" className="w-full relative py-32 overflow-hidden bg-indigo-900/5">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                                <LucideLock className="w-3 h-3 text-green-400" />
                                <span className="text-[10px] font-black text-green-300 tracking-widest uppercase">Fortaleza Inexpugnable</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                                arquitectura <span className="text-gradient">Zero-Trust</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed font-medium">
                                Diseñamos la arquitectura más segura de la industria estética, superando los estándares exigidos por el Ministerio de Salud.
                            </p>

                            <ul className="space-y-6">
                                <SecurityFeature icon={<LucideDatabase />} title="Bóveda pgsodium" desc="Cifrado militar para credenciales sensibles." />
                                <SecurityFeature icon={<LucideShieldCheck />} title="Aislamiento RLS" desc="Row Level Security para blindaje de datos por clínica." />
                                <SecurityFeature icon={<LucideServer />} title="Ficha Inmutable" desc="Trazabilidad total exigida por Ley 21.668." />
                            </ul>
                        </div>

                        <div className="relative group w-full">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                            <GlassCard className="relative z-10 p-4 sm:p-8 border-white/10 bg-[#0f172a]/90 backdrop-blur-3xl w-full overflow-hidden shadow-3xl">
                                <div className="flex gap-2 mb-6 opacity-60">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="font-mono text-[10px] sm:text-[13px] leading-relaxed overflow-x-auto custom-scrollbar-horizontal pb-2 pr-4">
                                    <div className="space-y-1 sm:space-y-2 whitespace-nowrap min-w-fit">
                                        <p className="text-indigo-400">CREATE POLICY clinic_isolation</p>
                                        <p className="text-purple-400 pl-4 sm:pl-6">FOR SELECT TO verified_clinic</p>
                                        <p className="text-cyan-400 pl-4 sm:pl-6">USING (clinic_id = current_setting(&apos;app.id&apos;));</p>
                                        <div className="h-4 sm:h-6" />
                                        <p className="text-gray-500 font-medium italic">{'//'} Security Active: RLS Protocol</p>
                                        <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-green-400 font-black tracking-widest uppercase text-[8px] sm:text-[10px]">PG_SODIUM: SECURE_ENCRYPTION</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatsCard({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
    return (
        <GlassCard className="text-center p-6 border-white/5" hoverIntensity="high">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-4">
                {icon}
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-4xl font-black text-white mb-1">{value}</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{sub}</p>
        </GlassCard>
    );
}

function FeatureBlock({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <GlassCard className="border-indigo-500/10">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-8">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-medium">{desc}</p>
        </GlassCard>
    );
}

function SecurityFeature({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <li className="flex gap-4">
            <div className="shrink-0 w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{title}</h4>
                <p className="text-sm text-gray-500 font-medium">{desc}</p>
            </div>
        </li>
    );
}
