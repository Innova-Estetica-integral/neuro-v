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
    Volume2,
    Globe,
    CreditCard,
    FileText,
    Mail,
    Instagram,
    LineChart,
    Sparkles,
    Smartphone,
    Package,
    Camera,
    ClipboardCheck,
    Star
} from 'lucide-react';
import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';

const DonnaFloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [userContext, setUserContext] = useState<{ businessType?: string, mainChallenge?: string }>({});
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Preload local sound for maximum reliability
        audioRef.current = new Audio('/water-drop.mp3');
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.load();
        }
    }, []);

    // Initial Welcome Flow
    const [chat, setChat] = useState<{ role: 'donna', content: string, options?: string[] }>({
        role: 'donna',
        content: "Hola, soy Donna. Felicidades por dar el paso de simplificar tu consulta. Me voy a encargar de configurar tu NeuroV. ¿Empezamos?",
        options: ['SÍ, EMPEZAR']
    });

    const speak = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            const bestVoice = voices.find(v =>
                (v.name.includes('Google') || v.name.includes('Natural')) &&
                (v.lang.startsWith('es')) &&
                (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer') || v.name.toLowerCase().includes('femenin') || v.name.includes('Helena'))
            ) || voices.find(v =>
                v.lang.includes('es-CL') &&
                (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer') || v.name.includes('Helena'))
            ) || voices.find(v => v.lang.startsWith('es') && (v.name.toLowerCase().includes('female') || v.name.includes('Helena') || v.name.includes('Maria')));

            if (bestVoice) utterance.voice = bestVoice;

            utterance.lang = 'es-CL';
            utterance.rate = 1.0;
            utterance.pitch = 1.05;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    useEffect(() => {
        if (isOpen && step === 0) {
            speak(chat.content);
            const timer = setTimeout(() => {
                handleSend('start');
            }, 16000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, step, chat.content]);

    const handleSend = (presetMsg?: string) => {
        const userMsg = presetMsg || input;
        if (!userMsg.trim()) return;
        setInput('');

        setIsThinking(true);
        const thinkingDelay = 1200 + (Math.random() * 800);

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
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    whileTap={{ scale: 0.85 }}
                    initial={false}
                    animate={{
                        opacity: isOpen ? 0 : 1,
                        scale: isOpen ? 0.8 : 1,
                        pointerEvents: isOpen ? 'none' : 'auto',
                        y: isOpen ? 20 : 0
                    }}
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(err => console.error('Audio play failed:', err));
                        }
                    }}
                    className="relative w-[63px] h-[63px] sm:w-[70px] sm:h-[70px] bg-slate-900/5 backdrop-blur-[2px] rounded-2xl flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(0,242,255,0.3),inset_0_-8px_15px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] z-[200] overflow-hidden group"
                    style={{
                        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, rgba(15, 23, 42, 0.08) 100%)'
                    }}
                >
                    {/* Physical Liquid Splash (8 Particles + Core Flash) */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                            whileTap={{
                                x: Math.cos(i * 45 * Math.PI / 180) * 80,
                                y: Math.sin(i * 45 * Math.PI / 180) * 80,
                                scale: [0, 1.2, 0.5],
                                opacity: [0, 0.8, 0],
                                transition: { duration: 0.6, ease: "easeOut" }
                            }}
                            className="absolute w-2 h-2 bg-cyan-400/40 rounded-full blur-[1px] pointer-events-none"
                        />
                    ))}

                    {/* Liquid Core Flash */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{
                            scale: [0.5, 3],
                            opacity: [0, 0.6, 0],
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="absolute inset-0 bg-white/40 rounded-full blur-2xl pointer-events-none"
                    />

                    {/* Surface Tension Ripple */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{
                            scale: [0.8, 2],
                            opacity: [0, 0.3, 0],
                            transition: { duration: 0.5, ease: "easeOut" }
                        }}
                        className="absolute inset-0 border-[2px] border-cyan-300/30 rounded-2xl pointer-events-none"
                    />
                    <div className="relative z-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            animate={{
                                y: [0, -1, 0],
                                scale: [1.02, 1.05, 1.02]
                            }}
                            whileTap={{
                                scale: [1, 1.4, 0.9],
                                transition: { duration: 0.3 }
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative flex items-center justify-center text-cyan-400"
                        >
                            <BrainCircuit
                                className="w-[41px] h-[41px] sm:w-[47px] sm:h-[47px] text-[#00f2ff] stroke-[1.1] opacity-95 mix-blend-screen"
                            />
                        </motion.div>
                    </div>

                    {/* High-Clarity Glass Sheen (Enhanced) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-white/[0.12] to-transparent pointer-events-none z-10" />

                    {/* Specular Highlights (Intensified) */}
                    <div className="absolute top-2 left-3 w-1/3 h-1/4 bg-white/60 blur-[1px] rounded-full rotate-[-45deg] pointer-events-none z-20" />
                    <div className="absolute bottom-2 right-4 w-1/4 h-1/6 bg-cyan-400/30 blur-[2px] rounded-full pointer-events-none z-20" />

                    {/* Scanning Light (Reflejo Fugaz) */}
                    <motion.div
                        animate={{ x: [-200, 250] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[30deg] z-10"
                    />

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
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-[11px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-transparent py-[35px]'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
                    <div className="relative w-10 h-10 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(0,242,255,0.3),inset_0_-8px_15px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] overflow-hidden"
                        style={{
                            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, rgba(15, 23, 42, 0.002) 100%)'
                        }}
                    >
                        {/* High-Clarity Glass Sheen (Enhanced) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-white/[0.12] to-transparent pointer-events-none z-10" />

                        {/* Specular Highlights (Intensified) */}
                        <div className="absolute top-1 left-1 w-1/3 h-1/4 bg-white/60 blur-[1px] rounded-full rotate-[-45deg] pointer-events-none z-20" />
                        <div className="absolute bottom-1 right-1 w-1/4 h-1/6 bg-cyan-400/30 blur-[2px] rounded-full pointer-events-none z-20" />

                        <BrainCircuit className="relative z-30 w-6 h-6 text-[#00f2ff] stroke-[1.1] opacity-95 mix-blend-screen" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter text-gray-900">NeuroV <span className="text-indigo-600">V7.5</span></span>
                </div>

                <div className="hidden lg:flex items-center gap-10 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                    <a href="#inteligencia" className="hover:text-gray-900 transition-colors">Presencia</a>
                    <a href="#secretaria" className="hover:text-gray-900 transition-colors">Secretaria IA</a>
                    <a href="#operacion" className="hover:text-gray-900 transition-colors">Operación 360</a>
                    <a href="#marketing" className="hover:text-gray-900 transition-colors">Marketing</a>
                    <a href="#seguridad" className="hover:text-gray-900 transition-colors">Seguridad</a>
                    <a href="#precios" className="hover:text-gray-900 transition-colors">Planes</a>
                    <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95">
                        COMENZAR AHORA <ArrowRight size={14} />
                    </button>
                </div>

                <button className="lg:hidden p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                            <a href="#inteligencia" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Presencia</a>
                            <a href="#secretaria" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Secretaria IA</a>
                            <a href="#operacion" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Operación 360</a>
                            <a href="#marketing" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Marketing</a>
                            <a href="#seguridad" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Seguridad</a>
                            <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2">
                                COMENZAR AHORA <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default function SolutionsTest() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Nav />

            {/* Cinematic Hero */}
            <section className="relative pt-[110px] pb-10 sm:pt-64 sm:pb-32 px-6 sm:px-12 bg-white overflow-hidden flex items-center">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-5 gap-10 sm:gap-16 items-center">
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-10">
                                <ShieldCheck size={12} /> ECOSISTEMA 360° NEUROV
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 sm:mb-10 tracking-tightest text-black break-words">
                                Profesionaliza tu Clínica.<br />
                                <span className="text-indigo-600 italic">Libérate de la carga operativa.</span>
                            </h1>
                            <p className="text-base sm:text-[20px] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-8 sm:mb-12 text-gray-400">
                                <strong>NeuroV es el cerebro administrativo que tu consulta necesita:</strong> Boletas SII, Imposiciones, Pagos y Agenda. <br className="hidden lg:block" />
                                Tu asistente <strong>Donna</strong> gestiona WhatsApp, notificaciones y la venta de bonos <strong>Fonasa/Isapre</strong> vía I-Med, mientras tú te enfocas en tu talento.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-4">
                                <button className="px-10 py-5 sm:px-12 sm:py-7 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl">
                                    COMENZAR AHORA
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 relative hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 1 }}
                                className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border-[8px] border-white"
                            >
                                <img
                                    src="/solutions/premium_doctor.png"
                                    alt="Professional NeuroV Doctor"
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

            {/* TRUST BAR: Marquee Infinito */}
            <div className="py-12 bg-gray-50/50 border-y border-gray-100 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-8 text-center flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gray-200 hidden sm:block" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Trusted Industry Partners</span>
                    <div className="h-[1px] w-12 bg-gray-200 hidden sm:block" />
                </div>

                <div className="flex overflow-hidden relative group">
                    {/* Gradient Fades */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50/50 to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50/50 to-transparent z-10" />

                    <motion.div
                        key={`marquee-trust`}
                        initial={{ x: 0 }}
                        animate={{ x: "-33.33%" }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                        className="flex items-center gap-16 sm:gap-32 pr-16 sm:pr-32 whitespace-nowrap min-w-max"
                    >
                        {[
                            { name: 'SII Boletas', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'I-Med Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK HR', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS Chile', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ].concat([
                            { name: 'SII Boletas', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'I-Med Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK HR', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS Chile', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ]).concat([
                            { name: 'SII Boletas', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'I-Med Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK HR', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS Chile', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ]).map((logo, index) => (
                            <img
                                key={index}
                                src={logo.src}
                                alt={logo.name}
                                className={`${['HL7 FHIR', 'BUK', 'Fonasa', 'CENS'].includes(logo.name) ? 'h-12 sm:h-16' : 'h-8 sm:h-10'} w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* SECCIÓN 1: Presencia Digital de Alto Impacto */}
            <section id="inteligencia" className="py-20 sm:py-32 px-6 sm:px-12 bg-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-7xl mx-auto relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 sm:space-y-8 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Target size={14} className="animate-pulse" /> MÁQUINA DE CONVERSIÓN ELITE
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest leading-[0.9] text-gray-900">
                                Tu Web no es un sitio, <br />
                                <span className="text-indigo-600">es tu Fuerza de Ventas 24/7.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Transformamos tu presencia digital en un Funnel de Ventas de alto impacto, optimizado por un ecosistema de marketing especializado que rastrea cada intención de compra. Donna analiza el comportamiento psicológico del paciente para convertir tráfico en citas de alto valor de forma automática.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    { t: "Funnel Psicográfico", d: "Capturamos el perfil comercial del paciente desde el primer contacto." },
                                    { t: "Marketing de Élite", d: "Ads sincronizados quirúrgicamente con tu agenda y rentabilidad." },
                                    { t: "Donna Sales Engine", d: "Un sistema de cierre automático que no deja escapar ni un solo lead." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition-colors group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 group-hover:scale-150 transition-transform" />
                                        <div>
                                            <div className="text-sm font-black text-gray-900 uppercase tracking-wider">{item.t}</div>
                                            <div className="text-sm text-gray-400 font-medium">{item.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
                            <div className="relative z-10 p-4 bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-t border-indigo-50">
                                <img
                                    src="/solutions/web_showcase_mockup.png"
                                    alt="High Impact Web Mockup"
                                    className="rounded-[3rem] w-full"
                                />
                                {/* Floating Element */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-indigo-50 z-20 hidden lg:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-gray-400">Efectividad Funnel</div>
                                            <div className="text-xl font-black text-emerald-600">+315%</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: Secretaria IA - Libertad de Respuesta */}
            <section id="secretaria" className="py-20 sm:py-32 px-6 sm:px-12 bg-gray-900 text-white overflow-hidden relative rounded-[3rem] sm:rounded-[6rem] mx-4 sm:mx-10 my-10">
                <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay">
                    <img
                        src="/solutions/executive_donna.png"
                        alt="Background decor"
                        className="w-full h-full object-cover grayscale opacity-20"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-black/80" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative lg:order-1"
                        >
                            <div className="absolute inset-0 bg-indigo-500/30 blur-[120px] rounded-full" />
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img
                                    src="/solutions/donna_whatsapp_ui.png"
                                    alt="Donna AI WhatsApp Experience"
                                    className="relative z-10 max-w-[280px] sm:max-w-[420px] mx-auto rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,242,255,0.2)] border-2 sm:border-4 border-white/10"
                                />
                            </motion.div>

                            {/* AI Pulse Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-cyan-500/10 rounded-full animate-ping pointer-events-none" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 sm:space-y-10 lg:order-2 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#B9FF66] text-[10px] font-black uppercase tracking-[0.2em]">
                                <BrainCircuit size={14} className="animate-spin-slow" /> OPERATIVIDAD ESPECIALIZADA 24/7
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest leading-[0.9]">
                                Donna al WhatsApp. <br />
                                Tú <span className="text-[#B9FF66]">operas.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-indigo-100/60 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Donna toma el control de tu WhatsApp y mensajería de alta demanda con eficiencia quirúrgica. Mientras ella cualifica, agenda y cierra citas de forma autónoma, tú te enfocas en entregar la máxima excelencia médica en tu consulta sin interrupciones.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 sm:p-8 bg-white/5 hover:bg-white/10 transition-colors rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 backdrop-blur-sm group">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B9FF66]/10 rounded-2xl flex items-center justify-center text-[#B9FF66] mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-black text-[#B9FF66] mb-1 sm:mb-2 tracking-tighter">0.3s</div>
                                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 leading-tight">Tiempo de Reacción</div>
                                </div>
                                <div className="p-6 sm:p-8 bg-white/5 hover:bg-white/10 transition-colors rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 backdrop-blur-sm group">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1 sm:mb-2 tracking-tighter">98.4%</div>
                                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 leading-tight">Precisión de Agenda</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: Operación 360 - El Cerebro de tu Clínica */}
            <section id="operacion" className="py-20 sm:py-32 px-6 sm:px-12 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 sm:mb-24 space-y-4">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.5em] block">SISTEMA NERVIOSO CENTRAL</span>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest leading-[0.9] text-gray-900 italic">Control Total. <br /><span className="text-indigo-600">Cero Estrés.</span></h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid gap-6"
                        >
                            {[
                                {
                                    icon: CreditCard,
                                    title: "Finanzas & Impuestos",
                                    desc: "Cobra, emite boletas SII y gestiona imposiciones de tu equipo (Vía BUK) sin estrés administrativo.",
                                    stats: "SII / BUK Native"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Venta de Bonos I-Med",
                                    desc: "Integración total para que tus pacientes compren bonos Fonasa e Isapre directamente en el flujo de agendamiento.",
                                    stats: "I-Med Ready"
                                },
                                {
                                    icon: LineChart,
                                    title: "Marketing & Funnels",
                                    desc: "Ads Nutrition y funnels inteligentes que auto-optimizan tu inversión para maximizar el ROI de tu clínica.",
                                    stats: "Growth Tech"
                                }
                            ].map((feature, i) => (
                                <div key={i} className="group p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] bg-gray-50 border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shrink-0">
                                        <feature.icon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2 sm:mb-1 gap-2 sm:gap-0">
                                            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">{feature.title}</h4>
                                            <span className="text-[7px] sm:text-[8px] font-black text-indigo-400 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">{feature.stats}</span>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative lg:h-[700px] flex items-center mt-10 lg:mt-0"
                        >
                            <div className="absolute inset-0 bg-indigo-600/5 blur-[150px] rounded-full" />
                            <div className="relative z-10 bg-gray-900 rounded-[2.5rem] sm:rounded-[4rem] p-2 shadow-3xl overflow-hidden border-[6px] sm:border-[12px] border-white ring-1 ring-gray-100 mx-auto">
                                <img
                                    src="/solutions/financial_radar.png"
                                    alt="Admin Ops Dashboard"
                                    className="w-full h-full object-cover rounded-[2rem] sm:rounded-[3.2rem] opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

                                {/* Overlay Metadata */}
                                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20">
                                    <div className="text-[8px] sm:text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Status Sistema</div>
                                    <div className="text-lg sm:text-2xl font-black text-white">ÓPTIMO 360°</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Specialized Deep-Dive Links */}
            <div className="py-20 px-6 sm:px-12 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        href="/solutions-test/legal"
                        className="group relative flex items-center justify-between p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full sm:max-w-md transition-all border border-white bg-white hover:shadow-2xl hover:border-indigo-100"
                    >
                        <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full overflow-hidden">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 leading-tight truncate">Confianza Legal</h4>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter truncate">Leyes Chilenas & Zero-Trust</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </motion.a>

                    <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        href="/solutions-test/legal"
                        className="group relative flex items-center justify-between p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full sm:max-w-md transition-all border border-white bg-white shadow-lg hover:shadow-2xl hover:border-indigo-100"
                    >
                        <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full overflow-hidden">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <TrendingUp size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 leading-tight truncate">Marketing & Growth</h4>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter truncate">War Room & Ads Nutrition</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </motion.a>
                </div>
            </div>

            {/* SECCIÓN SEGURIDAD Y CUMPLIMIENTO LEGAL */}
            <section id="seguridad" className="py-20 sm:py-32 px-6 sm:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Lock size={14} /> BLINDAJE LEGAL & SEGURIDAD MÉDICA
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest leading-tight text-gray-900">
                                Tu información, <br /><span className="text-emerald-600">protegida por ley.</span>
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                                En NeuroV, la seguridad no es una opción, es nuestra infraestructura base. Cumplimos rigurosamente con el marco legal chileno y estándares internacionales de salud.
                            </p>

                            <div className="grid gap-6">
                                {[
                                    { title: "Ley 20.584 (Derechos y Deberes)", desc: "Privacidad absoluta en Fichas Clínicas y consentimiento informado digital.", law: "Minsal Chile" },
                                    { title: "Ley 19.628 (Protección de Datos)", desc: "Encriptación de grado bancario para toda la información personal de tus pacientes.", law: "Data Privacy" },
                                    { title: "Estándar HL7 FHIR & CENS", desc: "Interoperabilidad certificada para el intercambio seguro de datos clínicos.", law: "Health Tech Standard" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, scale: 1.01 }}
                                        className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all group cursor-default"
                                    >
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{item.title}</h4>
                                                <span className="text-[7px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase">{item.law}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
                            <div className="relative z-10 p-1 bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-emerald-50">
                                <div className="bg-gray-900 rounded-[3.2rem] p-10 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8">
                                        <Lock size={120} className="text-[#B9FF66] opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-16 h-1 bg-[#B9FF66] rounded-full" />
                                        <h3 className="text-3xl font-black text-white italic">Zero-Trust <br />Architecture</h3>
                                        <p className="text-indigo-100/40 text-sm font-medium leading-relaxed max-w-[240px]">
                                            Nadie entra sin ser invitado. Fragmentamos y encriptamos cada dato para que solo tú y tu equipo autorizado tengan acceso.
                                        </p>
                                        <div className="pt-8 flex flex-wrap gap-2">
                                            {['AES-256', 'SSL/TLS', 'ISO 27001 Ready', 'Backup Horario'].map((tag, t) => (
                                                <span key={t} className="text-[8px] font-black text-[#B9FF66] border border-[#B9FF66]/20 px-3 py-1 rounded-full uppercase tracking-widest">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ECOSYSTEM SECTION - Integrations (Explicit I-Med and Buk) */}
            <section className="pt-12 pb-0 sm:py-32 px-4 sm:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-2 lg:gap-20 items-center">
                        <div className="text-center lg:text-left">
                            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3 sm:mb-6 block">INTEROPERABILIDAD AVANZADA</span>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest leading-tight mb-6 sm:mb-8 text-gray-900 [text-wrap:balance]">
                                Toda tu clínica sincronizada con <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">I-Med & Buk</span>
                            </h2>
                            <p className="text-gray-500 text-sm sm:text-lg leading-relaxed font-medium mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0">
                                NeuroV centraliza la inteligencia de tu clínica integrándose con los pilares del mercado chileno. Gestiona bonos **Fonasa e Isapre vía I-Med** de forma automática y delega la administración de personas y finanzas a **Buk**.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                                {[
                                    'I-Med (Fonasa/Isapre)',
                                    'Buk (HR & Finanzas)',
                                    'WhatsApp API',
                                    'SII Boletas',
                                    'Meta & Google Ads'
                                ].map((brand, bidx) => (
                                    <div key={bidx} className="px-3 py-1.5 rounded-full bg-indigo-50/50 text-indigo-600 font-black text-[8px] uppercase tracking-wider border border-indigo-100 whitespace-nowrap shrink-0">
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative overflow-visible">
                            <div className="aspect-square bg-white flex items-center justify-center relative">
                                <style>{`
                                    .orbit-container { --orbit-radius: 110px; }
                                    @media (min-width: 640px) {
                                        .orbit-container { --orbit-radius: 200px; }
                                    }
                                `}</style>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                    className="relative w-full h-full max-w-[340px] max-h-[340px] sm:max-w-[600px] sm:max-h-[600px] orbit-container flex items-center justify-center"
                                >

                                    {/* Single Subtle Orbit Path - Rotating with the unit */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] border border-gray-100 rounded-full" />

                                    {/* Central Node: NeuroV Brain - Gray base with Cyan activity on hover */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                        <BrainCircuit
                                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 opacity-30 hover:text-cyan-500 hover:opacity-100 transition-all duration-500 cursor-pointer stroke-[1.5px]"
                                        />
                                    </div>

                                    {/* Orbiting Logotypes (Static Group Rotation) */}
                                    {[
                                        { angle: 0, logo: '/assets/logotipos/imed.png' },
                                        { angle: 51.4, logo: '/assets/logotipos/LOGO-BUK.png' },
                                        { angle: 102.8, logo: '/assets/logotipos/sii.png' },
                                        { angle: 154.2, logo: '/assets/logotipos/Google_Ads_logo.svg.png' },
                                        { angle: 205.6, logo: '/assets/logotipos/meta ADS.png' },
                                        { angle: 257, logo: '/assets/logotipos/whatsapp API.png' },
                                        { angle: 308.4, logo: '/assets/logotipos/Google_Gemini.png' }
                                    ].map((orb, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute top-1/2 left-1/2"
                                            style={{
                                                transform: `rotate(${orb.angle}deg) translateY(calc(-1 * var(--orbit-radius)))`
                                            }}
                                        >
                                            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                                <img
                                                    src={orb.logo}
                                                    alt="Integración"
                                                    className={`${orb.logo.includes('Google_Ads') ? 'w-8 h-8 sm:w-14 sm:h-14' :
                                                        orb.logo.includes('meta') ? 'w-20 h-20 sm:w-48 sm:h-48' :
                                                            orb.logo.includes('BUK') ? 'w-16 h-16 sm:w-32 sm:h-32' :
                                                                orb.logo.includes('Google_Gemini') ? 'w-16 h-16 sm:w-32 sm:h-32' :
                                                                    orb.logo.includes('whatsapp') ? 'w-24 h-24 sm:w-56 sm:h-56' :
                                                                        orb.logo.includes('sii') ? 'w-8 h-8 sm:w-12 sm:h-12' :
                                                                            'w-12 h-12 sm:w-24 sm:h-24'
                                                        } object-contain`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN ECOSSISTEMA: Solution Switcher (Inspired by Buk/Encuadrado) */}
            <section className="pt-12 pb-20 sm:py-32 px-4 sm:px-12 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 sm:mb-24">
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-2 sm:mb-4">ADAPTABILIDAD TOTAL</span>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight">Diseñado para cada <br />nivel de tu <span className="text-indigo-600 italic">operación.</span></h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 sm:gap-20">
                        <div className="lg:w-1/3 space-y-4">
                            {[
                                { id: 'independiente', title: 'Independientes', icon: Target, desc: 'Para el doctor que busca libertad total.' },
                                { id: 'centro', title: 'Centros Médicos', icon: Users, desc: 'Gestión de múltiples salas y especialistas.' },
                                { id: 'franquicia', title: 'Franquicias', icon: ShieldCheck, desc: 'Control centralizado de múltiples sucursales.' }
                            ].map((tab, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 10, y: -2 }}
                                    className={`p-6 rounded-3xl border transition-all cursor-pointer group ${idx === 1 ? 'bg-white shadow-2xl border-indigo-100' : 'bg-transparent border-transparent hover:bg-white hover:shadow-xl'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${idx === 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 group-hover:text-indigo-600 shadow-sm'}`}>
                                            <tab.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg tracking-tight">{tab.title}</h4>
                                            <p className="text-xs text-gray-400 font-medium">{tab.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="lg:w-2/3">
                            <GlassCard className="h-full min-h-[400px] bg-white border-white p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl rounded-[3rem]">
                                <div className="relative z-10 grid sm:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-black tracking-tighter italic">Optimización de Centros <br />y Clínicas Estéticas.</h3>
                                        <ul className="space-y-4">
                                            {[
                                                { text: 'Gestión Multi-especialista con pago de imposiciones vía BUK.', highlight: 'BUK' },
                                                { text: 'Venta automática de Bonos Fonasa/Isapre vía I-Med.', highlight: 'I-Med' },
                                                { text: 'Reportes de rentabilidad y pago de impuestos centralizado.', highlight: 'Reportes' },
                                                { text: 'Ads Nutrition & Mail Marketing automatizado por Donna.', highlight: 'Donna' }
                                            ].map((li, k) => (
                                                <li key={k} className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-indigo-600 shrink-0 mt-1" size={16} />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 leading-tight sm:leading-relaxed">{li.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="relative hidden sm:block">
                                        <div className="absolute inset-0 bg-indigo-50/50 rounded-3xl overflow-hidden border border-indigo-100/30 shadow-inner">
                                            <div className="p-6 space-y-5">
                                                {/* Mockup Header */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Donna AI v2.4 Active</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-200" />)}
                                                    </div>
                                                </div>

                                                {/* Main Stat Card */}
                                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100/20 relative overflow-hidden group/m">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Ocupación Mensual</span>
                                                        <div className="text-2xl font-black text-indigo-950">94.2%</div>
                                                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                                            <TrendingUp size={10} /> +12.4% vs Mes Anterior
                                                        </div>
                                                    </div>
                                                    <div className="absolute right-0 bottom-0 p-2 opacity-5">
                                                        <BrainCircuit size={40} className="text-indigo-600" />
                                                    </div>
                                                </div>

                                                {/* Grid Stats */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100/20">
                                                        <Users size={14} className="text-indigo-600 mb-2" />
                                                        <div className="text-xs font-black text-indigo-950">1,240</div>
                                                        <div className="text-[8px] text-gray-400 font-bold uppercase">Nuevos Leads</div>
                                                    </div>
                                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100/20">
                                                        <Clock size={14} className="text-indigo-600 mb-2" />
                                                        <div className="text-xs font-black text-indigo-950">14:20hs</div>
                                                        <div className="text-[8px] text-gray-400 font-bold uppercase">Ahorro Diario</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>



            <section className="py-20 sm:py-48 px-4 sm:px-12 bg-[#0A0B14] text-white overflow-hidden relative">
                {/* Cyber Grid Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16 sm:mb-24 space-y-4">
                        <span className="text-[#B9FF66] font-black text-xs uppercase tracking-[0.6em] block">BENCHMARK DE ALTO RENDIMIENTO</span>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight italic">¿Por qué NeuroV?</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-4">
                        {[
                            { f: 'Despliegue Operativo', n: '48 Horas (Listo)', t: '2-4 Semanas', m: 'Indefinido', icon: Clock, desc: 'Velocidad de implementación garantizada.' },
                            { f: 'Seguridad & Normativa', n: 'Ley 20.584 / 19.628', t: 'Manual / Básico', m: 'Ninguna', icon: ShieldCheck, desc: 'Cumplimiento legal chileno al 100%.' },
                            { f: 'Gestión Contable / HR', n: 'SII & BUK Nativo', t: 'Manual / Básico', m: 'Contador Externo', icon: BrainCircuit, desc: 'Liberación de imprecisiones y multas.' },
                            { f: 'Salud Previsional', n: 'I-Med / Fonasa', t: 'Básica / Parcial', m: 'Ninguna', icon: ShieldCheck, desc: 'Venta de bonos integrada al flujo.' },
                            { f: 'Marketing & Ads', n: 'Funnels IA / Nutrition', t: 'Posteos Básicos', m: 'Referidos Manuales', icon: TrendingUp, desc: 'Agencia de élite integrada en Donna.' },
                            { f: 'Escalabilidad', n: 'Multi-sede Ready', t: 'Estático', m: 'Límite Físico', icon: BarChart, desc: 'Arquitectura diseñada para crecer.' }
                        ].map((row, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-[2.5rem] transition-all group-hover:bg-white/[0.05] group-hover:border-indigo-500/30 group-hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] group-hover:-translate-y-2" />
                                <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                                    <div className="flex-1 flex items-center gap-6 w-full">
                                        <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            <row.icon size={26} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-lg sm:text-xl font-black uppercase tracking-tighter text-white">{row.f}</div>
                                            <div className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">{row.desc}</div>
                                        </div>
                                    </div>
                                    <div className="flex-[2] grid grid-cols-3 gap-4 sm:gap-8 w-full border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
                                        <div className="text-center">
                                            <div className="text-[9px] text-gray-500 font-black uppercase mb-3 tracking-widest text-[#B9FF66]">NeuroV</div>
                                            <div className="text-sm sm:text-lg font-black text-white leading-tight">{row.n}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[9px] text-gray-500 font-black uppercase mb-3 tracking-widest">Tradicional</div>
                                            <div className="text-sm sm:text-lg font-bold text-gray-500 leading-tight">{row.t}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[9px] text-gray-500 font-black uppercase mb-3 tracking-widest">Manual</div>
                                            <div className="text-sm sm:text-lg font-bold text-gray-700 leading-tight">{row.m}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN GROWTH: El Motor de Crecimiento */}
            <section id="marketing" className="py-20 sm:py-24 px-4 sm:px-12 bg-[#F9FAFB] rounded-[2rem] sm:rounded-[4rem] mx-4 sm:mx-10 mb-20 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                        <div className="text-center lg:text-left">
                            <span className="text-indigo-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.3em]">MOTOR DE CRECIMIENTO</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-4 sm:mt-6 tracking-tightest leading-tight">Tu marca <br />en el radar 24/7.</h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium mt-6 sm:mt-8 leading-relaxed">
                                Sistema orquestado para que tu clínica esté siempre en la mente de tus pacientes.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-12 text-left">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                            <Mail size={18} />
                                        </div>
                                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest">Ads Nutrition & Mail</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed">Donna nutre tus campañas y automatiza newsletters psico-persuasivos.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                            <Zap size={18} />
                                        </div>
                                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest">Funnels Inteligentes</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed">Rellenado de espacios libres y cierre de ventas autónomo 24/7.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-gray-100">
                                <div className="p-4 sm:p-6 bg-indigo-50 rounded-2xl mb-4 sm:mb-6">
                                    <div className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Protocolo Médico</div>
                                    <div className="flex items-center gap-3">
                                        <Users className="text-indigo-600" size={20} />
                                        <div className="text-base sm:text-lg font-black text-gray-900 leading-tight">Dr. Castro, ficha lista.</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                        <span className="font-black text-[9px] uppercase tracking-widest text-gray-400">Notificación Doctor</span>
                                        <CheckCircle2 className="text-[#B9FF66]" size={16} />
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="font-black text-[9px] uppercase tracking-widest text-gray-400">Review Solicitada</span>
                                        <CheckCircle2 className="text-[#B9FF66]" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLANES DE LIBERTAD OPERATIVA */}
            <section id="precios" className="py-20 sm:py-24 px-6 sm:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12 sm:mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                        >
                            INVERSIÓN EN TU LIBERTAD
                        </motion.div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight mb-6 text-gray-900 italic">
                            Donna es tu <span className="text-indigo-600">Estructura Total.</span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                            Olvida contratar secretaria, contador o agencia. Donna asume todos los roles para que tú solo seas el Doctor.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Donna Esencial",
                                price: "$49.990",
                                period: "/mes",
                                roles: ["Secretaria 24/7 (WhatsApp)", "Boletas Honorarios SII", "Agenda I-Med (Fonasa)"],
                                focus: "Ideal para iniciar tu independencia operativa.",
                                color: "bg-gray-50",
                                textColor: "text-gray-900"
                            },
                            {
                                name: "Donna Profesional",
                                price: "$89.990",
                                period: "/mes",
                                roles: ["Administrador Global", "Impuestos & Contabilidad", "RRHH (Buk/Imposiciones)", "Venta Bonos Isapre"],
                                focus: "Libertad total. Donna gestiona toda tu clínica.",
                                popular: true,
                                color: "bg-gray-900",
                                textColor: "text-white"
                            },
                            {
                                name: "Donna Elite",
                                price: "$149.990",
                                period: "/mes",
                                roles: ["Agencia de Marketing IA", "Ads Nutrition (Meta/Google)", "Funnels de Conversión", "Flash Offer Engine"],
                                focus: "Crecimiento agresivo orquestado por IA.",
                                color: "bg-indigo-600",
                                textColor: "text-white"
                            }
                        ].map((plan, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -15, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                                className={`relative p-10 rounded-[3rem] ${plan.color} ${plan.textColor} border border-gray-100 overflow-hidden flex flex-col justify-between shadow-2xl transition-all`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-8 right-8 bg-[#B9FF66] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        Más Solicitado
                                    </div>
                                )}
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-black tracking-tightest">{plan.price}</span>
                                        <span className="text-sm opacity-60 font-medium">{plan.period}</span>
                                    </div>
                                    <p className="text-sm font-medium opacity-70 mb-8 leading-relaxed">
                                        {plan.focus}
                                    </p>
                                    <div className="space-y-4 mb-10">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Roles que asume Donna:</div>
                                        {plan.roles.map((role, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full ${plan.popular || plan.name === 'Donna Elite' ? 'bg-white/20' : 'bg-indigo-100'} flex items-center justify-center`}>
                                                    <CheckCircle2 size={12} className={plan.popular || plan.name === 'Donna Elite' ? 'text-[#B9FF66]' : 'text-indigo-600'} />
                                                </div>
                                                <span className="text-sm font-bold">{role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${plan.name === 'Donna Profesional' ? 'bg-[#B9FF66] text-black hover:bg-white' :
                                    plan.name === 'Donna Elite' ? 'bg-white text-indigo-600 hover:bg-[#B9FF66] hover:text-black' :
                                        'bg-indigo-600 text-white hover:bg-gray-900'
                                    }`}>
                                    ACTIVAR LIBERTAD
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PREMIUM ONBOARDING (MATCHING ENCUADRADO SUPPORT) */}
            <section className="py-20 sm:py-24 px-6 bg-[#F9FAFB] border-t border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/30 -skew-x-12 translate-x-32" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                    >
                        <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">IMPLEMENTACIÓN ELITE</span>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest mb-8 leading-none text-gray-900">No te dejamos solo. <br />NeuroV se entrega funcionando.</h2>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed mb-10 max-w-xl">
                            A diferencia de otros softwares donde tú haces todo, nosotros realizamos un <strong>Onboarding Ejecutivo</strong>. Dejamos tu pasarela de pagos, tu asistente Donna y toda tu agenda configurada en 48 horas.
                        </p>
                        <div className="space-y-6">
                            {[
                                "Asesoría Personalizada de Configuración",
                                "Migración de Datos de Pacientes incluida",
                                "Soporte Prioritario vía WhatsApp Concierge"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <div className="relative">
                        <GlassCard className="p-10 bg-white border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[4rem]">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
                                    NV
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Responsable de Éxito</p>
                                    <p className="font-black text-gray-900 text-lg tracking-tight">Protocolo de Implementación: Activo</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        <span>Progreso de Despliegue</span>
                                        <span className="text-indigo-600">85%</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                                    <p className="text-xs text-center font-black text-indigo-600 uppercase tracking-widest leading-relaxed">
                                        85% de las clínicas operan <br />en menos de 48 horas.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            <section id="agenda" className="py-20 sm:py-32 px-6 bg-[#0A0B14] relative overflow-hidden">
                {/* Cyber backgrounds */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 sm:space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B9FF66] font-black text-xs uppercase tracking-[0.5em] mb-8 block">CONSULTORÍA DE ALTO NIVEL</span>
                        <h2 className="text-4xl sm:text-7xl lg:text-8xl font-[1000] text-white mb-8 sm:mb-10 tracking-tightest leading-[0.9] italic">
                            Agenda tu Sesión <br />
                            <span className="text-indigo-500">de Crecimiento.</span>
                        </h2>
                        <p className="text-gray-400 text-xl md:text-2xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                            Nuestro equipo de consultores diseñará tu <span className="text-white font-bold">Arquitectura de Ingresos NeuroV</span> en 30 minutos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link href="/strategic-session">
                                <PremiumButton variant="primary" size="xl" className="px-16 py-8 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] group">
                                    RESERVAR EN GOOGLE CALENDAR <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </PremiumButton>
                            </Link>
                            <div className="flex flex-col items-center sm:items-start text-[10px] font-black uppercase tracking-widest text-gray-500 gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0B14] bg-gray-800" />
                                    ))}
                                </div>
                                <span>+50 sesiones esta semana</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Visual decoration */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#B9FF66]/5 blur-[120px] rounded-full" />
            </section>

            {/* Final CTA */}
            <section className="py-20 sm:py-48 px-4 sm:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-[#B9FF66] rounded-[3rem] sm:rounded-[6rem] p-10 sm:p-32 text-center text-gray-900 relative overflow-hidden group shadow-[0_100px_200px_-50px_rgba(185,255,102,0.4)]"
                    >
                        {/* Interactive Sparkles/Glow */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent_60%)]" />
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                        <div className="relative z-10 space-y-8 sm:space-y-10">
                            <h2 className="text-4xl sm:text-7xl lg:text-9xl font-[1000] mb-8 sm:mb-12 tracking-tightest leading-[0.9] italic">
                                Lo tienes todo. <br />Donna lo <span className="underline decoration-4 sm:decoration-8 decoration-white/30">opera.</span>
                            </h2>
                            <p className="text-2xl sm:text-3xl font-bold max-w-2xl mx-auto text-gray-800 opacity-80 mb-12">
                                Recupera 40 horas mensuales de gestión. <br />Sé el Doctor, Donna es tu estructura.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-8 sm:px-20 sm:py-10 bg-gray-900 text-white rounded-full font-black text-xs sm:text-base uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center gap-4 mx-auto"
                            >
                                ACTIVAR MI CLÍNICA DIGITAL <ArrowRight />
                            </motion.button>
                        </div>

                        {/* Floating Decoration */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-20 -right-20 w-64 h-64 border-[40px] border-white/10 rounded-full blur-2xl"
                        />
                    </motion.div>
                </div>
            </section>

            <DonnaFloatingAssistant />
        </div >
    );
}

