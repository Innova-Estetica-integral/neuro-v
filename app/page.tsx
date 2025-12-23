'use client';

import { motion } from 'framer-motion';
import {
    LucideZap,
    LucideBrainCircuit,
    LucideShieldCheck,
    LucideActivity,
    LucideTrendingUp,
    LucideChevronRight,
    LucideMessageSquare,
    LucideDatabase,
    LucideArrowRight
} from 'lucide-react';

export default function CorporateHomePage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LucideZap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            NEURO<span className="text-indigo-500">V</span>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded ml-2 align-top">V6</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Tecnología</a>
                        <a href="#integrations" className="hover:text-white transition-colors">Integraciones</a>
                        <a href="#compliance" className="hover:text-white transition-colors">Normativa</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="/demo"
                            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
                        >
                            Ver Demo <LucideChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
                            <LucideBrainCircuit className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-300 tracking-wider">REVENUE ENGINE PARA CLÍNICAS ESTÉTICAS</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                            Transforma tu Clínica en una <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                                Máquina de Ingresos Automática
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
                            No somos un software de agenda. Somos un motor de conversión psicográfico que maximiza el LTV del paciente usando inteligencia y estándares FHIR R4.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="/demo"
                                className="group w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95"
                            >
                                PROBAR DEMO <LucideArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="/clinic-alpha"
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
                            >
                                Ver Landing de Clínica
                            </a>
                        </div>
                    </motion.div>
                </section>

                {/* Video/Dashboard Preview Placeholder */}
                <section className="container mx-auto px-6 py-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[40px] border border-white/10 bg-white/5 p-4 backdrop-blur-3xl overflow-hidden group shadow-2xl"
                    >
                        <div className="aspect-video rounded-[32px] bg-[#0f172a] border border-white/5 overflow-hidden relative">
                            {/* UI Simulation */}
                            <div className="absolute inset-0 p-8 flex flex-col gap-6">
                                <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">admin.neurov.app / dashboard</span>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="h-24 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 p-4">
                                        <p className="text-[10px] text-indigo-300 font-bold mb-1">CONVERSIÓN</p>
                                        <p className="text-2xl font-black">74.2%</p>
                                    </div>
                                    <div className="h-24 bg-purple-500/10 rounded-2xl border border-purple-500/20 p-4">
                                        <p className="text-[10px] text-purple-300 font-bold mb-1">ABANDONED REC.</p>
                                        <p className="text-2xl font-black">+22.5%</p>
                                    </div>
                                    <div className="h-24 bg-blue-500/10 rounded-2xl border border-blue-500/20 p-4">
                                        <p className="text-[10px] text-blue-300 font-bold mb-1">ROAS</p>
                                        <p className="text-2xl font-black">4.8x</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                    <LucideActivity className="w-12 h-12 text-white/20 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Features */}
                <section id="features" className="container mx-auto px-6 py-32 grid md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                            <LucideBrainCircuit className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Perfilado Psicográfico</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Analizamos el comportamiento en tiempo real para clasificar a tu paciente en &lt;30 segundos. Adaptamos la oferta al instante.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                            <LucideShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Estándar FHIR R4</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Interoperabilidad total bajo normas internacionales de salud. Seguridad grado clínico para los datos de tus pacientes.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                            <LucideTrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Revenue Recovery</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Lleva el retargeting al siguiente nivel con automatizaciones de WhatsApp para carritos abandonados altamente persuasivas.
                        </p>
                    </div>
                </section>

                {/* Integrations */}
                <section id="integrations" className="bg-white/5 border-y border-white/5 py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-black mb-16 italic">Ecosistema Conectado</h2>
                        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40">
                            <div className="flex flex-col items-center gap-3">
                                <LucideMessageSquare className="w-12 h-12" />
                                <span className="text-sm font-bold">WhatsApp Business</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <LucideDatabase className="w-12 h-12" />
                                <span className="text-sm font-bold">HubSpot CRM</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <LucideZap className="w-12 h-12" />
                                <span className="text-sm font-bold">n8n Automation</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <LucideCreditCard className="w-12 h-12" />
                                <span className="text-sm font-bold">Mercado Pago / TBK</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-6 py-20 border-t border-white/5 text-center text-gray-500 text-sm">
                    <p>© 2025 NEURO-VENTAS V6. Todos los derechos reservados.</p>
                    <p className="mt-2 text-gray-600 font-mono tracking-widest uppercase">Tecnología Revenue Engine de Alto Impulso</p>
                </footer>
            </main>
        </div>
    );
}
