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
    ClipboardCheck
} from 'lucide-react';

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
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-[8.5px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-transparent py-[32.5px]'}`}>
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
                    <a href="#inteligencia" className="hover:text-gray-900 transition-colors">Suite Hub</a>
                    <a href="/solutions-test/marketing" className="hover:text-gray-900 transition-colors">Marketing Center</a>
                    <a href="/solutions-test/legal" className="hover:text-gray-900 transition-colors">Legal Trust</a>
                    <a href="#operacion" className="hover:text-gray-900 transition-colors">Operación</a>
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
                            <a href="#inteligencia" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Suite Hub</a>
                            <a href="/solutions-test/marketing" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Marketing Center</a>
                            <a href="/solutions-test/legal" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Legal Trust</a>
                            <a href="#operacion" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Operación</a>
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
            <section className="relative pt-[130px] pb-0 sm:pt-64 sm:pb-32 px-12 sm:px-12 bg-white overflow-hidden flex items-center">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-5 gap-10 sm:gap-16 items-center">
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-10">
                                <ShieldCheck size={12} /> ECOSISTEMA 360° NEUROV
                            </div>
                            <h1 className="text-[32px] sm:text-[68px] lg:text-[92px] font-black leading-[1.1] mb-8 sm:mb-10 tracking-tightest text-black break-words">
                                Tu Clínica Digital.<br />
                                <span className="text-indigo-600">Lista para operar en 48 horas.</span>
                            </h1>
                            <p className="text-[16px] sm:text-[20px] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10 sm:mb-12 text-gray-400">
                                <strong>Centraliza y automatiza tu clínica:</strong> agenda, bonos, boletas y marketing. <br className="hidden lg:block" />
                                Tu asistente <strong>Donna</strong> gestiona la logística administrativa y previsional, mientras tú te enfocas en tus pacientes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-8">
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

            {/* TRUST BAR: Marquee Infinito */}
            <div className="py-7 bg-white border-y border-gray-100 overflow-hidden relative">

                <div className="flex overflow-hidden relative group">
                    {/* Gradient Fades */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                    <motion.div
                        key={`marquee-17`}
                        initial={{ x: 0 }}
                        animate={{ x: "-33.33%" }}
                        transition={{
                            duration: 25, // Slightly slower for better perception and less frame stress
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                        className="flex items-center gap-12 sm:gap-24 pr-12 sm:pr-24 whitespace-nowrap min-w-max"
                    >
                        {[
                            { name: 'SII', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ].concat([
                            { name: 'SII', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ]).concat([
                            { name: 'SII', src: '/assets/logotipos/sii.png' },
                            { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                            { name: 'Isapres', src: '/assets/logotipos/imed.png' },
                            { name: 'BUK', src: '/assets/logotipos/LOGO-BUK.png' },
                            { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                            { name: 'CENS', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' }
                        ]).map((logo, index) => (
                            <img
                                key={index}
                                src={logo.src}
                                alt={logo.name}
                                className={`${['HL7 FHIR', 'BUK', 'Fonasa', 'CENS'].includes(logo.name) ? 'h-16 sm:h-24' : logo.name === 'SII' ? 'h-10 sm:h-14' : 'h-8 sm:h-12'} w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700 object-contain`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* BENTO HUB: Los Pilares del Sistema */}
            <section id="inteligencia" className="pt-10 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-12 bg-white relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 sm:mb-24">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-indigo-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.4em] block mb-4"
                        >
                            ECOSISTEMA EJECUTIVO
                        </motion.span>
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest leading-tight px-4 break-words">La Suit 360° desglosada.</h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* 1. Activo Web: El Centro de Atracción */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-2 group relative rounded-[3rem] bg-[#0A0B14] p-10 text-white overflow-hidden border border-white/5 shadow-2xl flex flex-col justify-between min-h-[500px]"
                        >
                            {/* Carbon Fiber Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                            {/* Neural Background Effect */}
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
                                <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                                    <Globe className="text-indigo-400" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Activo Digital #1</span>
                                </div>
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">
                                    Tu Web de <br /><span className="text-indigo-400 text-glow-indigo">Alto Impacto</span>
                                </h3>
                                <p className="text-indigo-100/70 font-medium leading-[1.6]">
                                    Convertimos tu presencia en un imán de pacientes. Una infraestructura diseñada para capturar datos y alimentar tus Ads de Meta/Google, logrando una publicidad mucho más **económica** y precisa.
                                </p>
                            </div>

                            <div className="relative z-10 mt-10 flex flex-wrap gap-4 justify-center">
                                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp size={14} className="text-[#B9FF66]" /> Nutrición de Ads
                                </div>
                                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14} className="text-[#00f2ff]" /> Conversión 360
                                </div>
                            </div>

                            {/* Decorative Grid Line */}
                            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                        </motion.div>

                        {/* 2. Donna: La Secretaria Inteligente */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-gradient-to-br from-indigo-700 to-indigo-900 p-10 text-white overflow-hidden shadow-2xl flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                                    <Smartphone className="text-indigo-600" size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Donna en <br />WhatsApp</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9FF66]/20 border border-[#B9FF66]/30 mb-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B9FF66] animate-pulse" />
                                    <span className="text-[8px] font-black uppercase text-[#B9FF66] tracking-widest">Secretaria Ejecutiva</span>
                                </div>
                                <p className="text-indigo-100/70 font-medium leading-[1.6]">
                                    Donna toma el mando de tu WhatsApp comercial. No descansa, no olvida y siempre cierra con psicología adaptativa.
                                </p>
                            </div>

                            <div className="relative z-10 mt-10 space-y-3">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest">Atención 24/7</span>
                                    <CheckCircle2 size={16} className="text-[#B9FF66]" />
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest">Cierre BANT</span>
                                    <CheckCircle2 size={16} className="text-[#B9FF66]" />
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Suite Operativa */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-gray-50 p-10 border border-gray-100 overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-8">
                                    <Calendar size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Agenda Operativa</h4>
                                <p className="text-gray-500 font-medium leading-[1.6]">
                                    Sincronización total. Donna coordina tu tiempo, envía confirmaciones y bloquea citas con pagos previos.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200/60 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestión de Turnos</span>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </motion.div>

                        {/* 4. Finanzas Blindadas */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-gray-50 p-10 border border-gray-100 overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-8">
                                    <FileText size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Pasarela & Boletas</h4>
                                <p className="text-gray-500 font-medium leading-[1.6]">
                                    Cobro automatizado y generación de boletas electrónicas en segundos. Transparencia fiscal total.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200/60 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal & Fintech</span>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#00f2ff] transition-colors" />
                            </div>
                        </motion.div>

                        {/* 5. Ficha Psico-Clínica */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-[#F3F4F6] p-10 border border-gray-200 overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Users size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100">
                                    <ClipboardCheck size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Ficha <br />Psico-Clínica</h4>
                                <p className="text-gray-500 font-medium leading-[1.6]">
                                    Donna te informa sobre la psicología del paciente antes de que entre al box. Entra a la consulta con ventaja estratégica.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200/60 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                Inteligencia para el Doctor
                            </div>
                        </motion.div>

                        {/* 6. Stock Crítico */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-indigo-50 p-10 border border-indigo-100 overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Package size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100">
                                    <BarChart size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Stock Crítico</h4>
                                <p className="text-gray-400 font-medium leading-[1.6]">
                                    Gestión automatizada de insumos. Donna avisa cuando tus viales o jeringas llegan al stock mínimo.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200/60 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                Control Operativo Real
                            </div>
                        </motion.div>

                        {/* 7. Referral Engine */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-white p-10 border border-indigo-100 shadow-xl shadow-indigo-50 overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="absolute top-0 right-0 p-6 opacity-5 text-indigo-600">
                                <Users size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-100">
                                    <Sparkles size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Referral Engine</h4>
                                <p className="text-gray-500 font-medium leading-[1.6]">
                                    Tus pacientes Platinum ahora atraen más pacientes VIP. Sistema de referidos inteligente y recompensas premium.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200/60 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                Multiplicador de Ganancias
                            </div>
                        </motion.div>

                        {/* 8. Evolución (Antes/Después) */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="group relative rounded-[3rem] bg-gray-900 p-10 overflow-hidden flex flex-col justify-between text-white"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Camera size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-900 mb-8">
                                    <Camera size={28} />
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Evolución <br />(Antes/Después)</h4>
                                <p className="text-gray-400 font-medium leading-[1.6]">
                                    Registro fotográfico seguro y comparativas de resultados enviadas por Donna.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 text-[10px] font-black text-[#B9FF66] uppercase tracking-widest">
                                Evidencia Clínica
                            </div>
                        </motion.div>

                        {/* 9. Interoperabilidad (Fonasa/Isapres) */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-2 group relative rounded-[3rem] bg-gradient-to-r from-gray-900 to-indigo-950 p-10 text-white overflow-hidden border border-white/5 shadow-2xl flex flex-col sm:flex-row items-center gap-8"
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(0,242,255,0.1),transparent_70%)]" />
                            </div>

                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center relative">
                                <Globe className="text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]" size={48} />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                                    <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Roadmap 2024</span>
                                </div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Interoperabilidad <br />(Fonasa/Isapres)</h4>
                                <p className="text-indigo-100/60 font-medium leading-[1.6] max-w-xl">
                                    Roadmap de conexión directa con sistemas previsionales chilenos bajo estándar **HL7 FHIR**. Transparencia y agilidad total en la bonificación.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Deep-Dive Specialized Links */}
                    <div className="mt-20 flex flex-col sm:flex-row gap-6 justify-center">
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            href="/solutions-test/legal"
                            className="group relative flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[2.5rem] w-full sm:max-w-md transition-all hover:border-indigo-500/30 overflow-hidden shadow-sm hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-tight">Confianza Legal</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Leyes Chilenas & Zero-Trust</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all relative z-10" />
                        </motion.a>

                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            href="/solutions-test/marketing"
                            className="group relative flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[2.5rem] w-full sm:max-w-md transition-all hover:border-indigo-500/30 overflow-hidden shadow-sm hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-tight">Marketing & Growth</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">War Room & Ads Nutrition</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all relative z-10" />
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* SECCIÓN B2B: El Activo que Escala */}
            <section className="py-20 sm:py-32 px-4 sm:px-12 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 sm:mb-24">
                        <span className="text-indigo-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.4em] block mb-4">SEGMENTOS B2B</span>
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tightest leading-tight">Tu plataforma no es un gasto, <br />es un activo que escala.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Clínicas Independientes', desc: 'Profesionales que buscan autonomía total y delegar la logística administrativa.', icon: Target },
                            { title: 'Franquicias & Cadenas', desc: 'Sistemas de gestión multi-sede con reportes consolidados y control de calidad centralizado.', icon: ShieldCheck },
                            { title: 'Centros Med-Estéticos', desc: 'Automatización de stock crítico y referral engine para maximizar el LTV del paciente.', icon: Zap }
                        ].map((item, idx) => (
                            <div key={idx} className="p-10 rounded-[3rem] bg-white border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-2xl group">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h4 className="text-xl font-black mb-4 tracking-tighter">{item.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TABLA COMPARATIVA */}
            <section className="py-20 sm:py-32 px-4 sm:px-12 bg-[#0A0B14] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16 sm:mb-24">
                        <span className="text-[#B9FF66] font-black text-[9px] sm:text-xs uppercase tracking-[0.4em] block mb-4">BENCHMARK DE MERCADO</span>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tightest leading-tight italic px-4">¿Por qué NeuroV V7.5?</h2>
                    </div>

                    <div className="overflow-x-auto pb-4">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Característica</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-[#00f2ff]">NeuroV V7.5</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Software Tradicional</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Gestión Manual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { f: 'Implementación', n: '48 Horas', t: '2-4 Semanas', m: 'N/A', icon: Clock },
                                    { f: 'IA Operativa (Donna)', n: 'Incluida (WhatsApp)', t: 'No / Solo Chatbots', m: 'No', icon: Bot },
                                    { f: 'Integración FHIR', n: 'Ready', t: 'Raramente', m: 'No', icon: Zap },
                                    { f: 'Marketing Automatizado', n: 'Nativo', t: 'Basico / Externo', m: 'No', icon: TrendingUp },
                                    { f: 'ROI Esperado', n: '94% (1er Mes)', t: 'Variable', m: 'Negativo', icon: BarChart }
                                ].map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-3">
                                                <row.icon size={16} className="text-indigo-400" />
                                                <span className="font-bold text-sm">{row.f}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 font-black text-sm text-[#00f2ff]">{row.n}</td>
                                        <td className="py-6 px-6 text-sm text-gray-500">{row.t}</td>
                                        <td className="py-6 px-6 text-sm text-gray-500">{row.m}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* SECCIÓN GROWTH: El Motor de Crecimiento */}
            <section id="marketing" className="py-20 sm:py-24 px-4 sm:px-12 bg-[#F9FAFB] rounded-[2.5rem] sm:rounded-[4rem] mx-4 sm:mx-10 mb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                        <div className="text-center lg:text-left">
                            <span className="text-indigo-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.3em]">MOTOR DE CRECIMIENTO</span>
                            <h2 className="text-3xl sm:text-5xl font-black mt-4 sm:mt-6 tracking-tightest leading-tight">Tu marca <br />en el radar 24/7.</h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium mt-6 sm:mt-8 leading-relaxed">
                                Sistema orquestado para que tu clínica esté siempre en la mente de tus pacientes.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-12 text-left">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                            <Mail size={18} />
                                        </div>
                                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest">Mail & Newsletter</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed">Educación mensual y campañas segmentadas automáticas.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                            <Sparkles size={18} />
                                        </div>
                                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest">Ofertas Temporales</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-bold leading-relaxed">Activación inteligente según fechas clave.</p>
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

            {/* Final CTA */}
            <section className="py-16 sm:py-24 px-4 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#B9FF66] rounded-[3rem] sm:rounded-[5rem] p-12 sm:p-32 text-center text-gray-900 relative overflow-hidden group">
                        <h2 className="text-4xl sm:text-7xl font-black mb-8 sm:mb-10 tracking-tightest leading-none">
                            Lo tienes todo. <br />Donna lo opera.
                        </h2>
                        <button className="px-10 py-6 sm:px-16 sm:py-8 bg-gray-900 text-white rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl">
                            COMENZAR AHORA
                        </button>
                    </div>
                </div>
            </section>

            <DonnaFloatingAssistant />
        </div>
    );
}

