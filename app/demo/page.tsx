'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideShieldCheck, LucideShieldAlert, LucideDatabase, LucideCode2, LucideKey, LucideCalendar, LucideZap, LucideArrowRight, LucideLock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useSearchParams } from 'next/navigation';

function DemoContent() {
    const searchParams = useSearchParams();
    const isQualified = searchParams.get('qualified') === 'true';
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress < 100) {
            const timer = setTimeout(() => setProgress(prev => prev + 2), 50);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isQualified) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <GlassCard className="max-w-md text-center p-12 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <LucideShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Acceso Restringido</h1>
                    <p className="text-gray-400 font-medium mb-8">Esta demo técnica está reservada exclusivamente para clínicas calificadas por nuestro Cerebro de Ventas.</p>
                    <PremiumButton variant="primary" onClick={() => window.location.href = '/'}>VOLVER AL INICIO</PremiumButton>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            {/* Nav */}
            <nav className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black">NV</div>
                    <span className="font-black tracking-widest uppercase text-sm">NeuroV Demo Protocol</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Step {step} of 3</span>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
                                        <LucideZap className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocolo de Ingesta</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
                                        Captura del <span className="text-indigo-500">GCLID</span> y Atribución
                                    </h2>
                                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                        NeuroV captura instantáneamente los parámetros de seguimiento de Google y Facebook Ads. No perdemos ni un solo bit de información de atribución desde el primer click.
                                    </p>
                                    <PremiumButton variant="primary" onClick={() => setStep(2)}>SIGUIENTE NIVEL <LucideArrowRight className="ml-2 w-5 h-5" /></PremiumButton>
                                </div>

                                <GlassCard className="p-8 border-indigo-500/20 bg-indigo-950/20">
                                    <div className="font-mono text-sm space-y-4">
                                        <div className="flex items-center gap-4 text-gray-500 border-b border-white/5 pb-4">
                                            <LucideCode2 className="w-4 h-4" />
                                            <span>Incoming Lead data_stream</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-green-400">{`> HTTP/1.1 200 OK`}</p>
                                            <p className="text-indigo-400">{`{`}</p>
                                            <p className="pl-4 text-white">"gclid": "Abc123XyZ_789_Protocol_NeuroV",</p>
                                            <p className="pl-4 text-white">"source": "google_search_estetica",</p>
                                            <p className="pl-4 text-white">"campaign": "conversion_high_intent",</p>
                                            <p className="pl-4 text-white">"timestamp": "${new Date().toISOString()}",</p>
                                            <p className="pl-4 text-indigo-400">"status": "INGESTED_SUCCESS"</p>
                                            <p className="text-indigo-400">{`}`}</p>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-white/5">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                                <span>Data Sync Strength</span>
                                                <span>99.9%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-indigo-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '99.9%' }}
                                                    transition={{ duration: 2 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <GlassCard className="p-8 border-cyan-500/20 bg-cyan-950/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
                                    <div className="relative z-10 font-mono text-sm space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                            <div className="flex items-center gap-2">
                                                <LucideShieldCheck className="w-5 h-5 text-cyan-400" />
                                                <span className="text-cyan-400 font-bold uppercase tracking-widest">pgsodium: ActiveVault</span>
                                            </div>
                                            <div className="px-2 py-0.5 bg-cyan-500/20 rounded text-[10px] text-cyan-300">KEYS_ROTATING</div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                                                <p className="text-gray-500 text-[10px] uppercase mb-2">Lead Identity Crypted</p>
                                                <p className="text-white break-all">f0e1d2c3b4a59687...rot_key_neuro_protocol_v6</p>
                                            </div>
                                            <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                                                <p className="text-gray-500 text-[10px] uppercase mb-2">RLS Protocol Status</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                                                    <p className="text-cyan-400 font-bold">ISOLATION_VERIFIED</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-8">
                                            <LucideLock className="w-12 h-12 text-cyan-500 opacity-20" />
                                            <div>
                                                <p className="text-white font-bold leading-tight">Cifrado AES-256-GCM</p>
                                                <p className="text-gray-500 text-[10px]">Security Standard: Clinical Grade</p>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
                                        <LucideDatabase className="w-4 h-4 text-cyan-400" />
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Bóveda de Credenciales</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
                                        Seguridad de Grado <span className="text-cyan-400">Clínico</span>
                                    </h2>
                                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                        Implementamos pgsodium para el cifrado de datos sensibles a nivel de base de datos. Cada paciente y cada credencial vive aislada bajo RLS (Row Level Security).
                                    </p>
                                    <PremiumButton variant="primary" onClick={() => setStep(3)}>LOGÍSTICA DE AGENDA <LucideArrowRight className="ml-2 w-5 h-5" /></PremiumButton>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                                    <LucideCalendar className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Motor de Conversión</span>
                                </div>
                                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                                    Agenda <span className="text-emerald-500">Smart-Gated</span>
                                </h2>
                                <p className="text-xl text-gray-400 leading-relaxed">
                                    Nuestra tecnología no solo agenda; filtra. Protegemos el tiempo de tus especialistas mediante Payment-Gating y calificación Neuro-Psicológica previa.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <GlassCard className="p-8 border-white/10 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                                        <LucideLock className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-tight text-white mb-2">Bloqueo Preventivo</h3>
                                    <p className="text-sm text-gray-500">Solo se desbloquean horarios si el Scoring BANT es superior a 80/100.</p>
                                </GlassCard>

                                <GlassCard className="p-8 border-white/10 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2">
                                        <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
                                    </div>
                                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-500/20">
                                        <LucideKey className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-tight text-white mb-2">Demo de Demo</h3>
                                    <p className="text-sm text-gray-400">Has visto la ingeniería. Ahora es momento de implementarla para tu clínica.</p>
                                </GlassCard>

                                <GlassCard className="p-8 border-white/10 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-500">
                                        <LucideZap className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-tight text-white mb-2">ROI Garantizado</h3>
                                    <p className="text-sm text-gray-500">0% No-Shows. Esa es nuestra promesa técnica basada en datos.</p>
                                </GlassCard>
                            </div>

                            <div className="mt-16 flex justify-center">
                                <PremiumButton
                                    variant="primary"
                                    size="lg"
                                    className="px-12 py-8 text-xl font-black shadow-xl shadow-indigo-500/40"
                                    onClick={() => window.location.href = '/#agenda?qualified=true'}
                                >
                                    RESERVAR CONSULTORÍA DE INGENIERÍA
                                </PremiumButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
