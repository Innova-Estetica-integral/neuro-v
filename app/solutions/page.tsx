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
    Calendar,
    Minus,
    Volume2
} from 'lucide-react';

const DonnaFloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [userContext, setUserContext] = useState<{ businessType?: string, mainChallenge?: string }>({});
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Initial Welcome Flow
    const [chat, setChat] = useState<{ role: 'donna', content: string, options?: string[] }>({
        role: 'donna',
        content: "Hola, soy Donna, la asistente virtual de Neuro-V.\n\nMi objetivo es simple: liberarte de la gestión operativa y el marketing, para que tú te enfoques en crecer, mientras tu negocio avanza en piloto automático. Diagnosticaré y crearé una estrategia para escalar tu negocio.",
        options: []
    });

    const speak = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // Unified Flow Control: Speech + Auto-transition
    useEffect(() => {
        if (isOpen && step === 0) {
            speak(chat.content);
            const timer = setTimeout(() => {
                handleSend('start');
            }, 16000); // Adjusted for the new message length
            return () => clearTimeout(timer);
        }
    }, [isOpen, step, chat.content]);

    const handleSend = (presetMsg?: string) => {
        const userMsg = presetMsg || input;
        if (!userMsg.trim()) return;
        setInput('');

        setIsThinking(true);
        const thinkingDelay = 1200 + (Math.random() * 800); // Dynamic realistic delay

        setTimeout(() => {
            setIsThinking(false);
            let nextResponse = '';
            let nextOptions: string[] = [];

            if (step === 0) {
                nextResponse = "¿Cuál es tu área principal de especialización?";
                nextOptions = ['Estética/Medicina', 'Dental/Ortodoncia', 'Salud Mental/Psicología', 'Kinesiología/Fisio', 'Otro Sector'];
                setStep(1);
            } else if (step === 1) {
                setUserContext(prev => ({ ...prev, businessType: userMsg }));
                nextResponse = `Entendido. Perfilando el sector ${userMsg}. Para optimizar tu autonomía, necesito saber: ¿Dónde detectas hoy la mayor fuga de ingresos o tiempo?`;
                nextOptions = ['Agendas Vacías', 'Carga Administrativa', 'Costo de Marketing Alto', 'Seguimiento de Pacientes'];
                setStep(2);
            } else if (step === 2) {
                setUserContext(prev => ({ ...prev, mainChallenge: userMsg }));
                if (userMsg.includes('Agendas') || userMsg.includes('Marketing') || userMsg.includes('No-Shows')) {
                    nextResponse = "Activaré el motor 'Flash Offer' y 'Payment Gating' para cubrir huecos detectados contactando pacientes de alto valor de forma autónoma. ¿Deseas ver una demostración técnica de este protocolo?";
                } else {
                    nextResponse = "NeuroV centraliza la inteligencia operativa 24/7. Puedo reducir tu carga administrativa en un 80% mediante asistentes IA de élite. ¿Te gustaría conocer el plan estratégico?";
                }
                nextOptions = [' VER PROTOCOLO', 'Hablar con Consultor', 'Finalizar Diagnóstico'];
                setStep(3);
            }

            if (nextResponse) {
                setChat({ role: 'donna', content: nextResponse, options: nextOptions });
                speak(nextResponse);
            }
        }, thinkingDelay);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                            className="fixed inset-0 bg-black/10 z-[200]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 m-auto z-[201] h-[640px] bg-white/20 backdrop-blur-md rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden flex flex-col pt-10 px-8"
                            style={{ width: '340px', minWidth: '340px', maxWidth: '340px' }}
                        >
                            <div className="absolute inset-x-0 top-0 h-[500px] flex items-center justify-center pointer-events-none opacity-40">
                                <div className="w-[300px] h-[400px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent blur-[80px] rounded-full" />
                            </div>

                            <div className="relative z-10 flex justify-center mb-6">
                                <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-[0.5em]">Executive AI // NeuroV V7.5</span>
                            </div>

                            <div className="flex items-center gap-3 relative shrink-0 z-10 px-1">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full border-2 border-white/50 p-0.5 relative z-10 overflow-hidden shadow-sm">
                                        <div className="w-full h-full rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center overflow-hidden">
                                            <BrainCircuit className="text-indigo-600 w-5 h-5 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-20" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-gray-900 font-black text-sm tracking-tighter leading-tight">DONNA - ASISTENTE VIRTUAL</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-indigo-600" />
                                        <p className="text-indigo-600 text-[8px] font-black uppercase tracking-[0.1em] opacity-80">ACTIVA</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center px-4 relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-8">
                                            <div className="space-y-4 max-w-sm">
                                                <motion.h3
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1.5, delay: 0.2 }}
                                                    className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed tracking-tight whitespace-pre-wrap"
                                                >
                                                    {chat.content}
                                                </motion.h3>
                                            </div>

                                            {chat.options && chat.options.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1, duration: 0.8 }}
                                                    className="w-full max-w-[280px] grid grid-cols-1 gap-2 pt-2"
                                                >
                                                    {chat.options.map((opt, j) => (
                                                        <button
                                                            key={j}
                                                            onClick={() => {
                                                                if (opt === ' VER PROTOCOLO') window.location.href = '/demo?qualified=true';
                                                                else handleSend(opt);
                                                            }}
                                                            className="w-full px-6 py-4 bg-white/60 hover:bg-white/90 border border-white/80 rounded-2xl text-indigo-600 text-xs font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-left flex justify-between"
                                                        >
                                                            {opt}
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {step > 0 && (
                                <div className="p-6 pt-0 relative z-10">
                                    <div className="relative group flex gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Responde aquí..."
                                            className="flex-1 bg-white/40 border border-white/60 rounded-2xl px-6 py-4 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                        />
                                        <button
                                            onClick={() => handleSend()}
                                            className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                                className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="fixed bottom-10 right-10 z-[200]">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={false}
                    animate={{
                        opacity: isOpen ? 0 : 1,
                        scale: isOpen ? 0.8 : 1,
                        pointerEvents: isOpen ? 'none' : 'auto',
                        y: isOpen ? 20 : 0
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_45px_100px_-25px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_60px_rgba(0,242,255,0.35)] group overflow-hidden"
                    style={{
                        background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 60%, rgba(0,242,255,0.05) 100%)'
                    }}
                >
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
        </>
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
