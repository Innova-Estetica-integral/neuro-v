'use client';

import { motion } from 'framer-motion';
import { LucideVideo, LucideTrendingUp, LucideArrowRight, LucidePlay, LucideMessageSquare, LucideInstagram, LucideCalendar, LucideWallet } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';

export function GrowthLanding() {
    return (
        <div className="space-y-32">
            {/* Hero Section - Growth Focus */}
            <section className="container mx-auto px-6 pt-20 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8 backdrop-blur-md">
                        <LucideTrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-black text-purple-300 tracking-[0.2em] uppercase">
                            Multiplica tu Facturación hoy mismo
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] tracking-tight">
                        Transforma tu Clínica en una <span className="text-gradient from-purple-400 to-pink-500">Máquina de Ventas</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 sm:mb-12 leading-relaxed font-medium">
                        NeuroV automatiza tus cierres por WhatsApp, asegura los pagos antes de la cita y recupera a tus pacientes de Redes Sociales sin que muevas un dedo.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-6">
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

            {/* Video Feature Section */}
            <section id="demo" className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Mira NeuroV en Acción</h2>
                    <p className="text-gray-400 font-medium">Así es como nuestra IA llena tu agenda en tiempo real</p>
                </div>

                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                    <GlassCard className="aspect-video relative overflow-hidden flex items-center justify-center border-white/10 p-0 shadow-2xl">
                        {/* Placeholder for Video Player UI */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        <div className="relative z-10 text-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl group/btn"
                            >
                                <LucidePlay className="w-10 h-10 fill-white group-hover:fill-indigo-400 transition-colors" />
                            </motion.button>
                            <p className="mt-6 text-white font-black uppercase tracking-widest text-sm">VIDEO EXPLICATIVO (NeuroV Workflow)</p>
                        </div>

                        {/* Video Controls Mock */}
                        <div className="absolute bottom-0 left-0 w-full p-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-4">
                                <div className="w-8 h-2 bg-indigo-500 rounded-full" />
                                <div className="w-24 h-2 bg-white/20 rounded-full" />
                            </div>
                            <div className="text-[10px] font-black text-white/60 tracking-widest">02:45 / 04:20</div>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* Business Features Grid */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<LucideInstagram />}
                        title="Ventas de Instagram"
                        desc="Convierte cada mensaje directo en una cita agendada en 45 segundos con nuestro Cerebro IA."
                    />
                    <FeatureCard
                        icon={<LucideMessageSquare />}
                        title="WhatsApp Persuasivo"
                        desc="Nuestra IA no solo recuerda, convence. Recupera pacientes perdidos de forma automática."
                    />
                    <FeatureCard
                        icon={<LucideWallet />}
                        title="Cobros Anticipados"
                        desc="Asegura el 100% de tus ingresos. Cobros directos por Transbank al momento de agendar."
                    />
                    <FeatureCard
                        icon={<LucideCalendar />}
                        title="Agenda Inteligente"
                        desc="Optimización de bloques horarios para que tu equipo siempre esté produciendo."
                    />
                </div>
            </section>

            {/* Revenue Mockup Section - Replacing Technical Terminal */}
            <section className="container mx-auto px-6 py-32">
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

            {/* Virtual Assistant Section */}
            <section className="container mx-auto px-6 py-20 bg-indigo-500/5 rounded-[3rem] border border-white/5">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full" />
                            <GlassCard className="relative z-10 border-white/20 p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                                        <LucideMessageSquare className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">En Línea</p>
                                        <p className="text-lg font-bold">Cerebro de Ventas NeuroV</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 max-w-[80%]">
                                        <p className="text-sm text-gray-300">"Hola, veo que te interesa el tratamiento de Hidrolipoclasia. ¿Prefieres agendar para esta tarde o mañana por la mañana?"</p>
                                    </div>
                                    <div className="bg-indigo-500/20 p-4 rounded-2xl rounded-tr-none border border-indigo-500/20 ml-auto max-w-[80%]">
                                        <p className="text-sm text-indigo-100">"Mañana en la mañana por favor."</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 max-w-[80%]">
                                        <p className="text-sm text-gray-300">"¡Perfecto! Reserva confirmada. Te enviamos el link de pago por WhatsApp para asegurar tu cupo."</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 italic">Tu Mejor Vendedora, <br /><span className="text-gradient">No Duerme</span></h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed font-medium">
                            Mientras tú duermes o atiendes pacientes, nuestro Cerebro de Ventas perfila psicográficamente a cada interesado de Instagram o WhatsApp y cierra la venta en el acto.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-300 font-bold">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                Clasificación BANT inmediata.
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 font-bold">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                Link de pago automático por Transbank.
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 font-bold">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                Sincronización instantánea con tu agenda.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <GlassCard className="p-8 border-white/5 hover:border-indigo-500/30 transition-all duration-500" hoverIntensity="high">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-lg font-bold mb-3 uppercase tracking-tighter text-white">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">{desc}</p>
        </GlassCard>
    );
}
