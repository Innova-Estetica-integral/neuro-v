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
    BrainCircuit
} from 'lucide-react';

const DonnaFloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [chat, setChat] = useState<{ role: 'donna' | 'user', content: string }[]>([
        { role: 'donna', content: 'Hola, soy Donna, tu Directora de Operaciones. Antes de mostrarte el futuro de tu clínica, cuéntame: ¿A qué rubro te dedicas?' }
    ]);
    const [input, setInput] = useState('');

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
            // Pequena demora para que la transicion de apertura termine
            setTimeout(() => speak(chat[0].content), 500);
        }
    }, [isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setChat(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        setTimeout(() => {
            if (step === 0) {
                const welcome = `¡Excelente! Para un negocio de ${userMsg}, mi trabajo es liberarte de la carga operativa. Yo me encargo del agendamiento proactivo, los cobros automáticos y la emisión de boletas SII sin que muevas un dedo.`;
                setChat(prev => [...prev, { role: 'donna', content: welcome }]);
                speak(welcome);

                setTimeout(() => {
                    const marketing = 'Pero lo más importante es mi motor de marketing: Recopilo cada dato de tus pacientes y lo envío directamente a las API de Meta. Esto entrena a tus campañas para buscar solo a pacientes de alto valor, reduciendo tus costos de publicidad a la mitad.';
                    setChat(prev => [...prev, { role: 'donna', content: marketing }]);
                    speak(marketing);
                }, 5000);
                setStep(1);
            } else {
                const closing = 'Entiendo perfectamente. Mi objetivo es que tú solo te preocupes de operar, mientras yo gestiono el crecimiento. ¿Te gustaría agendar una demo para ver cómo conectamos tu clínica a Meta?';
                setChat(prev => [...prev, { role: 'donna', content: closing }]);
                speak(closing);
            }
        }, 1000);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[200]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-28 right-0 w-[350px] sm:w-[420px] bg-white rounded-[3rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden"
                    >
                        <div className="bg-gray-900 p-8 flex items-center gap-5">
                            <div className={`w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]' : ''}`}>
                                <BrainCircuit className="text-gray-900 w-8 h-8 drop-shadow-sm" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Donna Executive</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'En Línea - Hablando' : 'Directora de Operaciones'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                                className="ml-auto p-3 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="h-[400px] overflow-y-auto p-8 space-y-6 bg-gray-50/50 scroll-smooth">
                            {chat.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-sm font-medium leading-[1.6] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isSpeaking && (
                                <div className="flex gap-1.5 items-end justify-center py-6">
                                    {[0.1, 0.4, 0.2, 0.6, 0.3, 0.5, 0.2].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [10, 40, 10] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                                            className="w-1.5 bg-indigo-500/40 rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe o responde por voz..."
                                className="flex-1 bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                            />
                            <button
                                onClick={handleSend}
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
                className="relative w-24 h-24 bg-white/40 backdrop-blur-3xl rounded-3xl flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3),rgba(255,255,255,0.5)_0_0_0_1px_inset,0_0_30px_rgba(99,102,241,0.2)] group overflow-hidden border border-white/50"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)'
                }}
            >
                {/* Visual Diamond Shimmer */}
                <motion.div
                    animate={{ x: [-150, 300] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
                />

                {/* Brilliant White Icon with High-Intensity Glow */}
                <div className="relative z-10 text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] flex flex-col items-center">
                    <BrainCircuit className="w-12 h-12 stroke-[1.8]" />
                </div>

                {/* Pulse Status */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
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
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-100 py-4 shadow-sm' : 'bg-transparent py-10'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xl">
                        <BrainCircuit className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter text-gray-900">NeuroV <span className="text-indigo-600">V7.5</span></span>
                </div>

                <div className="hidden lg:flex items-center gap-12 font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400">
                    <a href="#inteligencia" className="hover:text-gray-900 transition-colors">Inteligencia</a>
                    <a href="#marketing" className="hover:text-gray-900 transition-colors">Marketing</a>
                    <a href="#superioridad" className="hover:text-gray-900 transition-colors">Diferencial</a>
                    <button className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-black transition-all font-black shadow-2xl shadow-indigo-100 flex items-center gap-2">
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
                        className="lg:hidden fixed inset-y-0 right-0 w-[85%] bg-white z-[110] p-8 flex flex-col gap-6 font-bold text-[11px] uppercase tracking-[0.25em] text-left shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] border-l border-gray-100"
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
                            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-2xl active:scale-95 transition-all text-[10px] tracking-[0.2em]">AGENDA AUDITORÍA</button>
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
                                <button className="px-12 py-7 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-3xl hover:translate-y-[-4px] active:translate-y-0">
                                    Transformar mi Clínica
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
                        <div className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                                <Plus className="text-gray-400" />
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

                        <div className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                                <Plus className="text-gray-400" />
                            </div>
                            <h4 className="text-2xl font-black mb-12 italic text-gray-400 line-through">Secretarias WA</h4>
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
