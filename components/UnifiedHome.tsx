'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    MessageSquare,
    Zap,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Target,
    BarChart,
    ArrowRight,
    Menu,
    Users,
    Plus,
    Lock,
    Search,
    BrainCircuit,
    Calendar,
    Globe,
    FileText,
    Mail,
    Sparkles,
    Smartphone,
    Volume2,
    Star,
    X
} from 'lucide-react';
import Link from 'next/link';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';

export function UnifiedHome() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Cinematic Hero */}
            <section className="relative pt-32 pb-16 sm:pt-60 sm:pb-40 px-6 sm:px-12 bg-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=3840"
                        alt="NeuroV Clinic"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white" />
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-5 gap-10 sm:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-3 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-10">
                                <ShieldCheck size={12} /> ECOSISTEMA 360° NEUROV
                            </div>
                            <h1 className="text-4xl sm:text-7xl lg:text-9xl font-black text-gray-900 leading-[0.95] tracking-tightest mb-8 sm:mb-10">
                                No es software. <br />
                                <span className="text-indigo-600 text-5xl sm:text-8xl lg:text-[100px]">Es tu clínica digital.</span>
                            </h1>
                            <p className="text-lg sm:text-2xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10 sm:mb-12">
                                La suite de inteligencia de ingresos más robusta del mercado. Automatiza tu BANT, asegura pre-pagos y recupera pacientes con IA.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                                <Link href="/demo?qualified=true">
                                    <PremiumButton variant="primary" size="lg" className="px-12 py-7 rounded-full text-xs uppercase tracking-widest shadow-xl">
                                        VER CLÍNICA EN VIVO
                                    </PremiumButton>
                                </Link>
                                <Link href="#portfolio">
                                    <button className="px-10 py-5 sm:px-12 sm:py-7 bg-white border border-gray-200 text-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                        Explorar Portafolio
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-2 relative hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 1 }}
                                className="relative rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border-[8px] border-white"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800"
                                    alt="Executive Health"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Estado Actual</div>
                                    <div className="text-3xl font-black">94% ROI PROMEDIO</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO HUB */}
            <section id="portfolio" className="py-20 sm:py-32 px-4 sm:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 sm:mb-24">
                        <span className="text-indigo-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.4em] block mb-4">SUITE EJECUTIVA</span>
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest">El Portafolio 360°.</h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* 1. Activo Web */}
                        <PortfolioCard
                            title="Web de Alto Impacto"
                            subtitle="Activo Digital #1"
                            desc="Infraestructura diseñada para capturar datos y alimentar Ads de Meta/Google, reduciendo costos de adquisición."
                            icon={<Globe className="text-indigo-400" size={24} />}
                            className="lg:col-span-2 bg-[#0A0B14] text-white"
                            tags={['Atribución Full', 'Ads Optimizer']}
                        />

                        {/* 2. Donna WhatsApp */}
                        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                                    <Smartphone className="text-indigo-600" size={28} />
                                </div>
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">DONNA IA</h3>
                                <p className="text-indigo-100/70 font-medium">Asistente 24/7 que califica BANT, agenda y cierra citas por WhatsApp de forma autónoma.</p>
                            </div>
                            <div className="mt-8 space-y-2 relative z-10">
                                <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp Business API</span>
                                    <CheckCircle2 size={14} className="text-[#B9FF66]" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Suite Operativa */}
                        <PortfolioCard
                            title="Agenda Inteligente"
                            subtitle="Sincronización"
                            desc="Sincronización total, confirmaciones automáticas y pre-pagos integrados para eliminar el No-Show."
                            icon={<Calendar size={28} />}
                        />

                        {/* 4. Staff & Multi-Clinic (NUEVO) */}
                        <PortfolioCard
                            title="Staff & Center Hub"
                            subtitle="Equipo"
                            desc="Gestión multi-especialista y multi-sucursal. Control de salas, comisiones e indicadores de productividad por cada miembro del equipo."
                            icon={<Users size={28} />}
                            className="lg:col-span-2 bg-indigo-50/50 border-indigo-100"
                        />

                        {/* 5. Flash Offer Engine (NUEVO) */}
                        <PortfolioCard
                            title="Flash Offer Engine"
                            subtitle="Monetización"
                            desc="Donna detecta huecos en la agenda y envía ofertas automatizadas a pacientes inactivos por WhatsApp para monetizar cada hora disponible."
                            icon={<Zap size={28} />}
                            className="lg:col-span-2 bg-[#B9FF66] text-gray-900 border-[#B9FF66] shadow-[0_20px_40px_rgba(185,255,102,0.2)]"
                        />

                        {/* 6. Finanzas Blindadas */}
                        <PortfolioCard
                            title="Pagos & Boletas"
                            subtitle="Fintech"
                            desc="Pasarela de pagos Transbank/Webpay y generación automática de boletas electrónicas."
                            icon={<FileText size={28} />}
                        />

                        {/* 7. Reputation Bot (NUEVO) */}
                        <PortfolioCard
                            title="Reputation Suite"
                            subtitle="Social Proof"
                            desc="Donna solicita reseñas de Google automáticamente tras cada sesión, disparando tu visibilidad local."
                            icon={<Star size={28} />}
                            className="bg-gray-900 text-white border-white/10"
                        />

                        {/* 8. Ficha Médica */}
                        <PortfolioCard
                            title="Ficha Psico-Clínica"
                            subtitle="Estrategia"
                            desc="Perfilado psicográfico previo. Donna analiza el comportamiento del paciente antes de entrar al box."
                            icon={<BrainCircuit size={28} />}
                        />

                        {/* 9. BI Insights (NUEVO) */}
                        <PortfolioCard
                            title="LTV & BI Dashboard"
                            subtitle="Inteligencia"
                            desc="Descubre el valor real de cada paciente. Análisis de retención, rentabilidad por servicio y CAC."
                            icon={<BarChart size={28} />}
                            className="bg-[#F9FAFB]"
                        />

                        {/* 10. Referidos */}
                        <PortfolioCard
                            title="Referral Engine"
                            subtitle="Growth"
                            desc="Multiplica tus pacientes VIP mediante un sistema de recomendaciones inteligentes y recompensas."
                            icon={<Plus size={28} />}
                        />

                        {/* 11. Evolución Visual */}
                        <PortfolioCard
                            title="Evolución Visual"
                            subtitle="Resultados"
                            desc="Registro clínico fotográfico seguro y comparativas antes/después automáticas."
                            icon={<Smartphone size={28} />}
                        />

                        {/* 12. Stock Crítico */}
                        <PortfolioCard
                            title="Inventario Alpha"
                            subtitle="Suministros"
                            desc="Alertas inteligentes para insumos críticos. Donna proyecta el desabastecimiento según agenda."
                            icon={<Target size={28} />}
                        />
                    </div>
                </div>
            </section>


            {/* PREMIUM ONBOARDING (MATCHING ENCUADRADO SUPPORT) */}
            <section className="py-24 px-6 bg-[#F9FAFB] border-t border-gray-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">IMPLEMENTACIÓN ELITE</span>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tightest mb-8 leading-none">No te dejamos solo. <br />NeuroV se entrega funcionando.</h2>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed mb-10">
                            A diferencia de otros softwares donde tú haces todo, nosotros realizamos un <strong>Onboarding Ejecutivo</strong>. Dejamos tu pasarela de pagos, tu asistente Donna y toda tu agenda configurada en 48 horas.
                        </p>
                        <div className="space-y-4">
                            <SupportItem text="Asesoría Personalizada de Configuración" />
                            <SupportItem text="Migración de Datos de Pacientes incluida" />
                            <SupportItem text="Soporte Prioritario vía WhatsApp Concierge" />
                        </div>
                    </div>
                    <div className="relative">
                        <GlassCard className="p-8 bg-white border-white shadow-2xl rounded-[3rem]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-lg">NV</div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Responsable de Éxito</p>
                                    <p className="font-bold">Protocolo de Implementación: Activo</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-[85%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                </div>
                                <p className="text-xs text-center font-black text-indigo-600 uppercase tracking-widest">85% DE LAS CLÍNICAS OPERAN EN 48H</p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* SECCIÓN SESIÓN ESTRATÉGICA */}
            <section id="agenda" className="py-24 px-6 bg-[#0A0B14] relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-[#B9FF66] font-black text-xs uppercase tracking-[0.4em] mb-8 block">ESTRATEGIA B2B</span>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-12 tracking-tightest">Agenda tu Sesión de Crecimiento.</h2>
                    <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">Nuestro equipo de consultores diseñará tu arquitectura de ingresos NeuroV en 30 minutos.</p>

                    <Link href="/strategic-session">
                        <PremiumButton variant="primary" size="lg" className="px-16 py-8 rounded-full text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
                            RESERVAR EN GOOGLE CALENDAR
                        </PremiumButton>
                    </Link>
                </div>
                {/* Visual decoration */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 blur-[150px] rounded-full" />
            </section>
        </div>
    );
}

function PortfolioCard({ title, subtitle, desc, icon, className = "bg-white border-gray-100", tags = [] }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative rounded-[3rem] p-10 border overflow-hidden flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-2xl transition-all duration-500 ${className}`}
        >
            <div className="relative z-10">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg">
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">{subtitle}</div>
                <h4 className="text-2xl font-black mb-4 tracking-tighter leading-tight">{title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed opacity-80">{desc}</p>
            </div>

            {(tags.length > 0) && (
                <div className="relative z-10 mt-8 flex gap-2">
                    {tags.map((tag: any) => (
                        <div key={tag} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[8px] font-black uppercase tracking-widest">{tag}</div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black uppercase tracking-widest">Ver Detalles</span>
                <ArrowRight size={16} />
            </div>
        </motion.div>
    );
}

function SupportItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <CheckCircle2 size={14} />
            </div>
            <span className="text-sm font-bold text-gray-700">{text}</span>
        </div>
    );
}
