'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Lock,
    ArrowRight,
    BrainCircuit,
    ChevronLeft,
    ShieldAlert,
    Database,
    Fingerprint,
    FileCheck,
    Scale,
    Menu,
    X,
    Cpu
} from 'lucide-react';

const LegalPage = () => {
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
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-[8.5px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-transparent py-[32.5px]'}`}>
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
                        <span className="text-xl font-black uppercase tracking-tighter text-gray-900">NeuroV <span className="text-indigo-600">LEGAL</span></span>
                    </div>

                    <div className="hidden lg:flex items-center gap-12 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                        <a href="/solutions-test" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                            <ChevronLeft size={14} /> VOLVER
                        </a>
                        <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95">
                            CONSULTORÍA LEGAL <ArrowRight size={14} />
                        </button>
                    </div>

                    <button className="lg:hidden p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 px-6 sm:px-12 bg-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.08),transparent_70%)]" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 backdrop-blur-md"
                    >
                        <ShieldCheck className="text-indigo-600" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Blindaje Clínico & Seguridad Zero-Trust</span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-8xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tightest">
                        Confianza Legal <br />
                        <span className="text-indigo-600">Sin Fisuras.</span>
                    </h1>

                    <p className="text-gray-500 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                        Cumplimiento total con la Ley 20.584 y estándares internacionales de ciberseguridad.
                        Protegemos tu consulta como si fuera un activo de defensa nacional.
                    </p>
                </div>
            </header>

            {/* Content Section: Zero-Trust */}
            <section className="py-24 px-6 sm:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] block mb-4">INFRAESTRUCTURA ZERO-TRUST</span>
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tightest leading-tight mb-8">Nadie entra sin ser <br />invitado.</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                                Aplicamos arquitectura <strong>Zero-Trust</strong>: un modelo de seguridad que no asume confianza, ni siquiera dentro de la red. Cada acceso es verificado, autenticado y cifrado de extremo a extremo (E2EE) bajo estándar HL7 FHIR.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Fingerprint, title: "Biometría & MFA", desc: "Autenticación multifactor para cada acceso administrativo." },
                                    { icon: Lock, title: "Cifrado AES-256", desc: "Datos clínicos en reposo y en tránsito con grado militar." },
                                    { icon: Database, title: "Soberanía de Datos", desc: "Backups diarios geolocalizados y cifrados." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <item.icon size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
                                            <p className="text-gray-400 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
                                        />
                                        <div className="absolute inset-8 border-2 border-indigo-500/40 rounded-full animate-pulse" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Cpu className="text-indigo-400" size={64} />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Security Node #042 Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chilean Laws Section */}
            <section className="py-24 px-6 sm:px-12 bg-gray-50 overflow-hidden relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest leading-tight">Marco Legal Chileno.</h2>
                        <p className="text-gray-500 text-xl font-medium mt-4">Estamos alineados con la normativa vigente en Chile.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Scale,
                                title: "Ley 20.584",
                                desc: "Derechos y deberes de los pacientes. Gestión estricta del consentimiento informado y la privacidad de la ficha clínica."
                            },
                            {
                                icon: FileCheck,
                                title: "Ley 19.628",
                                desc: "Protección de la vida privada. Tratamiento de datos personales sensibles con los más altos estándares éticos."
                            },
                            {
                                icon: ShieldAlert,
                                title: "Normas MINSAL",
                                desc: "Sincronización con las directrices de cibersalud y almacenamiento de registros electrónicos del Ministerio de Salud."
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 group hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100">
                                    <card.icon size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">{card.title}</h3>
                                <p className="text-gray-500 font-medium leading-[1.6]">
                                    {card.desc}
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                                    Ver especificaciones <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase opacity-50">© 2025 NeuroV Systems. Todos los derechos reservados.</span>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        <a href="#" className="hover:text-indigo-800 transition-colors underline-offset-4 hover:underline">Políticas de Privacidad</a>
                        <a href="#" className="hover:text-indigo-800 transition-colors underline-offset-4 hover:underline">SLA Service Level Agreement</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LegalPage;
