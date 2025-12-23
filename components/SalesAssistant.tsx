'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideX, LucideMic, LucideVolume2, LucideSend, LucideCheckCircle2, LucideTrendingUp, LucideSmile } from 'lucide-react';
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
            <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[200]">
                <PremiumButton
                    variant="primary"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl glass-card p-0 flex items-center justify-center"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen && messages.length === 1) speak(messages[0].content);
                    }}
                >
                    {isOpen ? <LucideX className="w-8 h-8 sm:w-10 sm:h-10" /> : <LucideTrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />}
                </PremiumButton>
                {isSpeaking && (
                    <div className="absolute -top-3 -right-1">
                        <span className="flex h-6 w-6">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--profile-accent))] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-6 w-6 bg-[hsl(var(--profile-accent))] flex items-center justify-center">
                                <LucideVolume2 className="w-3 h-3 text-white" />
                            </span>
                        </span>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-8 sm:bottom-32 sm:w-[420px] max-h-[80vh] z-[200] flex flex-col"
                    >
                        <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-[hsl(var(--profile-accent))]/30 shadow-2xl">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 bg-gradient-to-br from-[hsl(var(--profile-accent))]/20 to-transparent flex items-center gap-4">
                                <div className="w-12 h-12 bg-[hsl(var(--profile-accent))] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                    <LucideCheckCircle2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-tighter text-lg">Cerebro de Ventas</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Protocolo Activo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[350px] max-h-[450px] custom-scrollbar bg-black/20"
                            >
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-bold leading-relaxed ${m.role === 'user'
                                            ? 'bg-[hsl(var(--profile-accent))] text-white rounded-tr-none shadow-lg shadow-[hsl(var(--profile-accent))]/20'
                                            : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none backdrop-blur-md'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions / Inputs */}
                            <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl">
                                {bantStep === 'initial' && (
                                    <div className="flex gap-3">
                                        <PremiumButton variant="primary" size="md" className="flex-1 font-black" onClick={() => handleInitialResponse(true)}>AUDITAR AHORA</PremiumButton>
                                        <PremiumButton variant="outline" size="md" className="flex-1 opacity-60" onClick={() => handleInitialResponse(false)}>LUEGO</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'leads' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => handleLeadsCount(25, '0-50')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-[hsl(var(--profile-accent))] transition-colors">0 - 50</button>
                                        <button onClick={() => handleLeadsCount(125, '50-200')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-[hsl(var(--profile-accent))] transition-colors">50 - 200</button>
                                        <button onClick={() => handleLeadsCount(350, '200-500')} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-[hsl(var(--profile-accent))] transition-colors">200 - 500</button>
                                        <button onClick={() => handleLeadsCount(1000, '500+')} className="p-3 bg-[hsl(var(--profile-accent))]/20 border border-[hsl(var(--profile-accent))] rounded-xl text-xs font-black text-white hover:bg-[hsl(var(--profile-accent))] transition-colors">500+</button>
                                    </div>
                                )}

                                {bantStep === 'ticket' && (
                                    <div className="grid grid-cols-1 gap-3">
                                        <button onClick={() => handleTicket(45000, '< $50.000 CLP')} className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-black text-white hover:bg-red-500/20 transition-colors">BAJO TICKET</button>
                                        <button onClick={() => handleTicket(150000, '$150.000+ CLP')} className="p-4 bg-[hsl(var(--profile-accent))]/20 border border-[hsl(var(--profile-accent))] rounded-xl text-sm font-black text-white hover:bg-[hsl(var(--profile-accent))] transition-colors">TICKET PREMIUM</button>
                                    </div>
                                )}

                                {bantStep === 'authority' && (
                                    <div className="flex gap-3">
                                        <PremiumButton variant="primary" size="md" className="flex-1 font-black" onClick={() => handleAuthority(true)}>SOY DECISOR</PremiumButton>
                                        <PremiumButton variant="outline" size="md" className="flex-1" onClick={() => handleAuthority(false)}>SOCIOS</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'qualified' && qualified && (
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-4">
                                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest text-center">Score: Máxima Prioridad</p>
                                        </div>
                                        <PremiumButton
                                            variant="primary"
                                            size="lg"
                                            className="w-full shadow-lg shadow-[hsl(var(--profile-accent))]/40 py-6"
                                            onClick={() => window.location.href = '/demo?qualified=true'}
                                        >
                                            ACCEDER A LA DEMO TÉCNICA
                                        </PremiumButton>
                                    </motion.div>
                                )}

                                {bantStep === 'qualified' && !qualified && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                                        <p className="text-xs font-bold text-red-400">Acceso restringido: No cumples los requisitos mínimos para el motor de alta gama.</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
