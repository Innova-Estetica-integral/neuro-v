'use client';

import { motion } from 'framer-motion';
import { LucideVideo, LucideTrendingUp, LucideArrowRight, LucidePlay, LucideMessageSquare, LucideInstagram, LucideCalendar, LucideWallet, LucideClock, LucideShieldCheck, LucideBrainCircuit, LucideBarChart } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';
import { WorkflowMockup } from './WorkflowMockup';
import { AnimatedWorkflow } from './AnimatedWorkflow';
import { EnhancedWorkflow } from './EnhancedWorkflow';
import { analytics } from '@/lib/analytics/tracker';
import { parseUTM } from '@/lib/utils/utm';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function GrowthLanding() {
    const searchParams = useSearchParams();

    // Track page view and UTM parameters
    useEffect(() => {
        const utm = parseUTM(searchParams);
        analytics.trackUTM(utm);
        analytics.page('growth_landing', {
            utm
        });
    }, [searchParams]);
    return (
        <div className="space-y-32">
            {/* Hero Section - Growth Focus */}
            <section className="container mx-auto px-6 pt-64 sm:pt-72 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full mb-12 backdrop-blur-md">
                        <LucideTrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-black text-purple-300 tracking-[0.2em] uppercase">
                            Multiplica tu Facturación hoy mismo
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                        Transforma tu Clínica en una <br className="hidden sm:block" />
                        <span className="text-gradient from-purple-400 to-pink-500">Máquina de Ventas</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-12 leading-relaxed font-medium px-4">
                        NeuroV automatiza tus cierres por WhatsApp, asegura los pagos antes de la cita y recupera a tus pacientes de Redes Sociales sin que muevas un dedo.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-8 mb-20">
                        <PremiumButton
                            variant="primary"
                            size="lg"
                            className="shine-effect w-full sm:w-auto px-12 rounded-3xl text-lg shadow-[0_20px_40px_rgba(168,85,247,0.3)]"
                            onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                            icon={<LucideArrowRight />}
                        >
                            VER DEMO DE VENTAS
                        </PremiumButton>

                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                            Únete a las 150+ Clínicas que ya escalaron su Profit
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Interactive Workflow Demo */}
            <section className="py-0 px-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="text-center px-4">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
                            NeuroV en Acción
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-4">
                            Así es como nuestra IA llena tu agenda
                        </p>
                    </div>

                    <div className="w-full">
                        <EnhancedWorkflow />
                    </div>
                </div>
            </section>

            {/* Business Features Grid */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<LucideInstagram />}
                        title="Ventas de Instagram"
                        desc="Convierte cada mensaje directo en una cita agendada en 45 segundos con nuestro Cerebro IA."
                        color="pink"
                    />
                    <FeatureCard
                        icon={<LucideMessageSquare />}
                        title="WhatsApp Persuasivo"
                        desc="Nuestra IA no solo recuerda, convence. Recupera pacientes perdidos de forma automática."
                        color="green"
                    />
                    <FeatureCard
                        icon={<LucideWallet />}
                        title="Cobros Anticipados"
                        desc="Asegura el 100% de tus ingresos. Cobros directos por Transbank al momento de agendar."
                        color="yellow"
                    />
                    <FeatureCard
                        icon={<LucideCalendar />}
                        title="Agenda Inteligente"
                        desc="Optimización de bloques horarios para que tu equipo siempre esté produciendo."
                        color="blue"
                    />
                </div>
            </section>

            {/* Revenue Mockup Section - Replacing Technical Terminal */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                            <LucideTrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-[10px] font-black text-green-300 tracking-widest uppercase">Resultados Tangibles</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Toma el control de tu <span className="text-gradient from-green-400 to-cyan-500">Crecimiento Financiero</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-indigo-400">
                                    <LucideTrendingUp size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Aumento del 27% en Ventas Netas</h4>
                                    <p className="text-gray-400">Medido en clínicas reales tras solo 30 días de implementación asistida.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-purple-400">
                                    <LucideMessageSquare size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Liberamos 15h de tu Secretaria</h4>
                                    <p className="text-gray-400">Automatizamos la confirmación y el seguimiento, dejando que ella venda más en presencial.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full" />
                        <GlassCard className="relative z-10 border-white/10 bg-[#0f172a]/80 p-8 shadow-3xl">
                            {/* Revenue Dashboard UI Mock */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end pb-6 border-b border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Impacto NeuroV</p>
                                        <p className="text-3xl font-black text-white">$12.450.000 <span className="text-xs text-green-400 font-bold ml-2">+24.5%</span></p>
                                    </div>
                                    <div className="bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 text-[10px] font-black text-indigo-300">ESTE MES</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">No-Shows Evitados</p>
                                        <p className="text-xl font-black text-white">42 citas</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Recuperado IG/FB</p>
                                        <p className="text-xl font-black text-white">$3.820.000</p>
                                    </div>
                                </div>

                                <div className="h-32 flex items-end gap-1.5 pt-4">
                                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                    <span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>


            {/* SECCIÓN LO QUE DEBES SABER (MOVED FROM MAIN PAGE) */}
            <section id="pilares" className="container mx-auto px-6 py-20 bg-[#0A0B14] relative overflow-hidden rounded-[3rem] border border-white/5">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-left mb-16 sm:mb-24 space-y-8">
                        <div className="w-full flex justify-center mb-8 lg:justify-start">
                            <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                <LucideTrendingUp size={10} className="w-[14px] h-[14px]" /> LO QUE DEBES SABER
                            </div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-white mb-6">Cómo funciona una consulta profesional.</h2>
                        <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                            Estos son los pilares que toda consulta médica moderna necesita para funcionar de forma ordenada y profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Implementación Rápida',
                                desc: 'Una buena herramienta debe estar lista en días, no meses. Esto te permite empezar a trabajar ordenadamente sin perder tiempo.',
                                icon: LucideClock,
                                highlight: '48 horas',
                                iconBg: 'bg-indigo-600/20',
                                iconColor: 'text-indigo-400'
                            },
                            {
                                title: 'Cumplimiento Legal',
                                desc: 'Es fundamental que tu sistema cumpla con las leyes chilenas de salud y protección de datos para evitar problemas legales.',
                                icon: LucideShieldCheck,
                                highlight: 'Ley 20.584 y 19.628',
                                iconBg: 'bg-emerald-600/20',
                                iconColor: 'text-emerald-400'
                            },
                            {
                                title: 'Gestión Financiera',
                                desc: 'Boletas, impuestos y pagos de equipo deben estar centralizados para que no tengas que hacer todo manualmente.',
                                icon: LucideBrainCircuit,
                                highlight: 'SII y BUK integrados',
                                iconBg: 'bg-violet-600/20',
                                iconColor: 'text-violet-400'
                            },
                            {
                                title: 'Bonos de Salud',
                                desc: 'Tus pacientes necesitan comprar bonos Fonasa e Isapre fácilmente. Una buena integración hace esto automático.',
                                icon: LucideShieldCheck,
                                highlight: 'I-Med conectado',
                                iconBg: 'bg-cyan-600/20',
                                iconColor: 'text-cyan-400'
                            },
                            {
                                title: 'Presencia Constante',
                                desc: 'Tu consulta debe estar visible para nuevos pacientes. Esto incluye web, redes sociales y respuestas rápidas por WhatsApp.',
                                icon: LucideTrendingUp,
                                highlight: 'Disponible 24/7',
                                iconBg: 'bg-amber-600/20',
                                iconColor: 'text-amber-400'
                            },
                            {
                                title: 'Crecimiento Flexible',
                                desc: 'Si tu consulta crece o abres una segunda sede, tu sistema debe adaptarse sin que tengas que cambiar de herramienta.',
                                icon: LucideBarChart,
                                highlight: 'Multi-sede',
                                iconBg: 'bg-pink-600/20',
                                iconColor: 'text-pink-400'
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="h-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 transition-all hover:bg-white/[0.05] hover:border-indigo-500/30 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] hover:-translate-y-2 flex flex-col justify-between">
                                    <div>
                                        <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center ${item.iconColor} mb-6 group-hover:scale-110 transition-transform`}>
                                            <item.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">En NeuroV</div>
                                        <div className="text-sm font-black text-[#B9FF66] tracking-wide">{item.highlight}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Virtual Assistant Section */}
            <section className="container mx-auto px-6 py-20 bg-indigo-500/5 rounded-[3rem] border border-white/5">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full" />
                            <GlassCard className="relative z-10 border-white/20 p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 relative">
                                        <LucideMessageSquare className="text-white w-6 h-6" />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f172a] animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">En Línea • 24/7</p>
                                        <p className="text-lg font-bold">Cerebro de Ventas NeuroV</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 max-w-[85%]">
                                        <p className="text-sm text-gray-300">&quot;Hola, veo que te interesa el tratamiento de Hidrolipoclasia. ¿Prefieres agendar para esta tarde o mañana por la mañana?&quot;</p>
                                        <p className="text-[10px] text-gray-600 mt-2">14:23</p>
                                    </div>
                                    <div className="bg-indigo-500/20 p-4 rounded-2xl rounded-tr-none border border-indigo-500/20 ml-auto max-w-[85%]">
                                        <p className="text-sm text-indigo-100">&quot;Mañana en la mañana por favor.&quot;</p>
                                        <p className="text-[10px] text-indigo-300/60 mt-2 text-right">14:24</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 max-w-[85%]">
                                        <p className="text-sm text-gray-300">&quot;¡Perfecto! Reserva confirmada para mañana 10:00 AM. Te envío el link de pago por WhatsApp para asegurar tu cupo.&quot;</p>
                                        <p className="text-[10px] text-gray-600 mt-2">14:24</p>
                                    </div>
                                    {/* Typing Indicator */}
                                    <div className="flex items-center gap-2 max-w-[85%]">
                                        <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-white/10">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                            <LucideMessageSquare className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">IA Conversacional Avanzada</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Tu Mejor Vendedora, <br />
                            <span className="text-gradient">No Duerme</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed font-medium">
                            Mientras tú duermes o atiendes pacientes, nuestro Cerebro de Ventas perfila psicográficamente a cada interesado de Instagram o WhatsApp y cierra la venta en el acto.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/20">
                                    <LucideTrendingUp className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-1">Clasificación BANT Inmediata</p>
                                    <p className="text-sm text-gray-500">Detecta Budget, Authority, Need y Timeline en 30 segundos</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0 border border-green-500/20">
                                    <LucideWallet className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-1">Link de Pago Automático</p>
                                    <p className="text-sm text-gray-500">Transbank integrado, cobro antes de la cita</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 border border-purple-500/20">
                                    <LucideCalendar className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-1">Sincronización Instantánea</p>
                                    <p className="text-sm text-gray-500">Agenda bloqueada en tiempo real, cero doble booking</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc, color = 'indigo' }: { icon: any, title: string, desc: string, color?: string }) {
    const colorConfig = {
        pink: {
            border: 'border-pink-500/20 hover:border-pink-500/50',
            iconBg: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
            iconColor: 'text-pink-400',
            glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'
        },
        green: {
            border: 'border-green-500/20 hover:border-green-500/50',
            iconBg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
            iconColor: 'text-green-400',
            glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
        },
        yellow: {
            border: 'border-yellow-500/20 hover:border-yellow-500/50',
            iconBg: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
            iconColor: 'text-yellow-400',
            glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]'
        },
        blue: {
            border: 'border-blue-500/20 hover:border-blue-500/50',
            iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
            iconColor: 'text-blue-400',
            glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
        },
        indigo: {
            border: 'border-indigo-500/20 hover:border-indigo-500/50',
            iconBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
            iconColor: 'text-indigo-400',
            glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]'
        }
    };

    const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.indigo;

    return (
        <GlassCard className={`p-8 ${config.border} ${config.glow} transition-all duration-500`} hoverIntensity="high">
            <div className={`w-12 h-12 ${config.iconBg} rounded-2xl flex items-center justify-center ${config.iconColor} mb-6 border border-white/10 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h4 className="text-lg font-bold mb-3 uppercase tracking-tighter text-white">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">{desc}</p>
        </GlassCard>
    );
}
