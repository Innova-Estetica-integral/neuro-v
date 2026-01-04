'use client';

import { motion } from 'framer-motion';
import {
    LucideShieldCheck,
    LucideCheckCircle,
    LucideLock,
    LucideArrowRight,
    LucideFileText,
    LucideShield,
    LucideChevronLeft,
    LucideHeartPulse,
    LucideDatabase,
    LucideSearch
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegalSecurityPage() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* CLEAN NAV */}
            <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/solutions-test" className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
                            <LucideChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                        </Link>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase text-left">Ecosistema NeuroV</span>
                            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Seguridad & Confianza</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/solutions-test" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest">Soluciones</Link>
                        <PremiumButton
                            variant="primary"
                            size="sm"
                            className="!bg-emerald-600 hover:!bg-emerald-700 !text-white rounded-full px-6 py-2.5 text-[10px] font-bold !shadow-none"
                            onClick={() => router.push('/strategic-session')}
                        >
                            CONSULTORÍA PRIVADA
                        </PremiumButton>
                    </div>
                </div>
            </nav>

            {/* HERO Section */}
            <section className="relative pt-48 pb-24 px-6 sm:px-12 bg-white overflow-hidden">
                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-10">
                                <LucideShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Tu información siempre segura</span>
                            </div>

                            <h1 className="text-6xl sm:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tightest">
                                Tu información, <br />
                                <span className="text-emerald-600">siempre protegida.</span>
                            </h1>

                            <p className="text-slate-500 text-xl leading-relaxed font-medium mb-12 max-w-xl">
                                En NeuroV, cuidar los datos de tus pacientes es nuestra prioridad. Cumplimos con todas las leyes chilenas de salud y legislación vigente para que tú trabajes tranquilo.
                            </p>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors shadow-sm">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                        <LucideCheckCircle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-1">Ley 20.584 (Derechos y Deberes)</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">Privacidad absoluta en Fichas Clínicas y consentimiento Informado digital.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-lg uppercase tracking-widest whitespace-nowrap border border-emerald-100">MINSAL CHILE</div>
                                </div>

                                <div className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors shadow-sm">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                        <LucideCheckCircle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-1">Ley 19.628 (Protección de Datos)</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">Encriptación de grado bancario para toda la información personal de tus pacientes.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-lg uppercase tracking-widest whitespace-nowrap border border-emerald-100">DATA PRIVACY</div>
                                </div>
                            </div>

                            <PremiumButton
                                variant="primary"
                                size="lg"
                                className="!bg-emerald-600/20 backdrop-blur-sm hover:!bg-emerald-600/30 !text-white border-2 !border-emerald-400/50 hover:!border-emerald-400/70 rounded-[2rem] px-12 py-6 text-sm font-black shadow-2xl !shadow-emerald-100 group w-fit transition-all"
                                onClick={() => router.push('/strategic-session')}
                            >
                                VER CERTIFICACIONES <LucideArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </PremiumButton>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                                <img
                                    src="/solutions/medico_legal.png"
                                    alt="Especialista de Confianza"
                                    className="w-full aspect-square object-cover transition-all duration-700 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                {/* Floating Badge - Better Integration */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute bottom-8 left-8 right-8 bg-emerald-600/95 backdrop-blur-xl text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/20"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                            <LucideHeartPulse className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-100">Nuestro Compromiso</span>
                                    </div>
                                    <h3 className="text-3xl font-black leading-none uppercase tracking-tightest">PAZ MENTAL <br />OPERATIVA</h3>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* HL7 FHIR: EL ESTÁNDAR DE CALIDAD */}
            <section className="py-32 bg-slate-50/50 border-y border-slate-100 px-6 sm:px-12">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex-shrink-0"
                        >
                            <img
                                src="/solutions/hl7_fhir_logo.png"
                                alt="HL7 FHIR Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </motion.div>
                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tightest leading-tight">El idioma universal <br /><span className="text-emerald-600">de la salud digital</span></h3>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                                Utilizamos el estándar **HL7® FHIR®**, garantizando que la información de tus pacientes esté organizada bajo los más altos protocolos de interoperabilidad mundial. Esto asegura que tu clínica esté preparada para el futuro de la salud conectada en Chile.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEGURIDAD PRAGMÁTICA */}
            <section className="py-32 px-6 sm:px-12 bg-white">
                <div className="container mx-auto text-center mb-24">
                    <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.4em] block mb-4 italic">Tecnología centrada en ti</span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tightest leading-tight">Seguridad que no se ve,<br /> pero que se siente.</h2>
                </div>

                <div className="container mx-auto grid md:grid-cols-3 gap-10">
                    <GlassCard className="p-12 border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-[3.5rem] text-center lg:text-left">
                        <div className="w-16 h-16 bg-emerald-100 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 mx-auto lg:mx-0">
                            <LucideLock size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter">Acceso Protegido</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">Solo tú y tu equipo autorizado pueden acceder a los datos. Implementamos validación por pasos para que nadie extraño entre a tu sistema.</p>
                    </GlassCard>

                    <GlassCard className="p-12 border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-[3.5rem] text-center lg:text-left">
                        <div className="w-16 h-16 bg-emerald-100 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 mx-auto lg:mx-0">
                            <LucideDatabase size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter">Respaldo Diario</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">Tus fichas clínicas se respaldan cada día automáticamente. Nunca perderás la historia clínica de un paciente por un error técnico.</p>
                    </GlassCard>

                    <GlassCard className="p-12 border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-[3.5rem] text-center lg:text-left">
                        <div className="w-16 h-16 bg-emerald-100 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 mx-auto lg:mx-0">
                            <LucideSearch size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tighter">Control Total</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">Auditamos cada movimiento para que tengas el control total de quién vio qué información. Un sistema de orden y honestidad profesional.</p>
                    </GlassCard>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-40 px-6 sm:px-12 bg-white">
                <div className="container mx-auto">
                    <div className="bg-emerald-600 rounded-[5rem] p-16 sm:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/grid.svg')] pointer-events-none" />
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-6xl sm:text-8xl font-black mb-10 italic tracking-tightest leading-[0.9]">Queremos que <br />estés tranquilo.</h2>
                            <p className="text-xl sm:text-2xl text-emerald-50 font-medium mb-16 opacity-90 leading-relaxed">
                                Si tienes dudas sobre cómo protegemos tu consulta o quieres saber más sobre nuestra certificación HL7® FHIR®, hablemos. Un colega de nuestro equipo te ayudará de inmediato.
                            </p>
                            <PremiumButton
                                variant="secondary"
                                size="lg"
                                className="!bg-white !text-emerald-700 hover:!bg-emerald-50 rounded-[2.5rem] px-16 py-8 text-xl font-black shadow-3xl group transition-all"
                                onClick={() => router.push('/strategic-session')}
                            >
                                COMENZAR AHORA <LucideArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                            </PremiumButton>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

