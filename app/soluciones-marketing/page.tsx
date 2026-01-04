'use client';

import { motion } from 'framer-motion';
import {
    LucideTrendingUp,
    LucideArrowRight,
    LucideMessageSquare,
    LucideZap,
    LucideBrainCircuit,
    LucideTarget,
    LucideStar,
    LucideUsers,
    LucideLineChart,
    LucideFilter,
    LucideInstagram,
    LucideGlobe,
    LucideRepeat
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { Footer } from '@/components/Footer';
import { EnhancedWorkflow } from '@/components/EnhancedWorkflow';
import { LucideShieldCheck, LucideLayers, LucideNetwork } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarketingSolutionsPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen bg-[#02020a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* CINEMATIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-indigo-600/5 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* HERO SECTION: GROWTH FOCUS */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 backdrop-blur-md"
                    >
                        <LucideLineChart className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-black text-indigo-300 tracking-[0.2em] uppercase">Escale su clínica con Inteligencia</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white"
                    >
                        Tu Plan de <br />
                        <span className="text-indigo-500">Crecimiento Real.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed font-medium"
                    >
                        NeuroV no es solo una herramienta, es un sistema orquestado para que tu clínica atraiga, califique y agende pacientes de forma autónoma. Paso a paso, de forma predecible.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <PremiumButton
                            variant="primary"
                            size="lg"
                            className="shine-effect px-10 py-5 rounded-3xl text-lg shadow-[0_20px_40px_rgba(79,70,229,0.3)] !bg-indigo-600/20 backdrop-blur-sm hover:!bg-indigo-600/30 border-2 !border-indigo-400/50 hover:!border-indigo-400/70 transition-all"
                            onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            VER PLAN DE ACCIÓN
                        </PremiumButton>
                        <PremiumButton
                            variant="secondary"
                            size="lg"
                            className="px-10 py-5 rounded-3xl text-lg"
                            onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            HOJA DE RUTA
                        </PremiumButton>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 1: COMPOSICIÓN DEL SISTEMA (¿Qué es?) */}
            <section id="plan" className="py-24 sm:py-32 px-6 sm:px-12 bg-white relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 shadow-sm border border-gray-100 text-gray-900">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                            <LucideLayers className="w-4 h-4 text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Arquitectura del Plan</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">De qué se trata el sistema</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            Tres motores conectados trabajando simultáneamente para llenar tu agenda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Captación Omnicanal",
                                desc: "Integración profunda con Google Ads, Instagram y Meta para atraer pacientes que buscan soluciones ahora.",
                                icon: LucideFilter,
                                colorClass: "bg-indigo-500/10 text-indigo-600",
                                borderClass: "border-indigo-100"
                            },
                            {
                                title: "Cerebro Donna (IA)",
                                desc: "No es un bot, es inteligencia psicográfica que entiende la intención y califica cada lead 24/7.",
                                icon: LucideBrainCircuit,
                                colorClass: "bg-purple-500/10 text-purple-600",
                                borderClass: "border-purple-100"
                            },
                            {
                                title: "Conversión de Agenda",
                                desc: "Sitio web diseñado para convertir, integrado con tu agenda real y recaudación automática.",
                                icon: LucideShieldCheck,
                                colorClass: "bg-emerald-500/10 text-emerald-600",
                                borderClass: "border-emerald-100"
                            }
                        ].map((item, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] bg-gray-50 border ${item.borderClass} group hover:bg-white hover:shadow-xl transition-all`}>
                                <div className={`w-14 h-14 ${item.colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <h4 className="text-xl font-black mb-4">{item.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: CEREBRO PSICOGRÁFICO (The "Why it works") */}
            <section id="psicografia" className="py-24 sm:py-32 px-6 sm:px-12 bg-white relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 shadow-sm border border-gray-100 text-gray-900">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full">
                                <LucideBrainCircuit className="w-4 h-4 text-purple-600" />
                                <span className="text-[10px] font-black text-purple-600 tracking-widest uppercase">Inteligencia de Ventas Profunda</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tightest leading-tight">
                                Entendemos la mente <br />
                                <span className="text-purple-600">del paciente.</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                                Donna no responde de forma genérica. Identifica el perfil psicológico del interesado para adaptar el tono, la urgencia y el nivel de detalle técnico necesario para cerrar la cita.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { title: 'Analíticos', desc: 'Donna provee datos, certificaciones y precisión técnica.' },
                                    { title: 'Impulsivos', desc: ' Donna enfoca en inmediatez, resultados y disponibilidad.' },
                                    { title: 'Relacionales', desc: 'Donna usa un tono cálido, humano y empático.' },
                                    { title: 'Escépticos', desc: 'Donna presenta pruebas, garantías y despeja dudas.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
                                        <h4 className="font-black text-gray-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full" />
                            <div className="relative rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl bg-white p-8 sm:p-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                        <span className="text-xs font-black text-purple-900 tracking-widest uppercase italic">IA Analizando intención...</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 ml-12">
                                            <p className="text-sm text-gray-400 font-medium leading-relaxed italic">&ldquo;Hola, ¿qué precio tiene el tratamiento? Busco algo rápido para este fin de semana.&rdquo;</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-purple-600 text-white shadow-lg mr-12">
                                            <p className="text-sm font-bold leading-relaxed">&ldquo;NeuroV detecta: Perfil Impulsivo + Urgencia Alta. Donna responde: Hola, los valores dependen del diagnóstico, pero parten desde los $45.000. Justo nos queda un cupo para este viernes a las 15:00. ¿Lo reservamos?&rdquo;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 4: CALIFICACIÓN BANT (The Filter) */}
            <section id="bant" className="py-24 sm:py-32 px-6 sm:px-12 bg-gray-950 relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 border border-white/5 text-white">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row-reverse gap-16 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <LucideFilter className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">Filtro de Alta Calidad</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black leading-tight">Separa a los curiosos <br /><span className="text-indigo-400">de las ventas.</span></h2>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            No pierdas tiempo con gente que solo pregunta el precio. Donna califica a cada interesado mediante el scoring BANT antes de que lleguen a tu equipo.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                { t: 'Presupuesto', d: '¿Tiene la capacidad para el tratamiento?' },
                                { t: 'Autoridad', d: '¿Es quien toma la decisión?' },
                                { t: 'Necesidad', d: '¿Qué tan real es su dolor o requerimiento?' },
                                { t: 'Tiempo', d: '¿Busca una solución hoy o en 6 meses?' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">{item.t[0]}</div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">{item.t}</p>
                                        <p className="text-xs text-gray-500">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                            <div className="text-center space-y-6">
                                <div className="text-6xl font-black text-indigo-400 tracking-tighter">87/100</div>
                                <div className="text-xs font-black text-gray-500 tracking-widest uppercase">Score de Calificación del Lead</div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '87%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                                <p className="text-sm text-gray-400 font-medium italic">&ldquo;Donna ha detectado que este prospecto cumple con el presupuesto y tiene una urgencia alta. Priorizando agendamiento.&rdquo;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 5: REPUTACIÓN AUTOMATIZADA (The Trust Loop) */}
            <section id="reputacion" className="py-24 sm:py-32 px-6 sm:px-12 bg-white relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 shadow-sm border border-gray-100 text-gray-900">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
                                <LucideStar className="w-4 h-4 text-amber-600" />
                                <span className="text-[10px] font-black text-amber-600 tracking-widest uppercase">Activo Digital de Confianza</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tightest leading-tight">
                                Reputación que <br />
                                <span className="text-amber-600">vende sola.</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                                Donna detecta a los pacientes más conformes tras su consulta y solicita automáticamente una reseña en Google. El sistema filtra las experiencias negativas para gestionarlas de forma privada y profesional.
                            </p>
                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => <LucideStar key={s} size={20} fill="currentColor" />)}
                                </div>
                                <span className="text-lg font-black text-gray-900">4.9/5.0 Media Real</span>
                            </div>
                        </motion.div>

                        <div className="space-y-4">
                            {[
                                { t: 'Filtro de Satisfacción', d: 'Solo invitamos a Google a quienes califican con 5 estrellas.' },
                                { t: 'Gestión de Feedback', d: 'Feedback menor a 4 estrellas llega directo a tu equipo privado.' },
                                { t: 'SEO Local', d: 'A más reseñas positivas, mejor posición en Google Maps.' }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                                    <h4 className="font-black text-gray-900 mb-2">{item.t}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 6: NUTRICIÓN Y RE-PESCA (No lead left behind) */}
            <section id="nutricion" className="py-24 sm:py-32 px-6 sm:px-12 bg-indigo-900 relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 border border-white/5 text-white">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                            <LucideRepeat className="w-4 h-4 text-white" />
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">Cero Desperdicio de Inversión</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black leading-tight">Nadie se queda <br /><span className="text-indigo-300">en el camino.</span></h2>
                        <p className="text-xl text-white/80 font-medium leading-relaxed">
                            Si un paciente calificado no agendó hoy, Donna no lo olvida. El sistema inicia flujos de nutrición educativa y ofertas flash para recuperar el interés y asegurar la cita en el futuro.
                        </p>
                    </div>
                    <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
                        <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <div className="text-4xl font-black mb-2">35%</div>
                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Recuperación de Leads</p>
                        </div>
                        <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <div className="text-4xl font-black mb-2">24h</div>
                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Tiempo de Re-contacto</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 7: HOJA DE RUTA (¿Cómo funciona?) */}
            <section id="roadmap" className="py-24 sm:py-32 px-6 sm:px-12 bg-gray-950 relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 border border-white/5 text-white">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <LucideNetwork className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">Hoja de Ruta de Pacientes</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black leading-tight">Así funciona tu <br /><span className="text-indigo-400">crecimiento.</span></h2>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            Acompáñanos a ver cómo se genera confianza desde el primer contacto hasta convertir un prospecto en una atención confirmada.
                        </p>
                        <div className="pt-8 border-t border-white/10">
                            <div className="flex items-center gap-4 text-indigo-400 font-bold">
                                <LucideStar size={20} />
                                <span className="uppercase tracking-widest text-xs">Sistema 100% Autónomo</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <EnhancedWorkflow />
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: FUNNELS DE ALTO IMPACTO (Zebra Pattern) */}
            <section id="funnels" className="py-24 sm:py-32 px-6 sm:px-12 bg-white relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 shadow-sm border border-gray-100 text-gray-900">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative lg:order-1"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
                            {/* Funnel Visualization */}
                            <div className="relative rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-200 p-8 shadow-xl">
                                <div className="space-y-4">
                                    <div className="w-full h-12 bg-indigo-600/10 border border-indigo-200 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-indigo-600">Tráfico Calificado (Ads)</div>
                                    <div className="w-[80%] mx-auto h-12 bg-purple-600/10 border border-purple-200 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-purple-600 italic">Donna (Filtrado IA)</div>
                                    <div className="w-[60%] mx-auto h-12 bg-emerald-600/10 border border-emerald-200 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-emerald-600">Paciente en Consulta</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                                <LucideStar className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Eficacia Comercial</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tightest leading-tight">
                                Del anuncio <br />
                                <span className="text-emerald-600">a la sesión.</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                                Creamos el viaje completo del paciente. No solo te traemos visitas, te traemos **pacientes que ya conocen tu valor** y están listos para tratarse.
                            </p>
                            <PremiumButton
                                variant="secondary"
                                size="lg"
                                className="px-10 py-5 rounded-3xl"
                                onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                ANALIZAR MI EMBUDO
                            </PremiumButton>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* CASES: TRUST BUILDING */}
            <section id="casos" className="py-24 sm:py-32 px-6 sm:px-12 relative overflow-hidden bg-[#050511] text-white rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 border border-white/5">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="text-center mb-20 text-white">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Resultados Reales</h2>
                        <p className="text-lg text-gray-400 italic font-medium">Casos donde el plan NeuroV transformó la gestión por completo.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <CaseStudyCard
                            clinicName="Clínica DermaLife"
                            specialty="Dermatología"
                            before="Leads de Facebook que nunca contestaban el teléfono."
                            after="Donna contacta en el segundo 0. Agenda el 45% de los leads automáticamente."
                            stat="+300%"
                            statLabel="Leads Agendados"
                            color="indigo"
                        />
                        <CaseStudyCard
                            clinicName="Dental Viña"
                            specialty="Odontología"
                            before="Inversión en Google que no sabíamos si rendía."
                            after="Tracking total desde el clic hasta la boleta en SII. ROI claro de x4."
                            stat="x4 ROI"
                            statLabel="Retorno Publicitario"
                            color="emerald"
                        />
                        <CaseStudyCard
                            clinicName="KineAdvance"
                            specialty="Kinesiología"
                            before="Perdíamos 4 horas al día respondiendo dudas básicas."
                            after="Donna resuelve el 90% de las dudas y solo nos pasa la cita confirmada."
                            stat="-4h"
                            statLabel="Ahorro Diario Operativo"
                            color="pink"
                        />
                    </div>
                </div>
            </section>

            {/* FINAL CTA: SESSIÓN DE ESTRATEGIA */}
            <section id="agenda" className="py-24 sm:py-32 px-6 sm:px-12 relative overflow-hidden bg-[#050511] text-white rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-12 border border-white/5">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black mb-8 italic">¿Escalamos tu clínica?</h2>
                    <p className="text-2xl text-indigo-400 font-bold uppercase tracking-widest mb-12">AGENDA TU DIAGNÓSTICO DE CRECIMIENTO GRATIS</p>
                    <PremiumButton
                        variant="primary"
                        size="lg"
                        className="shine-effect py-8 rounded-[2rem] text-xl font-black shadow-[0_20px_50px_rgba(79,70,229,0.4)] px-16"
                        onClick={() => router.push('/strategic-session')}
                    >
                        COMENZAR AHORA
                    </PremiumButton>
                </div>
            </section>

            <Footer />
        </main>
    );
}
