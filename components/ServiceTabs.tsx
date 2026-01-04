'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideBrainCircuit,
    LucideMessageSquare,
    LucideTrendingUp,
    LucideStar,
    LucideLayout,
    LucideCheckCircle2,
    LucideArrowRight
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';

const services = [
    {
        id: 'intelligence',
        label: 'Inteligencia IA',
        icon: LucideBrainCircuit,
        color: 'indigo',
        title: 'Tu recepción siempre al día',
        description: 'No más desorden. NeuroV te ayuda a entender a cada paciente para ofrecerle exactamente lo que busca.',
        features: [
            {
                title: 'Perfilado Psicográfico',
                desc: 'Donna entiende lo que el paciente necesita y le responde de forma clara y amable, adaptándose a su ritmo.',
                metric: '3x más conversión'
            },
            {
                title: 'Calificación BANT',
                desc: 'Filtra curiosos de pacientes reales. Analiza Presupuesto, Autoridad, Necesidad y Tiempo en 30 segundos.',
                metric: '40% menos tiempo perdido'
            }
        ],
        visual: 'demo-intelligence' // Placeholder for specific visual component
    },
    {
        id: 'advertising',
        label: 'Publicidad',
        icon: LucideTrendingUp,
        color: 'purple',
        title: 'Tus pacientes de Redes Sociales, directo a tu agenda',
        description: 'No pierdas más contactos. Conecta tus anuncios de Instagram y Facebook directamente con tu gestión diaria.',
        features: [
            {
                title: 'Nutrición Inmediata',
                desc: 'Respuesta en <30 segundos a cada lead de Instagram y Facebook. Aprovecha el momento de interés.',
                metric: 'Recupera $3.8M/mes'
            },
            {
                title: 'Análisis de Oportunidades',
                desc: 'Dashboard inteligente que te dice dónde invertir. Detecta qué tratamiento y canal es más rentable.',
                metric: 'ROI x2.5'
            }
        ],
        visual: 'demo-ads'
    },
    {
        id: 'automation',
        label: 'Automatización',
        icon: LucideMessageSquare,
        color: 'green',
        title: 'Tu consulta fluye sin esfuerzo',
        description: 'Elimina las tareas repetitivas. Desde recordatorios hasta recuperación de pacientes perdidos.',
        features: [
            {
                title: 'Cero No-Shows',
                desc: 'Sistema de 3 niveles: Recordatorio 48h, Confirmación 24h y Aviso de salida 2h antes.',
                metric: 'Reduce no-shows al 8%'
            },
            {
                title: 'Recuperación de Carritos',
                desc: 'Seguimiento automático a quienes intentaron agendar pero no pagaron. Ofertas flash para indecisos.',
                metric: '35% citas recuperadas'
            }
        ],
        visual: 'demo-automation'
    },
    {
        id: 'reputation',
        label: 'Reputación',
        icon: LucideStar,
        color: 'amber',
        title: 'Tu buena reputación, a la vista de todos',
        description: 'Genera confianza sin tener que pedir favores. Recolecta las opiniones de tus pacientes más conformes.',
        features: [
            {
                title: 'Filtro Inteligente',
                desc: 'Solo los pacientes felices son invitados a Google. Los insatisfechos te dejan feedback privado.',
                metric: '4.8 Estrellas Promedio'
            },
            {
                title: 'Visibilidad Local',
                desc: 'Más reseñas significan mejor posición en Google Maps. Atrae pacientes cercanos gratis.',
                metric: '+15 reseñas/mes'
            }
        ],
        visual: 'demo-reviews'
    },
    {
        id: 'web',
        label: 'Web Conversión',
        icon: LucideLayout,
        color: 'cyan',
        title: 'Una web pensada para tus pacientes',
        description: 'Olvídate de las páginas complicadas. Tu sitio NeuroV está diseñado para que agendar una cita sea muy fácil.',
        features: [
            {
                title: 'Agenda en 1 Click',
                desc: 'Sin formularios eternos. Experiencia fluida integrada con Transbank para asegurar el pago.',
                metric: '60% prepago'
            },
            {
                title: 'Landing Pages Dinámicas',
                desc: 'Páginas específicas para cada campaña o tratamiento que se adaptan al visitante.',
                metric: 'Alta conversión móvil'
            }
        ],
        visual: 'demo-web'
    }
];

