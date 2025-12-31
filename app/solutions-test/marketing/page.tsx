'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    Zap,
    ArrowRight,
    BrainCircuit,
    ChevronLeft,
    TrendingUp,
    BarChart3,
    Search,
    Share2,
    Users,
    MousePointer2,
    Menu,
    X,
    MessageCircle,
    Globe,
    Sparkles
} from 'lucide-react';

const MarketingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Header / Nav */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-[11px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-transparent py-[35px]'}`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/solutions-test'}>
                        <div className="relative w-10 h-10 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(0,242,255,0.3),inset_0_-8px_15px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] overflow-hidden"
                            style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, rgba(15, 23, 42, 0.002) 100%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-white/[0.12] to-transparent pointer-events-none z-10" />
                            <div className="absolute top-1 left-1 w-1/3 h-1/4 bg-white/60 blur-[1px] rounded-full rotate-[-45deg] pointer-events-none z-20" />
                            <div className="absolute bottom-1 right-1 w-1/4 h-1/6 bg-cyan-400/30 blur-[2px] rounded-full pointer-events-none z-20" />
                            <BrainCircuit className="relative z-30 w-6 h-6 text-[#00f2ff] stroke-[1.1] opacity-95 mix-blend-screen" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter text-gray-900">NeuroV <span className="text-indigo-600">GROWTH</span></span>
                    </div>

                    <div className="hidden lg:flex items-center gap-12 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                        <a href="/solutions-test" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                            <ChevronLeft size={14} /> VOLVER
                        </a>
                        <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95">
                            ESCALAR MI CLÍNICA <ArrowRight size={14} />
                        </button>
                    </div>

                    <button className="lg:hidden p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 px-6 sm:px-12 bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                            <Sparkles className="text-indigo-600" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Marketing & Autogestión de Audiencias</span>
                        </div>

                        <h1 className="text-6xl sm:text-9xl font-black text-gray-900 leading-[1] mb-8 tracking-tightest">
                            El Cuarto de <br />
                            <span className="text-indigo-600">Guerra de Donna.</span>
                        </h1>

                        <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            No solo gestionamos tu agenda; nutrimos tus campañas de Ads 24/7. Convertimos cada dólar invertido en pacientes calificados con precisión quirúrgica.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* War Room Visualizer */}
            <section className="py-24 px-6 sm:px-12 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <span className="text-[#B9FF66] font-black text-xs uppercase tracking-[0.4em] block">PROTOCOLOS DE ESCALADO</span>
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tightest leading-tight">Nutrición de Ads <br />Psicográfica.</h2>
                            <p className="text-indigo-100/60 text-lg leading-relaxed font-medium">
                                Donna intercepta a los prospectos en el momento exacto. Analiza el comportamiento de tus campañas en Meta y Google, inyectando datos de conversión real para que los algoritmos encuentren a tus pacientes ideales más rápido y barato.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { title: "Meta Precision", val: "+340%", sub: "ROAS Promedio" },
                                    { title: "Costo Lead", val: "-60%", sub: "Reducción de CAC" },
                                    { title: "Agendamiento", val: "88%", sub: "Tasa de Cierre" },
                                    { title: "Calificación", val: "Auto", sub: "Donna Filtra" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                        <div className="text-[#B9FF66] text-3xl font-black mb-1">{stat.val}</div>
                                        <div className="text-white font-black text-[10px] uppercase tracking-widest">{stat.title}</div>
                                        <div className="text-gray-500 text-[9px] font-bold uppercase mt-1">{stat.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-white shadow-2xl rounded-[3rem] overflow-hidden p-8 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-gray-400">Donna Marketing Engine v9.0</span>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: "Tráfico Ads", color: "bg-indigo-600", width: "w-full" },
                                            { label: "Leads Calificados", color: "bg-cyan-400", width: "w-[75%]" },
                                            { label: "Agendamientos", color: "bg-[#B9FF66]", width: "w-[45%]" },
                                            { label: "Ventas / Closes", color: "bg-gray-900", width: "w-[30%]" }
                                        ].map((bar, j) => (
                                            <div key={j} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-900">
                                                    <span>{bar.label}</span>
                                                    <ArrowRight size={12} className="opacity-30" />
                                                </div>
                                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: bar.width }}
                                                        className={`h-full ${bar.color}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-900 rounded-2xl flex items-center justify-between text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase">Próximo Paciente</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest">Procedimiento: Rinomodelación</div>
                                        </div>
                                    </div>
                                    <div className="text-[#B9FF66] font-black text-xs uppercase tracking-tighter">LISTO PARA AGENDAR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign Services */}
            <section className="py-24 px-6 sm:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] block mb-4">MÁXIMA EXPOSICIÓN</span>
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest leading-tight">Domina el mercado.</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Ads Search & Social",
                                desc: "Configuramos tus campañas en Google, Instagram y Facebook con pixeles de Donna integrados para máxima optimización."
                            },
                            {
                                icon: MousePointer2,
                                title: "Landings de Conversión",
                                desc: "Páginas diseñadas bajo la psicología de tus 4 avatares para garantizar que el tráfico no se pierda."
                            },
                            {
                                icon: MessageCircle,
                                title: "Lead Nutriton 24/7",
                                desc: "Donna contacta y recupera carritos abandonados de forma automática mediante WhatsApp Business API."
                            }
                        ].map((card, k) => (
                            <div key={k} className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100 group relative overflow-hidden transition-all hover:-translate-y-2">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-xl border border-indigo-50">
                                            <card.icon size={32} />
                                        </div>
                                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">{card.title}</h3>
                                        <p className="text-gray-500 font-medium leading-[1.6]">
                                            {card.desc}
                                        </p>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                                        Saber más <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto px-10 py-20 bg-indigo-600 rounded-[4rem] text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-900 opacity-50" />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest leading-tight">¿Listo para escalar sin <br />límites operativos?</h2>
                        <button className="bg-[#B9FF66] text-gray-900 px-12 py-6 rounded-full hover:scale-105 active:scale-95 transition-all font-black text-xl shadow-2xl flex items-center gap-3 mx-auto uppercase tracking-tighter">
                            AGENDAR PLAN DE CRECIMIENTO <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>© 2025 NeuroV Growth. Escalamos tu consulta.</span>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-900">Instagram</a>
                        <a href="#" className="hover:text-gray-900">LinkedIn</a>
                        <a href="#" className="hover:text-gray-900">Soporte</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketingPage;
