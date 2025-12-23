'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideX, LucideMic, LucideVolume2, LucideSend, LucideCheckCircle2, LucideTrendingUp, LucideSmile, LucideBrainCircuit } from 'lucide-react';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';

type Message = {
    role: 'bot' | 'user';
    content: string;
};

type BantStep = 'initial' | 'leads' | 'ticket' | 'authority' | 'qualified';

export function SalesAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Soy el Cerebro de Ventas de NeuroV. Estoy aquí para auditar el potencial de crecimiento de tu clínica. ¿Iniciamos el diagnóstico?' }
    ]);
    const [bantStep, setBantStep] = useState<BantStep>('initial');
    const [qualified, setQualified] = useState(false);
    const [stats, setStats] = useState({ leads: 0, ticket: 0 });
    const { profile, forceClassify } = usePsychographic();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CL';
            utterance.rate = 1.1; // Faster, more directive
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const addBotMessage = (content: string, shouldSpeak = true) => {
        setMessages(prev => [...prev, { role: 'bot', content }]);
        if (shouldSpeak) speak(content);
    };

    const handleInitialResponse = (response: boolean) => {
        setMessages(prev => [...prev, { role: 'user', content: response ? 'Empecemos el diagnóstico.' : 'Ahora no.' }]);

        if (response) {
            const currentProfile = forceClassify();
            const adaptiveIntro = currentProfile === 'analytic'
                ? 'Análisis clínico iniciado. NeuroV opera bajo el estándar FHIR R4 para garantizar interoperabilidad del 100%.'
                : 'Perfecto. Vamos a calcular cuánto dinero estás dejando sobre la mesa por culpa de las inasistencias.';

            addBotMessage(adaptiveIntro);

            setTimeout(() => {
                addBotMessage('¿Cuántos prospectos (leads) genera tu clínica mensualmente?');
                setBantStep('leads');
            }, 800);
        } else {
            addBotMessage('Entiendo. La ineficiencia es costosa. Estaré aquí cuando decidas detener la fuga de ingresos.');
        }
    };

    const handleLeadsCount = (count: number, label: string) => {
        setStats(prev => ({ ...prev, leads: count }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);
        addBotMessage('Bien. ¿Cuál es el ticket promedio de tus tratamientos de alta gama? (Ej: Estética avanzada, Dental complejo)');
        setBantStep('ticket');
    };

    const handleTicket = (price: number, label: string) => {
        const totalPotential = stats.leads * price;
        setStats(prev => ({ ...prev, ticket: price }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);

        const isMinRevenue = totalPotential >= 30000; // $30k CLP threshold check (using simplified scale)

        addBotMessage('Entendido. Finalmente: ¿Eres quien firma las decisiones tecnológicas o necesitas validar con socios?');
        setBantStep('authority');
    };

    const handleAuthority = (isDecider: boolean) => {
        setMessages(prev => [...prev, { role: 'user', content: isDecider ? 'Tengo autoridad total.' : 'Consulto con socios.' }]);

        // Qualification Logic: Leads > 0 AND Ticket > 0 AND Authority
        const isQualified = stats.leads > 0 && stats.ticket >= 50000 && isDecider;
        setQualified(isQualified);
        setBantStep('qualified');

        if (isQualified) {
            const closing = profile === 'impulsive'
                ? 'Diagnóstico: CRÍTICO. Estás perdiendo una fortuna. Tu clínica califica para nuestro Revenue Engine. Tengo un cupo para demo MAÑANA.'
                : 'Diagnóstico: ELEGIBLE. Proyectamos un incremento del 27.5% en facturación neta optimizando tu embudo actual. ¿Revisamos el modelo?';
            addBotMessage(closing);
        } else {
            addBotMessage('Tu perfil actual no requiere nuestro motor de alta gama todavía. Te sugiero revisar nuestros recursos gratuitos de gestión.');
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_32px_rgba(99,102,241,0.4)] flex items-center justify-center z-[200] text-white cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && messages.length === 1) speak(messages[0].content);
                }}
            >
                {isOpen ? (
                    <LucideX size={32} className="sm:w-10 sm:h-10" strokeWidth={1.5} />
                ) : (
                    <LucideBrainCircuit size={32} className="sm:w-10 sm:h-10" strokeWidth={1.5} />
                )}

                {isSpeaking && (
                    <div className="absolute -top-1 -right-1">
                        <span className="flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-white flex items-center justify-center shadow-lg">
                                <LucideVolume2 size={10} className="text-indigo-600" />
                            </span>
                        </span>
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-8 sm:bottom-32 sm:w-[420px] max-h-[85vh] z-[200] flex flex-col"
                    >
                        <div className="h-full flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0f1e]/90 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
                            {/* Seamless Header */}
                            <div className="p-8 pb-4 flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                    <LucideBrainCircuit size={24} className="text-white" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-white uppercase tracking-tighter text-lg leading-none mb-1">Cerebro de Ventas</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Protocolo Activo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transparent Message Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto px-8 py-4 space-y-6 min-h-[300px] max-h-[450px] custom-scrollbar"
                            >
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-bold leading-relaxed ${m.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                                            : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Integrated Actions Area */}
                            <div className="p-8 pt-4 pb-10">
                                {bantStep === 'initial' && (
                                    <div className="flex flex-col gap-3">
                                        <PremiumButton variant="primary" size="lg" className="w-full font-black rounded-2xl py-4 shadow-xl shadow-indigo-600/20" onClick={() => handleInitialResponse(true)}>AUDITAR AHORA</PremiumButton>
                                        <button className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2" onClick={() => handleInitialResponse(false)}>LUEGO</button>
                                    </div>
                                )}

                                {bantStep === 'leads' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {['0-50', '50-200', '200-500', '500+'].map((range, idx) => (
                                            <button key={range} onClick={() => handleLeadsCount(idx * 100, range)} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white hover:bg-indigo-600 transition-all uppercase tracking-widest">{range} Leads</button>
                                        ))}
                                    </div>
                                )}

                                {bantStep === 'ticket' && (
                                    <div className="grid grid-cols-1 gap-3">
                                        <button onClick={() => handleTicket(45000, '< $50k')} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-white hover:bg-red-500/20 transition-all uppercase tracking-widest">Bajo Ticket</button>
                                        <button onClick={() => handleTicket(150000, '$150k+')} className="p-4 bg-indigo-600 rounded-2xl text-xs font-black text-white hover:bg-indigo-500 transition-all uppercase tracking-widest">Ticket Premium</button>
                                    </div>
                                )}

                                {bantStep === 'authority' && (
                                    <div className="flex flex-col gap-3">
                                        <PremiumButton variant="primary" size="md" className="w-full font-black rounded-2xl py-4" onClick={() => handleAuthority(true)}>SOY DECISOR</PremiumButton>
                                        <button className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2" onClick={() => handleAuthority(false)}>TENGO SOCIOS</button>
                                    </div>
                                )}

                                {bantStep === 'qualified' && qualified && (
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-4">
                                        <PremiumButton
                                            variant="primary"
                                            size="lg"
                                            className="w-full shadow-2xl shadow-indigo-600/40 py-6 rounded-2xl font-black"
                                            onClick={() => window.location.href = '/demo?qualified=true'}
                                        >
                                            ACCEDER AL PROTOCOLO
                                        </PremiumButton>
                                    </motion.div>
                                )}

                                {bantStep === 'qualified' && !qualified && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-relaxed">Acceso denegado: motor reservado para alta gama</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
