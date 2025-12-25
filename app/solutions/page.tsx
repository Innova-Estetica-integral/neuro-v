'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    MessageSquare,
    Zap,
    ChevronRight,
    TrendingUp,
    Brain,
    ShieldCheck,
    Target,
    BarChart,
    ArrowRight,
    Menu,
    Users,
    Send,
    Bot,
    X,
    Plus,
    Lock,
    Search,
    BrainCircuit,
    Clock,
    Calendar
} from 'lucide-react';

const DonnaFloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [chat, setChat] = useState<{ role: 'donna' | 'user' | 'system', content: string, type?: 'status' | 'alert' }[]>([
        { role: 'donna', content: 'Protocolo de Inicio: Ejecutando diagnóstico de infraestructura... Hola, soy Donna, tu Directora de Operaciones. He detectado 3 puntos críticos de intervención para maximizar tu rentabilidad hoy.', type: 'status' }
    ]);
    const [input, setInput] = useState('');

    // Executive Data Simulation
    const [executiveData] = useState({
        roi: '+12.4%',
        metaAds: 'Optimizado',
        agendaGaps: 3,
        ltv: '$2,450'
    });

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (isOpen && step === 0 && chat.length === 1) {
            setTimeout(() => speak(chat[0].content), 500);
        }
    }, [isOpen]);

    const handleSend = (presetMsg?: string) => {
        const userMsg = presetMsg || input;
        if (!userMsg.trim()) return;

        setChat(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        setTimeout(() => {
            const lowerMsg = userMsg.toLowerCase();
            let response = '';
            let type: 'status' | 'alert' | undefined = undefined;

            // Executive Intent Engine
            if (lowerMsg.includes('lanzar') || lowerMsg.includes('flash') || lowerMsg.includes('ofrecer')) {
                response = `Ejecutando Protocolo Flash Offer. Interviniendo base de datos para cubrir los ${executiveData.agendaGaps} espacios vacíos detectados. Prioridad: Segmento Platinum (${executiveData.ltv}). ¿Confirmas sincronización con Meta API para optimizar el CPA?`;
                type = 'status';
            } else if (lowerMsg.includes('sync') || lowerMsg.includes('sincronizar') || lowerMsg.includes('meta')) {
                response = `Sincronización con Meta API en curso. Enviando datos de conversión offline para retroalimentar el algoritmo. Estatus: ${executiveData.metaAds}. Esperamos una reducción del 15% en CPA en las próximas 48 horas.`;
                type = 'status';
            } else if (lowerMsg.includes('agenda') || lowerMsg.includes('lunes') || lowerMsg.includes('hueco') || lowerMsg.includes('turno')) {
                response = `Análisis de Agenda: He detectado ${executiveData.agendaGaps} brechas críticas esta semana. Mi recomendación es activar el re-agendamiento automatizado para pacientes con alta tasa de cancelación. ¿Deseas activar este módulo?`;
            } else if (lowerMsg.includes('roi') || lowerMsg.includes('dinero') || lowerMsg.includes('rentabilidad') || lowerMsg.includes('costo')) {
                response = `Reporte Financiero: Tu ROI actual es de ${executiveData.roi}. Estamos operando con una eficiencia superior al promedio del sector. He detectado una fuga de $200 USD/mes en leads no contactados en menos de 5 min. ¿Intervengo?`;
                type = 'alert';
            } else if (lowerMsg.includes('paciente') || lowerMsg.includes('vip') || lowerMsg.includes('platinum') || lowerMsg.includes('ltv')) {
                response = `Seguridad de Cartera: Tu segmento Platinum tiene un LTV promedio de ${executiveData.ltv}. He blindado estas cuentas con un protocolo de atención prioritaria 24/7. El sistema de lealtad está operando al 100% de efectividad.`;
            } else if (lowerMsg.includes('quien') || lowerMsg.includes('donna') || lowerMsg.includes('nombre') || lowerMsg.includes('hola')) {
                response = `Hola. Soy Donna, tu Directora de Operaciones. Mi arquitectura está diseñada para la soberanía administrativa de tu clínica. Estoy monitoreando tus métricas en tiempo real. ¿En qué área necesitas mi intervención?`;
            } else {
                response = 'Orden reconocida bajo Protocolo General. Mi análisis de Meta Ads indica que podemos segmentar mejor los anuncios usando el perfilado psicográfico acumulado. ¿Deseas que prepare un reporte de ahorro proyectado?';
            }

            setChat(prev => [...prev, { role: 'donna', content: response, type }]);
            speak(response);
            setStep(prev => prev + 1);
        }, 1200);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[200]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-28 right-0 w-[380px] sm:w-[450px] bg-white rounded-[3rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden"
                    >
                        {/* Executive Header */}
                        <div className="bg-gray-950 p-8 flex items-center gap-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className={`w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(0,242,255,0.3)]' : ''}`}>
                                <BrainCircuit className="text-[#00f2ff] w-8 h-8 drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xs uppercase tracking-widest">Donna Executive <span className="text-indigo-500 ml-1">V7.5</span></h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                                    <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">Soberanía OPS Activada</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                                className="ml-auto p-3 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Executive Dashboard Card (Real-time Intervention Data) */}
                        <div className="px-8 pt-8 pb-4 bg-gray-50/50">
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 grid grid-cols-3 gap-4">
                                <div className="text-center border-r border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">ROI Mensual</p>
                                    <p className="text-sm font-black text-emerald-600">{executiveData.roi}</p>
                                </div>
                                <div className="text-center border-r border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Agenda Gaps</p>
                                    <p className="text-sm font-black text-amber-500">{executiveData.agendaGaps}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Meta Ads</p>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase">ÓPTIMO</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] overflow-y-auto p-8 pt-4 space-y-6 bg-gray-50/50 scroll-smooth">
                            {chat.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-[13px] font-medium leading-[1.6] ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : msg.type === 'status'
                                            ? 'bg-gray-900 text-white rounded-tl-none border-l-4 border-indigo-500'
                                            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.role === 'donna' && <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Protocolo Director</span>}
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isSpeaking && (
                                <div className="flex gap-1.5 items-end justify-center py-4">
                                    {[0.1, 0.4, 0.2, 0.6, 0.3, 0.5, 0.2].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [8, 30, 8] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                                            className="w-1 bg-indigo-500/30 rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Executive Action Protocols */}
                        <div className="px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => handleSend("Lanzar Flash Offer p/ Agenda")}
                                className="whitespace-nowrap px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all"
                            >
                                <Zap size={10} className="inline mr-1" /> Protocolo Flash Offer
                            </button>
                            <button
                                onClick={() => handleSend("Sincronizar Meta Ads")}
                                className="whitespace-nowrap px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all"
                            >
                                <TrendingUp size={10} className="inline mr-1" /> Sync Meta API
                            </button>
                        </div>

                        <div className="p-8 pt-2 bg-white border-t border-gray-50 flex gap-4">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Orden de intervención..."
                                className="flex-1 bg-gray-50/80 border-none rounded-2xl px-6 py-4 text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-300"
                            />
                            <button
                                onClick={() => handleSend()}
                                className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                            >
                                <Send size={22} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_45px_100px_-25px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_60px_rgba(0,242,255,0.35)] group overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 60%, rgba(0,242,255,0.05) 100%)'
                }}
            >
                {/* Primary Pure Shimmer (Slow Sweep) */}
                <motion.div
                    animate={{ x: [-150, 250] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[30deg]"
                />

                {/* Secondary Cyber-Cyan Glow Reflection (Fast Sweep) */}
                <motion.div
                    animate={{ x: [-200, 250] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent -skew-x-[30deg]"
                />

                {/* Cyber-Cyan Neural Icon (Immersive Translucency) */}
                <div className="relative z-10 flex flex-col items-center opacity-60">
                    <BrainCircuit
                        className="w-10 h-10 stroke-[1.1] text-[#00f2ff] drop-shadow-[0_0_12px_rgba(0,242,255,0.8)]"
                    />
                </div>
            </motion.button>
        </div>
    );
};

const Nav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-transparent py-10'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_8px_16px_rgba(0,242,255,0.1)]">
                        <BrainCircuit className="w-6 h-6 text-[#00f2ff] stroke-[1.2] drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter text-gray-900">NeuroV <span className="text-indigo-600">V7.5</span></span>
                </div>

                <div className="hidden lg:flex items-center gap-12 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                    <a href="#inteligencia" className="hover:text-gray-900 transition-colors">Inteligencia</a>
                    <a href="#marketing" className="hover:text-gray-900 transition-colors">Marketing</a>
                    <a href="#superioridad" className="hover:text-gray-900 transition-colors">Diferencial</a>
                    <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95">
                        SESIÓN ESTRATÉGICA <ArrowRight size={14} />
                    </button>
                </div>

                <button className="lg:hidden p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed inset-y-0 right-0 w-[85%] bg-white/10 backdrop-blur-xl z-[110] p-8 flex flex-col gap-6 font-bold text-[11px] uppercase tracking-[0.25em] text-left shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] border-l border-white/20"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-[9px] font-black text-gray-300 tracking-[0.3em] uppercase">Executive Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 border border-gray-100 rounded-lg"><X size={20} /></button>
                        </div>

                        <div className="flex flex-col gap-8">
                            <a href="#inteligencia" className="flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                                <span>Inteligencia</span>
                                <ChevronRight size={14} className="text-gray-300" />
                            </a>
                            <a href="#marketing" className="flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                                <span>Marketing</span>
                                <ChevronRight size={14} className="text-gray-300" />
                            </a>
                            <a href="#superioridad" className="flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                                <span>Diferencial</span>
                                <ChevronRight size={14} className="text-gray-300" />
                            </a>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-indigo-400 mb-2 tracking-widest uppercase">Estatus Donna</p>
                                <p className="text-gray-600 normal-case font-medium leading-relaxed italic">"Directora, la agenda de mañana está al 94%."</p>
                            </div>
                            <button className="w-full bg-indigo-600/10 backdrop-blur-xl border border-indigo-200 text-indigo-700 py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all text-[10px] tracking-[0.2em] relative overflow-hidden group flex items-center justify-center gap-2">
                                <span className="relative z-10">AGENDA AUDITORÍA</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default function SolutionsV5() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Nav />

            {/* Cinematic Hero */}
            <section className="relative pt-48 pb-20 sm:pt-60 sm:pb-40 px-6 sm:px-12 bg-[#F9FAFB]">
                {/* Visual Background Element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-5 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-3"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                                <ShieldCheck size={12} /> ESTÁNDAR EJECUTIVO NEUROV
                            </div>
                            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-gray-900 leading-[0.9] tracking-tightest mb-10">
                                Tú operas. <br />
                                <span className="text-indigo-600">Donna gestiona.</span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium mb-12">
                                El fin de la carga administrativa. Donna toma el mando de tu agenda, marketing y finanzas para que tú te enfoques en la excelencia clínica.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <button className="px-12 py-7 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] hover:translate-y-[-4px] active:translate-y-0 relative overflow-hidden group">
                                    <span className="relative z-10">Transformar mi Clínica</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </button>
                                <button className="px-12 py-7 bg-white border border-gray-200 text-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:border-indigo-600 transition-all">
                                    Ver Demo en Vivo
                                </button>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-2 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 1 }}
                                className="relative rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border-[8px] border-white"
                            >
                                <img
                                    src="/solutions/executive_donna.png"
                                    alt="Executive Donna"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Estado Actual</div>
                                    <div className="text-3xl font-black">94% ROI</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seccion 1: Marketing Inteligente */}
            <section id="marketing" className="py-32 sm:py-48 px-6 sm:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative rounded-[3.5rem] overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="/solutions/financial_radar.png"
                                    alt="Financial Radar ROI"
                                    className="w-full"
                                />
                                <div className="absolute top-10 right-10 p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="text-emerald-500 w-4 h-4" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase">Detectado</span>
                                    </div>
                                    <div className="text-xl font-black text-gray-900">Brecha de Agenda</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Lanzando Flash Offer...</div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                                <Zap size={12} /> MARKETING AUTÓNOMO
                            </div>
                            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                                Donna vende <br />mientras tú operas.
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12">
                                El marketing tradicional es pasivo. Donna es activa. Ella analiza las brechas financieras de tu agenda y ejecuta campañas de retención y venta directa de forma autónoma.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                                        <Search size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1">Radar de Ocupación</h4>
                                        <p className="text-gray-500 font-medium">Detecta lunes vacíos y los llena con pacientes VIP de forma proactiva.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1">Conversión Adaptativa</h4>
                                        <p className="text-gray-500 font-medium">Donna cierra ventas usando el perfil psicológico del paciente en segundos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seccion 2: Datos Inteligentes (Perfilado) */}
            <section id="inteligencia" className="py-32 sm:py-48 px-6 sm:px-12 bg-[#0A0B10] text-white rounded-[4rem] mx-4 sm:mx-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                            <Brain size={12} /> DATA INTELLIGENCE
                        </div>
                        <h2 className="text-4xl sm:text-7xl font-black leading-[1] mb-8 tracking-tighter">
                            Entiende a tus pacientes <br />mejor que nadie.
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="space-y-12">
                                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all">
                                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                                        <Users className="text-indigo-400" /> Perfilado Psicográfico
                                    </h3>
                                    <p className="text-white/50 text-lg leading-relaxed font-medium">
                                        Donna clasifica a cada lead como <span className="text-white">Analítico</span> o <span className="text-white">Impulsivo</span>. Adapta los argumentos de venta para maximizar la conversión en WhatsApp.
                                    </p>
                                </div>
                                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all">
                                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                                        <Lock className="text-emerald-400" /> Tracking de LTV & Lealtad
                                    </h3>
                                    <p className="text-white/50 text-lg leading-relaxed font-medium">
                                        Identifica a tus pacientes <span className="text-emerald-400">Platinum</span> al instante. Donna protege a los clientes que generan el 80% de tus ingresos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src="/solutions/loyalty_tiers.png"
                                    alt="Loyalty Tiers AI"
                                    className="w-full rounded-[4rem] shadow-[0_0_80px_rgba(79,70,229,0.3)]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            </section>

            {/* Seccion 3: Superioridad del Mercado */}
            <section id="superioridad" className="py-32 sm:py-48 px-6 sm:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">POR QUÉ SOMOS MEJORES</span>
                        <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mt-6 tracking-tightest">La diferencia ejecutiva.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 opacity-80">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                                <Clock className="text-gray-400" />
                            </div>
                            <h4 className="text-2xl font-black mb-4 italic text-gray-400 line-through">Agendas Pasivas</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">Solo guardan turnos. TÚ tienes que hacer el marketing, las confirmaciones y el cobro manual.</p>
                        </div>

                        <div className="p-12 rounded-[3.5rem] bg-gray-900 text-white md:scale-110 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Zap size={100} />
                            </div>
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-8">
                                <Zap className="text-white" />
                            </div>
                            <h4 className="text-2xl font-black mb-4">NeuroV Ejecutivo</h4>
                            <p className="text-white/70 font-medium leading-relaxed">Un motor de ventas que gestiona la clínica por ti. Donna es proactiva: ella llena la agenda, no espera a que se llene.</p>
                        </div>

                        <div className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 opacity-80">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                                <Users className="text-gray-400" />
                            </div>
                            <h4 className="text-2xl font-black mb-4 italic text-gray-400 line-through">Secretarias WA</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">Costes fijos altos, errores humanos y horario limitado. Donna nunca duerme y nunca olvida un cierre.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#B9FF66] rounded-[5rem] p-16 sm:p-32 text-center text-gray-900 relative overflow-hidden group">
                        <h2 className="text-5xl sm:text-8xl font-black mb-10 tracking-tightest leading-[0.9] relative z-10 transition-transform group-hover:scale-105 duration-700">
                            Tu libertad <br />está a un clic.
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-900/60 mb-16 max-w-2xl mx-auto font-black uppercase tracking-widest relative z-10">
                            Agenda tu auditoría ejecutiva gratuita.
                        </p>
                        <button className="px-16 py-8 bg-gray-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl relative z-10 group-hover:px-20">
                            SOLICITAR AUDITORÍA
                        </button>
                    </div>
                </div>
            </section>

            <DonnaFloatingAssistant />
            {/* Global Footer */}
            <footer className="py-32 px-10 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-7 h-7 text-indigo-600" />
                            <span className="text-3xl font-black uppercase tracking-tighter">NeuroV <span className="text-indigo-600">V7+</span></span>
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center md:text-left">
                            Estándar Ejecutivo para Clínicas de Élite en Latinoamérica.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-widest text-gray-500">
                        <a href="#" className="hover:text-indigo-600 transition-colors">SII CHILE</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">INTEGRACIÓN WEBPAY</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">PERFILADO IA</a>
                    </div>

                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        © 2025 NeuroV. Operando en Modo Ejecutivo.
                    </p>
                </div>
            </footer>
        </div>
    );
}
