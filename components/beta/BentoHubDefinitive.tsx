'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    Smartphone,
    Calendar,
    FileText,
    BrainCircuit,
    Target,
    Plus,
    Star,
    BarChart,
    LucideIcon
} from 'lucide-react';

interface Pillar {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    subtitle: string;
    className?: string;
    tags?: string[];
}

const pillars: Pillar[] = [
    {
        id: 1,
        title: "Tu Web de Alto Impacto",
        subtitle: "Activo Digital #1",
        description: "Convertimos tu presencia en un imán de pacientes. Una infraestructura diseñada para capturar datos y alimentar tus Ads de Meta/Google.",
        icon: Globe,
        className: "lg:col-span-2 bg-gray-900 text-white",
        tags: ["Captura de Leads", "SEO Optimized"]
    },
    {
        id: 2,
        title: "Donna en WhatsApp",
        subtitle: "Cierre 24/7",
        description: "Donna toma el mando de tu WhatsApp comercial. No descansa, no olvida y siempre cierra tus sesiones 24/7.",
        icon: Smartphone,
        className: "bg-indigo-600 text-white shadow-xl shadow-indigo-200"
    },
    {
        id: 3,
        title: "Agenda Operativa",
        subtitle: "Sincronización total",
        description: "Sincronización total. Donna coordina tu tiempo, envía confirmaciones y bloquea citas con pagos previos.",
        icon: Calendar,
        className: "bg-white border-indigo-50"
    },
    {
        id: 4,
        title: "Pasarela & Boletas",
        subtitle: "Financiero",
        description: "Cobro automatizado y generación de boletas electrónicas (SII) en segundos. Transparencia fiscal total.",
        icon: FileText,
        className: "lg:col-span-2 bg-indigo-50/50 border-indigo-100"
    },
    {
        id: 5,
        title: "Ficha & Evolución Visual",
        subtitle: "Clínico",
        description: "Perfilado psicográfico previo y registro fotográfico profesional para comparativas de tratamiento (Antes/Después).",
        icon: BrainCircuit,
        className: "bg-white border-indigo-50"
    },
    {
        id: 6,
        title: "Stock Crítico",
        subtitle: "Suministros",
        description: "Gestión automatizada de insumos. Alertas inteligentes antes de que te quedes sin suministros estratégicos.",
        icon: Target,
        className: "bg-white border-indigo-50"
    },
    {
        id: 7,
        title: "Referral Engine V2",
        subtitle: "Growth",
        description: "Sistema de referidos inteligente que premia a tus pacientes más leales, multiplicando tu agenda de forma orgánica.",
        icon: Plus,
        className: "bg-indigo-900 text-white"
    },
    {
        id: 8,
        title: "Reputation Suite",
        subtitle: "Social Proof",
        description: "Gestión de reseñas y posicionamiento local automático para dominar tu zona geográfica.",
        icon: Star,
        className: "bg-white border-indigo-50"
    },
    {
        id: 9,
        title: "Analítica de Crecimiento",
        subtitle: "Inteligencia",
        description: "Datos reales de rentabilidad y retorno de inversión (ROI). Donna te dice qué campaña está llenando tu clínica.",
        icon: BarChart,
        className: "lg:col-span-2 bg-white border-indigo-100"
    }
];

export function BentoHubDefinitive() {
    return (
        <section className="py-24 sm:py-32 px-6 sm:px-12 bg-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-24">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] block mb-4 italic">Blueprint Maestro</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tightest leading-tight">
                        El Hub de Inteligencia 360°.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.id}
                            whileHover={{ y: -8 }}
                            className={`group relative rounded-[2.5rem] p-8 sm:p-10 border transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[340px] ${pillar.className || "bg-white border-gray-100"}`}
                        >
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg ${pillar.className?.includes('bg-white') ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white border border-white/20'
                                    }`}>
                                    <pillar.icon size={28} />
                                </div>
                                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${pillar.className?.includes('text-white') ? 'text-indigo-300' : 'text-indigo-500'
                                    }`}>
                                    {pillar.subtitle}
                                </div>
                                <h3 className="text-4xl font-black mb-4 tracking-tighter leading-tight uppercase italic">{pillar.title}</h3>
                                <p className={`text-sm font-medium leading-relaxed ${pillar.className?.includes('text-white') ? 'text-white/70' : 'text-gray-400'
                                    }`}>
                                    {pillar.description}
                                </p>
                            </div>

                            {pillar.tags && (
                                <div className="mt-8 flex gap-2">
                                    {pillar.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
