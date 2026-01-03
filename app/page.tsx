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
    Star,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Footer } from '@/components/Footer';

const DonnaFloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [userContext, setUserContext] = useState<{ businessType?: string, mainChallenge?: string }>({});
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const activityTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleActivity = () => {
            setIsVisible(true);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
            activityTimeoutRef.current = setTimeout(() => {
                if (!isOpen) setIsVisible(false);
            }, 3000);
        };
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('touchstart', handleActivity);
        handleActivity();
        return () => {
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        // Preload local sound for maximum reliability
        audioRef.current = new Audio('/water-drop.mp3');
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.load();
        }
    }, []);
    const [chat, setChat] = useState<{ role: 'donna', content: string, options?: string[] }>({
        role: 'donna',
        content: "Hola, soy tu asistente en NeuroV. Juntos ordenaremos la gestión de tu consulta para que tengas más tiempo. ¿Empezamos?",
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
                    nextResponse = "Activaremos procesos de contacto proactivo para cubrir huecos detectados contactando pacientes de alto valor. ¿Deseas ver cómo funciona este protocolo?";
                } else {
                    nextResponse = "NeuroV centraliza la gestión operativa 24/7. Podemos reducir tu carga administrativa en un 80% mediante asistentes de gestión operativa. ¿Te gustaría conocer el plan?";
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
                                <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-[0.5em]">Asistencia Digital // NeuroV</span>
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
                                    <h4 className="text-gray-900 font-black text-sm tracking-tighter leading-tight">DONNA - GESTIÓN CLÍNICA</h4>
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
                        opacity: (isOpen) ? 0 : (isVisible ? 1 : 0),
                        scale: (isOpen) ? 0.8 : (isVisible ? 1 : 0.8),
                        pointerEvents: (isOpen || !isVisible) ? 'none' : 'auto',
                        y: (isOpen || !isVisible) ? 20 : 0
                    }}
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(err => console.error('Audio play failed:', err));
                        }
                    }}
                    className="relative w-[63px] h-[63px] sm:w-[70px] sm:h-[70px] bg-slate-900/5 backdrop-blur-[2px] rounded-2xl flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(79,70,229,0.3),inset_0_-8px_15px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] z-[200] overflow-hidden group"
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
                            className="absolute w-2 h-2 bg-indigo-400/40 rounded-full blur-[1px] pointer-events-none"
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

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{
                            scale: [0.8, 2],
                            opacity: [0, 0.3, 0],
                            transition: { duration: 0.5, ease: "easeOut" }
                        }}
                        className="absolute inset-0 border-[2px] border-indigo-300/30 rounded-2xl pointer-events-none"
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
                                className="w-[41px] h-[41px] sm:w-[47px] sm:h-[47px] text-indigo-600 stroke-[1.1] opacity-95"
                            />
                        </motion.div>
                    </div>

                    {/* High-Clarity Glass Sheen (Enhanced) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-white/[0.12] to-transparent pointer-events-none z-10" />

                    {/* Specular Highlights (Intensified) */}
                    <div className="absolute top-2 left-3 w-1/3 h-1/4 bg-white/60 blur-[1px] rounded-full rotate-[-45deg] pointer-events-none z-20" />
                    <div className="absolute bottom-2 right-4 w-1/4 h-1/6 bg-indigo-400/30 blur-[2px] rounded-full pointer-events-none z-20" />

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
                    {/* Liquid Cyber Pulse Logo (Transparent Glass Version) */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Core Glow (Subtler) */}
                        <div className="absolute inset-0 bg-indigo-500/10 rounded-xl blur-md" />

                        {/* Glass Container */}
                        <div className="relative w-full h-full bg-white/5 backdrop-blur-md rounded-xl border border-indigo-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                            {/* Inner Shine (Glass Reflection) */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent pointer-events-none" />

                            {/* Animated Pulse Border */}
                            <div className="absolute inset-0 border border-indigo-400/10 rounded-xl animate-pulse" />

                            {/* Brain Icon - Exact Copy of Floating Button Style */}
                            <BrainCircuit className="relative z-10 w-6 h-6 text-indigo-600 stroke-[1.1] opacity-95" />
                        </div>
                    </div>

                    {/* Text Logo: Dynamic Neuro (White/Black) + Static V (Blue) */}
                    <div className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                        <span className={`transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>Neuro</span>
                        <span className="text-indigo-600">V</span>
                    </div>
                </div>

                <div className={`hidden lg:flex items-center gap-10 font-bold text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled ? 'text-gray-400' : 'text-gray-300'}`}>
                    <a href="#inteligencia" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>Web</a>
                    <a href="#secretaria" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>WhatsApp</a>
                    <a href="#operacion" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>Gestión</a>
                    <a href="#marketing" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>Pacientes</a>
                    <a href="#seguridad" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>Seguridad</a>
                    <a href="#precios" className={`transition-colors ${isScrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>Planes</a>
                    <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95">
                        COMENZAR AHORA <ArrowRight size={14} />
                    </button>
                </div>

                <button className={`lg:hidden p-2 transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                            <a href="#inteligencia" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Web</a>
                            <a href="#secretaria" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">WhatsApp</a>
                            <a href="#operacion" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Gestión</a>
                            <a href="#marketing" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Pacientes</a>
                            <a href="#seguridad" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Seguridad</a>
                            <a href="#precios" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-900 transition-colors">Planes</a>
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

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [neuralPaths, setNeuralPaths] = useState<any[]>([]);
    const [dataNodes, setDataNodes] = useState<any[]>([]);

    useEffect(() => {
        // Generate stable random paths for the neural mesh
        const paths = [...Array(15)].map((_, i) => ({
            id: i,
            d: `M ${Math.random() * 100} ${Math.random() * 100} Q ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100}`,
            animateD: [
                `M ${Math.random() * 100} ${Math.random() * 100} Q ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100}`,
                `M ${Math.random() * 100} ${Math.random() * 100} Q ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100}`
            ],
            duration: 10 + Math.random() * 10,
            delay: i * 0.5
        }));

        // Generate stable random positions for data nodes
        const nodes = [...Array(20)].map((_, i) => ({
            id: i,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            animateY: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            duration: 15 + Math.random() * 10,
            delay: i * 0.3
        }));

        setNeuralPaths(paths);
        setDataNodes(nodes);
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Nav />

            {/* Cinematic Hero */}
            {/* Cinematic Hero - Dark Cyber Nebula Theme */}
            <section className="relative pt-[160px] pb-32 sm:pt-96 sm:pb-48 px-6 sm:px-12 bg-[#050511] overflow-hidden flex items-center min-h-screen sm:min-h-0">
                {/* HIGH-FIDELITY CYBER NEURAL BACKGROUND */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#050511]">
                    {/* Animated Mesh Gradient */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-10%] opacity-40"
                    >
                        <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full" />
                        <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full" />
                    </motion.div>

                    {/* Cyber Neural SVG Mesh */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                                <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {mounted && neuralPaths.map((path) => (
                            <motion.path
                                key={path.id}
                                d={path.d}
                                stroke="url(#neural-gradient)"
                                strokeWidth="0.5"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.5, 0],
                                    d: path.animateD
                                }}
                                transition={{
                                    duration: path.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: path.delay
                                }}
                            />
                        ))}
                    </svg>

                    {/* Floating Data Nodes */}
                    <div className="absolute inset-0">
                        {mounted && dataNodes.map((node) => (
                            <motion.div
                                key={node.id}
                                initial={{
                                    x: node.x,
                                    y: node.y,
                                    opacity: 0,
                                    scale: 0
                                }}
                                animate={{
                                    y: node.animateY,
                                    opacity: [0, 0.4, 0],
                                    scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: node.duration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: node.delay
                                }}
                                className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>

                    {/* Digital Dust / Grain Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    {/* Dark Overlays for Depth */}
                    <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-transparent to-[#050511]/60" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-5 gap-10 sm:gap-16 items-center">
                        <div className="lg:col-span-3 text-left">
                            <div className="w-full flex justify-center mb-12 lg:justify-start">
                                <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                    <ShieldCheck size={10} className="w-[14px] h-[14px]" /> TU CONSULTA EN UN SOLO LUGAR
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tightest leading-[1.1] text-white mb-10">
                                Haz que tu consulta <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 animate-gradient-x">funcione para ti.</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-400 font-medium leading-relaxed max-w-xl mx-0 mb-16">
                                <strong className="text-white">NeuroV es el apoyo administrativo que necesitas:</strong> Boletas, Fonasa/Isapre, Pagos y Agenda. <br className="hidden lg:block" />
                                Mientras <strong className="text-[#B9FF66]">Donna</strong> te ayuda con WhatsApp y recordatorios automáticos, tú te dedicas 100% a tus pacientes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start mt-10 mb-4">
                                <button className="px-10 py-5 sm:px-12 sm:py-7 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                                    COMENZAR AHORA
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 relative hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 1 }}
                                className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] border border-white/10"
                            >
                                <img
                                    src="/solutions/premium_doctor.png"
                                    alt="Doctor Profesional NeuroV"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Tu Tranquilidad</div>
                                    <div className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Tu agenda llena</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR: Marquee Infinito */}
            <div className="pt-32 pb-12 bg-gray-50/50 border-y border-gray-100 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gray-200 hidden sm:block" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Alianzas Estratégicas</span>
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
                        {(() => {
                            const partners = [
                                { name: 'SII Boletas', src: '/assets/logotipos/sii.png' },
                                { name: 'Fonasa', src: '/assets/logotipos/fonasa.png' },
                                { name: 'I-Med Isapres', src: '/assets/logotipos/imed.png' },
                                { name: 'Previred', src: '/assets/logotipos/previred.png' },
                                { name: 'BUK HR', src: '/assets/logotipos/LOGO-BUK.png' },
                                { name: 'HL7 FHIR', src: '/assets/logotipos/hl7_fhir.png' },
                                { name: 'CENS Chile', src: '/assets/logotipos/CENS-cropped-logotipo-cens.png' },
                                { name: 'Meta ADS', src: '/assets/logotipos/meta ADS.png' },
                                { name: 'Google ADS', src: '/assets/logotipos/Google_Ads_logo.svg.png' }
                            ];
                            return [...partners, ...partners, ...partners].map((logo, index) => {
                                let sizingClass = 'h-12 sm:h-16';
                                if (['BUK', 'Fonasa', 'CENS'].includes(logo.name)) {
                                    sizingClass = 'h-20 sm:h-28';
                                } else if (logo.name === 'HL7 FHIR') {
                                    sizingClass = 'h-14 sm:h-20'; // Reducido ~30% respecto al grupo anterior (h-20 -> h-14 / h-28 -> h-20)
                                } else if (logo.name === 'Previred') {
                                    sizingClass = 'h-24 sm:h-32';
                                }

                                return (
                                    <div key={index} className="flex items-center justify-center">
                                        <img
                                            src={logo.src}
                                            alt={logo.name}
                                            className={`${sizingClass} w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain`}
                                        />
                                    </div>
                                );
                            });
                        })()}
                    </motion.div>
                </div>
            </div>



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
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 text-left"
                        >
                            <div className="w-full flex justify-center mb-8 lg:justify-start">
                                <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                    <BrainCircuit size={10} className="w-[14px] h-[14px]" /> ASISTENCIA SIEMPRE ACTIVA
                                </div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-white">
                                Donna en WhatsApp. <br />
                                Tú <span className="text-[#B9FF66]">atiendes.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                                Donna gestiona tus mensajes al instante, respondiendo dudas y <span className="text-indigo-400">agendando citas directamente</span> en tu WhatsApp. Mientras ella se encarga de lo repetitivo, tú puedes enfocarte en tus pacientes <span className="text-white font-bold">sin interrupciones.</span>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-indigo-500/30 blur-[120px] rounded-full" />

                            {/* Original UI Image */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img
                                    src="/solutions/donna_whatsapp_ui.png"
                                    alt="Experiencia Donna AI en WhatsApp"
                                    className="max-w-[280px] sm:max-w-[380px] mx-auto rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,242,255,0.2)] border-2 sm:border-4 border-white/10"
                                />
                            </motion.div>

                            {/* Minimalist Key Stats below image */}
                            <div className="flex justify-center gap-8 mt-10">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-[#B9FF66] tracking-tight mb-1">0.3s</div>
                                    <div className="text-[10px] uppercase tracking-widest text-indigo-200/60 font-bold">Respuesta</div>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="text-center">
                                    <div className="text-2xl font-black text-cyan-400 tracking-tight mb-1">24/7</div>
                                    <div className="text-[10px] uppercase tracking-widest text-indigo-200/60 font-bold">Disponible</div>
                                </div>
                            </div>

                            {/* AI Pulse Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-cyan-500/10 rounded-full animate-ping pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ECOSYSTEM SECTION - Integrations (Explicit I-Med and Buk) */}
            <section className="pt-20 pb-8 sm:py-32 px-6 sm:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-2 lg:gap-20 items-center">
                        <div className="text-left space-y-8">
                            <div className="w-full flex justify-center lg:justify-start mb-8">
                                <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                    <Globe size={10} className="w-[14px] h-[14px]" /> TODO EN UN SOLO LUGAR
                                </div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-slate-900 mb-6 px-0">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">Automatiza Todas Tus Operaciones</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                                Integra NeuroV con las <span className="text-indigo-600 font-bold">plataformas líderes en Chile.</span> Automatiza la venta de bonos I-Med, gestiona boletas del SII y centraliza tu equipo con Buk en un solo lugar.
                            </p>

                            <div className="grid gap-4">
                                {[
                                    {
                                        icon: CreditCard,
                                        title: "Cobros y Boletas",
                                        desc: "Cobra, emite boletas SII y gestiona tus pagos sin estrés.",
                                        tag: "SII / TRANSBANK",
                                        color: "bg-indigo-50",
                                        textColor: "text-indigo-600"
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: "Venta de Bonos I-Med",
                                        desc: "Conexión directa para que compren sus bonos Fonasa e Isapre.",
                                        tag: "I-Med",
                                        color: "bg-indigo-50",
                                        textColor: "text-indigo-600"
                                    },
                                    {
                                        icon: Users,
                                        title: "Previsión y Cotizaciones",
                                        desc: "Gestiona remuneraciones y pagos previsionales de forma automática y centralizada.",
                                        tag: "BUK / PREVIRED",
                                        color: "bg-indigo-100",
                                        textColor: "text-indigo-600"
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, scale: 1.01 }}
                                        className="flex gap-4 p-4 rounded-3xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group cursor-default"
                                    >
                                        <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center ${item.textColor} group-hover:scale-110 transition-transform shrink-0`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 leading-tight">{item.title}</h4>
                                                <span className={`text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase shrink-0 whitespace-nowrap`}>{item.tag}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                        <div className="relative overflow-visible">
                            {/* Enhanced Container with Organic Background */}
                            <div className="aspect-square flex items-center justify-center relative rounded-[3rem] border-2 border-indigo-200/50 shadow-[0_30px_80px_-20px_rgba(79,70,229,0.35)]">
                                {/* PIEZA 1: El Fondo (Profundidad y Energía) */}
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem]">
                                    <motion.img
                                        src="/assets/fondo/cyber_tunnel_v2.png"
                                        alt="Fondo Cyber"
                                        initial={{ scale: 1.15 }}
                                        animate={{
                                            scale: [1.15, 1.05, 1.15],
                                            opacity: [0.9, 1, 0.9]
                                        }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="w-full h-full object-cover brightness-[1.3] contrast-[1.1] saturate-[0.8]"
                                    />
                                    {/* High-Key Glass Overlay */}
                                    <div className="absolute inset-0 bg-white/40" />

                                    {/* Dynamic Neural Energy Pulses (Fondo) */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: [0.8, 2.5],
                                                    opacity: [0, 0.4, 0]
                                                }}
                                                transition={{
                                                    duration: 8,
                                                    repeat: Infinity,
                                                    delay: i * 2.6,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-indigo-200/30 rounded-full blur-[2px]"
                                            />
                                        ))}
                                    </div>

                                    {/* Central Core Glow (Fondo) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-[80px] opacity-100" />
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.4, 0.7, 0.4]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100/50 rounded-full blur-[100px]"
                                    />
                                </div>

                                {/* PIEZA 2: El Carrusel Orbitante (Independiente del Fondo) */}
                                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                    <div className="relative w-full h-full pointer-events-auto">
                                        {/* Static Central Node: NeuroV Logo */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                            <span className="text-3xl sm:text-4xl font-black tracking-tighter">
                                                <span className="text-gray-900">Neuro</span>
                                                <span className="text-indigo-600">V</span>
                                            </span>
                                        </div>

                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                            className="relative w-full h-full max-w-[340px] max-h-[340px] sm:max-w-[600px] sm:max-h-[600px] orbit-container flex items-center justify-center mx-auto"
                                        >
                                            {/* Orbiting Logotypes (Static Group Rotation) */}
                                            {[
                                                { angle: 0, logo: '/assets/logotipos/whatsapp API.png' },
                                                { angle: 51.4, logo: '/assets/logotipos/imed.png' },
                                                { angle: 102.8, logo: '/assets/logotipos/Google_Ads_logo.svg.png' },
                                                { angle: 154.2, logo: '/assets/logotipos/sii.png' },
                                                { angle: 205.6, logo: '/assets/logotipos/meta ADS.png' },
                                                { angle: 257, logo: '/assets/logotipos/previred.png' },
                                                { angle: 308.4, logo: '/assets/logotipos/LOGO-BUK.png' }
                                            ].map((orb, idx) => (
                                                <div
                                                    key={idx}
                                                    className="absolute top-1/2 left-1/2"
                                                    style={{
                                                        transform: `rotate(${orb.angle}deg) translateY(calc(-1 * var(--orbit-radius)))`
                                                    }}
                                                >
                                                    <div className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-48 sm:h-48 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-500">
                                                        <img
                                                            src={orb.logo}
                                                            alt="Integración"
                                                            className={`${orb.logo.includes('Google_Ads') ? 'w-[53.2px] h-[53.2px] sm:w-[91.2px] sm:h-[91.2px]' :
                                                                orb.logo.includes('meta') ? 'w-[39px] h-[39px] sm:w-[94px] sm:h-[94px]' :
                                                                    orb.logo.includes('BUK') ? 'w-[76.8px] h-[76.8px] sm:w-[153.6px] sm:h-[153.6px]' :
                                                                        orb.logo.includes('previred') ? 'w-[91.2px] h-[91.2px] sm:w-[182.4px] sm:h-[182.4px]' :
                                                                            orb.logo.includes('whatsapp') ? 'w-20 h-20 sm:w-40 sm:h-40' :
                                                                                orb.logo.includes('imed') ? 'w-16 h-16 sm:w-32 sm:h-32' :
                                                                                    orb.logo.includes('sii') ? 'w-[38.4px] h-[38.4px] sm:w-[57.6px] sm:h-[57.6px]' :
                                                                                        'w-12 h-12 sm:w-24 sm:h-24'
                                                                } object-contain`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </div>
                                <style>{`
                                    .orbit-container { --orbit-radius: 110px; }
                                    @media (min-width: 640px) {
                                        .orbit-container { --orbit-radius: 200px; }
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN SEGURIDAD Y CUMPLIMIENTO LEGAL */}
            <section id="seguridad" className="pt-4 pb-20 sm:py-32 px-6 sm:px-12 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="w-full flex justify-center mb-8 lg:justify-start">
                                <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                    <Lock size={10} className="w-[14px] h-[14px]" /> TU INFORMACIÓN SIEMPRE SEGURA
                                </div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-gray-900 mb-6">
                                Tu información, <br /><span className="text-emerald-600">siempre protegida.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                                En NeuroV, cuidar los datos de tus pacientes es nuestra prioridad. Cumplimos con todas las leyes chilenas de salud y protección de datos para que tú trabajes tranquilo.
                            </p>

                            <div className="grid gap-6">
                                {[
                                    { title: "Ley 20.584 (Derechos y Deberes)", desc: "Privacidad absoluta en Fichas Clínicas y consentimiento informado digital.", law: "Minsal Chile" },
                                    { title: "Ley 19.628 (Protección de Datos)", desc: "Encriptación de grado bancario para toda la información personal de tus pacientes.", law: "Data Privacy" }
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
                                                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase">{item.law}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* COMPACT PREMIUM CTA BUTTON: PILL SHAPE & VIBRANT EMERALD */}
                                <motion.a
                                    href="/solutions-test/legal"
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="flex items-center justify-between px-6 py-3 rounded-full bg-emerald-600 border border-emerald-500 shadow-[0_15px_30px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(5,150,105,0.6)] transition-all group mt-6 overflow-hidden relative w-full"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-3 relative z-10 w-full justify-between">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden text-center">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white leading-tight">Más información</h4>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative lg:order-2 group"
                        >
                            <div className="relative z-10 overflow-hidden rounded-[2.5rem]">
                                <img
                                    src="/solutions/security_shield_mockup.png"
                                    alt="NeuroV Security Infrastructure"
                                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >



            {/* SECCIÓN GROWTH: Más Pacientes (REORDERED) */}
            < section id="marketing" className="py-20 sm:py-32 px-6 sm:px-12 bg-white overflow-hidden relative" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                        <div className="relative lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.15)] border border-gray-100"
                            >
                                <img
                                    src="/assets/imagenes/asistente virtual 2.png"
                                    alt="NeuroV Cyber-Health Intelligence"
                                    className="w-full h-auto object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </div>

                        <div className="text-left space-y-8 lg:order-1">
                            <div className="w-full flex justify-center mb-8 lg:justify-start">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="relative flex sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-100/50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto shadow-sm group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <div className="relative flex items-center gap-2">
                                        <div className="relative">
                                            <Zap size={12} className="relative z-10" />
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-indigo-400 rounded-full blur-sm"
                                            />
                                        </div>
                                        <span>CRECIMIENTO <span className="text-violet-500">MARKETING & VENTAS</span></span>
                                    </div>
                                </motion.div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-gray-900 mb-6">
                                <span className="text-indigo-600">Presencia Digital.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                                Tu clínica siempre activa para tus pacientes. Donna es omnicanal para asegurar que nadie se quede sin atención.
                            </p>

                            <div className="grid gap-6 mt-10 sm:mt-12">
                                {[
                                    { title: "Integración con Ads (Google & Meta)", desc: "Conectamos tu clínica con las plataformas de anuncios más potentes para asegurar un flujo constante de nuevos pacientes.", tag: "Estrategia", icon: TrendingUp, color: "bg-indigo-100", textColor: "text-indigo-600", tagBg: "bg-indigo-50" },
                                    { title: "Nutrición de Leads (Donna Marketing)", desc: "Donna responde instantáneamente a cada prospecto en Instagram y Facebook, convirtiendo interesados en citas reales.", tag: "Conversión", icon: Target, color: "bg-emerald-100", textColor: "text-emerald-600", tagBg: "bg-emerald-50" },
                                    { title: "Reputación y Reseñas Digitales", desc: "Automatizamos la captura de testimonios positivos en Google para que tu marca destaque y genere máxima confianza.", tag: "Marca", icon: Zap, color: "bg-amber-100", textColor: "text-amber-600", tagBg: "bg-amber-50" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, scale: 1.01 }}
                                        className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group cursor-default"
                                    >
                                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center ${item.textColor} group-hover:scale-110 transition-transform shrink-0`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{item.title}</h4>
                                                <span className={`text-[9px] font-black ${item.tagBg} ${item.textColor} px-2 py-0.5 rounded-full uppercase`}>{item.tag}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* MARKETING & GROWTH CTA BUTTON: PILL SHAPE & VIBRANT INDIGO */}
                                <motion.a
                                    href="/growth"
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="flex items-center justify-between px-6 py-3 rounded-full bg-indigo-600 border border-indigo-500 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.6)] transition-all group mt-6 overflow-hidden relative w-full"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-3 relative z-10 w-full justify-between">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden text-center">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white leading-tight">Más información</h4>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>
            </section >












            {/* SECCIÓN ADAPTABILIDAD: Diseñado para tu Crecimiento */}
            < section className="py-20 sm:py-32 px-6 sm:px-12 bg-gray-50 relative overflow-hidden" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 text-left"
                        >
                            <div className="w-full flex justify-center lg:justify-start mb-8">
                                <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[clamp(9px,2.5vw,10px)] font-bold uppercase tracking-[0.1em] whitespace-nowrap w-full sm:w-auto">
                                    <Zap size={10} className="w-[14px] h-[14px]" /> ADAPTABILIDAD TOTAL
                                </div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-gray-900">
                                Nos adaptamos <br />
                                <span className="text-indigo-600">a tu consulta.</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-0">
                                Ya sea que manejes una consulta privada o una red nacional de centros, NeuroV te brinda el orden necesario para que te enfocues 100% en tus pacientes.
                            </p>

                            <div className="grid gap-6 mt-12">
                                {[
                                    {
                                        icon: Target,
                                        title: "Independientes",
                                        desc: "Centraliza agenda y cobros sin secretarias físicas.",
                                        tag: "Autonomía",
                                        color: "indigo"
                                    },
                                    {
                                        icon: Users,
                                        title: "Centros Médicos",
                                        desc: "Sincronización perfecta entre múltiples especialistas y salas.",
                                        tag: "Sincronización",
                                        color: "emerald"
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: "Franquicias",
                                        desc: "Control global simplificado para una expansión sin riesgos.",
                                        tag: "Control Global",
                                        color: "violet"
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10, scale: 1.02 }}
                                        className="group relative flex gap-6 p-6 rounded-[2rem] bg-white border border-transparent hover:border-indigo-100/50 hover:shadow-xl transition-all duration-500 cursor-default"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-500 shadow-sm shrink-0`}>
                                            <item.icon size={26} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className={`text-[9px] font-black text-${item.color}-600 uppercase tracking-widest`}>{item.tag}</span>
                                            </div>
                                            <h4 className="text-lg font-black italic tracking-tighter text-gray-900 leading-tight uppercase">{item.title}</h4>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative group lg:order-2"
                        >
                            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl border border-white">
                                <img
                                    src="/solutions/growth_stages.png"
                                    alt="Etapas de Crecimiento NeuroV"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* PREMIUM ONBOARDING (MATCHING ENCUADRADO SUPPORT) */}
            < section className="py-20 sm:py-24 px-6 bg-[#F9FAFB] border-t border-gray-100 relative overflow-hidden" >
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/30 -skew-x-12 translate-x-32" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-left space-y-8"
                    >
                        <div className="w-full flex justify-center lg:justify-start mb-8">
                            <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[clamp(9px,2.5vw,10px)] font-bold uppercase tracking-[0.1em] whitespace-nowrap w-full sm:w-auto">
                                <ShieldCheck size={10} className="w-[14px] h-[14px]" /> TE AYUDAMOS A EMPEZAR
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-[1000] tracking-tightest mb-8 leading-none text-slate-900">No te dejamos sola. <br /><span className="text-indigo-600">Estamos en todas!</span></h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl mx-0">
                            A diferencia de otros softwares donde tú haces todo, nosotros te ofrecemos una <span className="text-indigo-600 font-bold">Asesoría de Inicio</span>. Dejamos tus pagos, a Donna y toda tu agenda configurada en 48 horas.
                        </p>
                        <div className="space-y-6">
                            {[
                                "Asesoría Personalizada de Configuración",
                                "Migración de Datos de Pacientes incluida",
                                "Soporte Prioritario vía WhatsApp Concierge"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Check size={16} className="text-indigo-600 shrink-0" />
                                    <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative group h-full"
                    >
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
                        <div className="relative z-10 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-indigo-50 overflow-hidden h-full">
                            <img
                                src="/assets/imagenes/doctora loca.png?v=2"
                                alt="NeuroV Premium Onboarding Team"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* PLANES DE LIBERTAD OPERATIVA - DARK REDESIGN */}
            < section id="precios" className="py-20 sm:py-32 px-6 sm:px-12 bg-[#0A0B14] text-white relative overflow-hidden" >
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-left mb-16 sm:mb-24 space-y-8">
                        <div className="w-full flex justify-center lg:justify-start mb-8">
                            <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.2em] whitespace-nowrap w-full sm:w-auto">
                                <CreditCard size={10} className="w-[14px] h-[14px]" /> PLANES PARA TU CONSULTA
                            </div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-tight text-white mb-6">
                            NeuroV te ayuda <span className="text-indigo-400">con todo.</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mx-0 mb-8">
                            Centraliza tu gestión y olvida las complicaciones administrativas. <span className="text-indigo-400 font-bold">NeuroV te acompaña</span> para que tú solo seas el Doctor.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 text-left">
                        {[
                            {
                                name: "NeuroV Esencial",
                                price: "$49.990",
                                period: "/mes",
                                roles: ["Secretaria 24/7 (WhatsApp)", "Boletas Honorarios SII", "Agenda I-Med (Fonasa)"],
                                focus: "Ideal para iniciar tu independencia operativa.",
                                icon: Zap,
                                iconBg: "bg-indigo-600/20",
                                iconColor: "text-indigo-400"
                            },
                            {
                                name: "NeuroV Gestión",
                                price: "$89.990",
                                period: "/mes",
                                roles: ["Administrador Global", "Impuestos & Contabilidad", "RRHH (Buk/Imposiciones)", "Venta Bonos Isapre"],
                                focus: "Libertad total. NeuroV gestiona toda tu clínica.",
                                popular: true,
                                icon: Target,
                                iconBg: "bg-emerald-600/20",
                                iconColor: "text-emerald-400"
                            },
                            {
                                name: "NeuroV Crecimiento",
                                price: "$149.990",
                                period: "/mes",
                                roles: ["Apoyo en Crecimiento", "Presencia en Google/Meta", "Web de Alto Impacto", "Acompañamiento Estratégico"],
                                focus: "Para quienes buscan un crecimiento constante.",
                                icon: TrendingUp,
                                iconBg: "bg-violet-600/20",
                                iconColor: "text-violet-400"
                            }
                        ].map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className={`h-full bg-white/[0.03] border ${plan.popular ? 'border-indigo-500/50' : 'border-white/10'} rounded-[2.5rem] p-10 transition-all hover:bg-white/[0.06] hover:border-indigo-500/30 hover:shadow-[0_45px_100px_-20px_rgba(79,70,229,0.3)] hover:-translate-y-3 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-2xl`}>
                                    {plan.popular && (
                                        <div className="absolute top-8 right-8 bg-[#B9FF66] text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(185,255,102,0.4)] z-20">
                                            Más Solicitado
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 ${plan.iconBg} rounded-2xl flex items-center justify-center ${plan.iconColor} mb-8 group-hover:scale-110 transition-transform`}>
                                            <plan.icon size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white leading-none">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-5xl font-black tracking-tightest text-[#B9FF66]">{plan.price}</span>
                                            <span className="text-sm text-gray-500 font-bold">{plan.period}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed">
                                            {plan.focus}
                                        </p>
                                        <div className="space-y-4 mb-10">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-6 flex items-center gap-3">
                                                <div className="h-[1px] flex-1 bg-white/5" />
                                                EN NEUROV
                                                <div className="h-[1px] flex-1 bg-white/5" />
                                            </div>
                                            {plan.roles.map((role, idx) => (
                                                <div key={idx} className="flex items-center gap-4 group/item">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${plan.iconColor} opacity-50 group-hover/item:opacity-100 transition-all`} />
                                                    <span className="text-sm font-bold text-gray-300 group-hover/item:text-white transition-colors">{role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${plan.popular ? 'bg-indigo-600 text-white shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        ACTIVAR LIBERTAD
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >



            <section id="agenda" className="py-20 sm:py-32 px-6 bg-[#0A0B14] relative overflow-hidden">
                {/* Cyber backgrounds */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="max-w-5xl mx-auto text-left relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full flex justify-center lg:justify-start mb-8">
                            <div className="flex sm:inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-[#B9FF66] text-[clamp(9px,2.5vw,10px)] font-black uppercase tracking-[0.05em] sm:tracking-[0.5em] whitespace-nowrap w-full sm:w-auto">
                                <Sparkles size={10} className="w-[2.5vw] h-[2.5vw] max-w-[14px] max-h-[14px] min-w-[11px] min-h-[11px]" /> CONSULTORÍA DE ALTO NIVEL
                            </div>
                        </div>
                        <h2 className="text-4xl sm:text-7xl lg:text-8xl font-[1000] text-white mb-8 sm:mb-10 tracking-tightest leading-[0.9] italic">
                            Agenda tu <br />
                            <span className="text-indigo-500">Sesión de Inicio.</span>
                        </h2>
                        <p className="text-gray-400 text-xl md:text-2xl font-medium mb-16 max-w-2xl mx-0 leading-relaxed">
                            Nuestro equipo te ayudará a organizar tu <span className="text-white font-bold">consulta con NeuroV</span> en solo 30 minutos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-start items-center">
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



            <Footer />
            <DonnaFloatingAssistant />
        </div >
    );
}

