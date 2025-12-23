'use client';

import { motion } from 'framer-motion';
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
    const { profile, uiConfig } = usePsychographic();

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 bg-mesh relative overflow-x-hidden">
            {/* Background Grain/Noise */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <LucideBrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-xl sm:text-2xl font-black tracking-tighter">
                            NEURO<span className="text-indigo-500">V</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                        <a href="#tecnologia" className="hover:text-white transition-colors">Tecnología</a>
                        <a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a>
                        <a href="#roi" className="hover:text-white transition-colors">ROI</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <PremiumButton variant="primary" size="sm" onClick={() => window.location.href = '/clinic-alpha'}>
                            PROBAR DEMO
                        </PremiumButton>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-6 py-20 text-center relative">
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
                                {profile === 'analytic' ? 'Arquitectura Basada en Evidencia Clinical' : 'Motor de Ingresos para Clínicas'}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] tracking-tight">
                            {profile === 'analytic' ? (
                                <>Interoperabilidad <span className="text-gradient">FHIR R4</span> & Conversión Psico-Digital</>
                            ) : (
                                <>Garantiza <span className="text-gradient">0% No-Shows</span> y Maximiza tu Facturación</>
                            )}
                        </h1>

                        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 sm:mb-12 leading-relaxed font-medium">
                            {profile === 'analytic' ?
                                'Aseguramos la integridad de los datos bajo Ley 21.668 mientras nuestro asistente virtual incrementa tus tasas de agendamiento en un 275%.' :
                                'Elimina la pérdida financiera por inasistencias. Nuestro sistema automatiza el cobro y la confirmación mediante persuasión psicográfica en tiempo real.'
                            }
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6">
                            <PremiumButton
                                variant="secondary"
                                size="lg"
                                className="shine-effect w-full sm:w-auto px-8 sm:px-12 rounded-[1.5rem] text-sm sm:text-lg"
                                onClick={() => window.location.href = '#agenda'}
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
                <section id="roi" className="container mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StatsCard icon={<LucideTrendingUp />} label="ROI Promedio" value="+143%" sub="Primer año" />
                        <StatsCard icon={<LucideZap />} label="No-Shows" value="0%" sub="Garantizado por contrato" />
                        <StatsCard icon={<LucideBrainCircuit />} label="Precisión IA" value="98.2%" sub="Perfilado psicográfico" />
                        <StatsCard icon={<LucideShieldCheck />} label="Normativa" value="100%" sub="Cumplimiento Ley 21.668" />
                    </div>
                </section>

                {/* Value Pillars Section */}
                <section id="tecnologia" className="container mx-auto px-6 py-32">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 italic">Ingeniería de Conversión</h2>
                        <div className="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <GlassCard className="border-indigo-500/10">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-8">
                                <LucideBrainCircuit className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Perfilado en Tiempo Real</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                No todos tus pacientes compran igual. Detectamos si son Impulsivos o Analíticos en los primeros 30 segundos y cambiamos la web para ellos.
                            </p>
                        </GlassCard>

                        <GlassCard className="border-purple-500/10">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 mb-8">
                                <LucideActivity className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Scoring BANT Automático</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Tu equipo comercial no debe perder tiempo. El sistema califica el interés y capacidad de pago antes de dejarlos agendar en tu calendario.
                            </p>
                        </GlassCard>

                        <GlassCard className="border-cyan-500/10">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-3xl flex items-center justify-center text-cyan-400 mb-8">
                                <LucideDatabase className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Sincronización Total</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Integración nativa con WhatsApp Business, Google Calendar y pasarelas de pago chilenas para un flujo de caja sin fricción.
                            </p>
                        </GlassCard>
                    </div>
                </section>

                {/* Medical Grade Security Section (Sales Point 3) */}
                <section id="seguridad" className="w-full relative py-16 sm:py-32 overflow-hidden bg-indigo-900/5">
                    <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 sm:gap-24 items-center">
                            <div className="w-full order-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                                    <LucideLock className="w-3 h-3 text-green-400" />
                                    <span className="text-[10px] font-black text-green-300 tracking-widest uppercase">Fortaleza Inexpugnable</span>
                                </div>
                                <h2 className="text-2xl sm:text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                                    Tus datos son un activo, <br className="hidden sm:block" />
                                    <span className="text-gradient">no un riesgo</span>.
                                </h2>
                                <p className="text-sm sm:text-xl text-gray-400 mb-8 leading-relaxed font-medium">
                                    Diseñamos la arquitectura más segura de la industria estética, superando los estándares exigidos por el Ministerio de Salud.
                                </p>

                                <ul className="space-y-6">
                                    <SecurityFeature
                                        icon={<LucideDatabase />}
                                        title="Bóveda pgsodium"
                                        desc="Cifrado militar para tus credenciales."
                                    />
                                    <SecurityFeature
                                        icon={<LucideShieldCheck />}
                                        title="Aislamiento RLS"
                                        desc="Tus registros están blindados e inaccesibles."
                                    />
                                    <SecurityFeature
                                        icon={<LucideServer />}
                                        title="Ficha Inmutable"
                                        desc="Trazabilidad total exigida por Ley."
                                    />
                                </ul>
                            </div>

                            <div className="w-full order-2 relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                                <GlassCard className="relative z-10 p-4 border-white/10 w-full overflow-hidden">
                                    <div className="bg-[#0f172a] rounded-xl p-4 sm:p-6 border border-white/5 font-mono text-[10px] sm:text-sm overflow-x-auto custom-scrollbar">
                                        <div className="flex gap-2 mb-4 opacity-40">
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2 whitespace-nowrap sm:whitespace-normal">
                                            <p className="text-indigo-400">CREATE POLICY clinic_isolation</p>
                                            <p className="text-purple-400 pl-4">FOR SELECT TO verified_clinic</p>
                                            <p className="text-cyan-400 pl-4">USING (clinic_id = current_setting('app.id'));</p>
                                            <div className="h-4" />
                                            <p className="text-gray-500">// Security Active: RLS</p>
                                            <p className="text-green-400 font-bold tracking-widest uppercase mt-4 text-[8px] sm:text-xs">PG_SODIUM: SECURE</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </section>

                <BookingSection />

                <SalesAssistant />

                {/* Footer */}
                <footer className="container mx-auto px-6 py-20 border-t border-white/5 text-center text-gray-500 text-sm">
                    <p>© 2025 NEURO-VENTAS V6. Todos los derechos reservados.</p>
                    <p className="mt-2 text-gray-600 font-mono tracking-widest uppercase">Tecnología Revenue Engine de Alto Impulso</p>
                </footer>
            </main>
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