const colorMap = {
    indigo: {
        bg: 'bg-indigo-500/10',
        activeBg: 'bg-indigo-500',
        text: 'text-indigo-400',
        border: 'border-indigo-500/50',
        glow: 'bg-indigo-500/20',
        accent: 'text-indigo-300'
    },
    purple: {
        bg: 'bg-purple-500/10',
        activeBg: 'bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-500/50',
        glow: 'bg-purple-500/20',
        accent: 'text-purple-300'
    },
    green: {
        bg: 'bg-green-500/10',
        activeBg: 'bg-green-500',
        text: 'text-green-400',
        border: 'border-green-500/50',
        glow: 'bg-green-500/20',
        accent: 'text-green-300'
    },
    amber: {
        bg: 'bg-amber-500/10',
        activeBg: 'bg-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        glow: 'bg-amber-500/20',
        accent: 'text-amber-300'
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        activeBg: 'bg-cyan-500',
        text: 'text-cyan-400',
        border: 'border-cyan-500/50',
        glow: 'bg-cyan-500/20',
        accent: 'text-cyan-300'
    }
};

export function ServiceTabs() {
    const [activeTab, setActiveTab] = useState(services[0].id);
    const activeService = services.find(s => s.id === activeTab) || services[0];
    const colors = colorMap[activeService.color as keyof typeof colorMap];

    return (
        <section className="container mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6"
                >
                    <LucideBrainCircuit className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black text-indigo-300 tracking-widest uppercase">Gestiona tus pacientes en un solo lugar</span>
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                    Herramientas para que tu <br className="sm:hidden" />
                    <span className={`text-gradient from-${activeService.color}-400 to-${activeService.color}-600`}>Consulta Funcione</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Elimina el desorden y deja que NeuroV te ayude con las tareas del día a día. Una solución profesional que te devuelve el control de tu tiempo.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Navigation Tabs */}
                <div className="lg:w-1/3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 scrollbar-hide">
                    {services.map((service) => {
                        const sColors = colorMap[service.color as keyof typeof colorMap];
                        const isActive = activeTab === service.id;
                        return (
                            <button
                                key={service.id}
                                onClick={() => setActiveTab(service.id)}
                                className={`flex-shrink-0 lg:w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center gap-4 group ${isActive
                                    ? `${sColors.bg} ${sColors.border} shadow-[0_0_30px_rgba(0,0,0,0.2)]`
                                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive
                                    ? `${sColors.activeBg} text-white shadow-lg`
                                    : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                                    }`}>
                                    <service.icon size={20} />
                                </div>
                                <span className={`font-bold text-lg whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                    }`}>
                                    {service.label}
                                </span>
                                {isActive && (
                                    <motion.div layoutId="activeTabArrow" className="ml-auto hidden lg:block">
                                        <LucideArrowRight size={16} className={sColors.text} />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full p-8 md:p-12 border-white/10 relative overflow-hidden bg-black/40">
                                {/* Background Glow */}
                                <div className={`absolute top-0 right-0 w-[300px] h-[300px] ${colors.glow} blur-[120px] rounded-full pointer-events-none`} />

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${colors.bg} ${colors.text} text-xs font-bold uppercase tracking-wider mb-6 border border-white/5`}>
                                        <activeService.icon size={14} />
                                        {activeService.label}
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                        {activeService.title}
                                    </h3>
                                    <p className="text-lg text-gray-400 mb-10 leading-relaxed font-medium">
                                        {activeService.description}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {activeService.features.map((feature, idx) => (
                                            <div key={idx} className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                                                        <LucideCheckCircle2 size={20} />
                                                    </div>
                                                    <span className={`text-xs font-black ${colors.bg} ${colors.accent} px-2 py-1 rounded-md`}>
                                                        {feature.metric}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        <p className="text-sm text-gray-500 italic">
                                            * Incluido en todos los planes Professional
                                        </p>
                                        <PremiumButton size="md" variant="primary" onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}>
                                            VER DEMO EN VIVO
                                        </PremiumButton>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
