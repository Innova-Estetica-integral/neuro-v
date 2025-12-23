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
        { role: 'bot', content: 'Hola, soy el Asistente de Crecimiento de NeuroV. ¿Te gustaría saber cómo podemos eliminar los no-shows en tu clínica?' }
    ]);
    const [bantStep, setBantStep] = useState<BantStep>('initial');
    const [qualified, setQualified] = useState(false);
    const { profile, forceClassify } = usePsychographic();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle Voice (Web Speech API)
    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CL';
            utterance.rate = 1.0;
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
        setMessages(prev => [...prev, { role: 'user', content: response ? 'Sí, quiero saber más.' : 'No, solo estoy mirando.' }]);

        if (response) {
            const currentProfile = forceClassify();
            const adaptiveIntro = currentProfile === 'analytic'
                ? 'Excelente. Basados en tu interés técnico, te contaré cómo nuestro motor de cobro asegurado bajo normativa vigente protege tu flujo de caja.'
                : '¡Perfecto! Vamos directo al grano: estamos recuperando hasta un 45% de ingresos perdidos por inasistencias en tiempo récord.';

            addBotMessage(adaptiveIntro);

            setTimeout(() => {
                addBotMessage('Para ver si podemos ayudarte, necesito hacerte 3 preguntas rápidas. ¿Cuántos leads promedio recibes al mes?');
                setBantStep('leads');
            }, 1000);
        } else {
            addBotMessage('Entiendo. Estaré por aquí si cambias de opinión para acelerar tu facturación.');
        }
    };

    const handleLeadsCount = (count: string) => {
        setMessages(prev => [...prev, { role: 'user', content: `${count} leads` }]);
        addBotMessage('Entendido. ¿Cuál es el ticket promedio de tus tratamientos estrella?');
        setBantStep('ticket');
    };

    const handleTicket = (ticket: string) => {
        setMessages(prev => [...prev, { role: 'user', content: `$${ticket}` }]);
        addBotMessage('Última pregunta: ¿Eres tú quien toma las decisiones comerciales o hay otros socios involucrados?');
        setBantStep('authority');
    };

    const handleAuthority = (isDecider: boolean) => {
        setMessages(prev => [...prev, { role: 'user', content: isDecider ? 'Yo decido.' : 'Hay socios adicionales.' }]);
        setQualified(true);
        setBantStep('qualified');

        const finalMessage = '¡Felicidades! Tu clínica califica como Lead de Alta Prioridad. Basados en tus datos, estimamos un ROI del 214% en el primer semestre usando NeuroV. ¿Agendamos una demo para proyectar tu ROI real?';
        addBotMessage(finalMessage);
    };

    return (
        <>
            {/* Toggle Button */}
            <div className="fixed bottom-8 right-8 z-[200]">
                <PremiumButton
                    variant="primary"
                    className="w-16 h-16 rounded-full shadow-2xl shine-effect p-0"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen && messages.length === 1) speak(messages[0].content);
                    }}
                >
                    {isOpen ? <LucideX className="w-8 h-8" /> : <LucideMessageSquare className="w-8 h-8" />}
                </PremiumButton>
                {isSpeaking && (
                    <div className="absolute -top-3 -right-1">
                        <span className="flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-500 flex items-center justify-center">
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
                        className="fixed bottom-32 right-8 w-[400px] z-[200] max-h-[600px] flex flex-col"
                    >
                        <GlassCard className="h-full flex flex-col border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.2)] p-0">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 bg-indigo-500/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <LucideSmile className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white uppercase tracking-tight">Ventas NeuroV</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">En Línea</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[400px] custom-scrollbar"
                            >
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${m.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions / Inputs */}
                            <div className="p-6 bg-white/5 border-t border-white/5">
                                {bantStep === 'initial' && (
                                    <div className="flex gap-3">
                                        <PremiumButton variant="secondary" size="sm" className="flex-1" onClick={() => handleInitialResponse(true)}>Crecimiento</PremiumButton>
                                        <PremiumButton variant="outline" size="sm" className="flex-1" onClick={() => handleInitialResponse(false)}>Ver más tarde</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'leads' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <PremiumButton variant="outline" size="sm" onClick={() => handleLeadsCount('1-50')}>1-50</PremiumButton>
                                        <PremiumButton variant="outline" size="sm" onClick={() => handleLeadsCount('50-200')}>50-200</PremiumButton>
                                        <PremiumButton variant="outline" size="sm" onClick={() => handleLeadsCount('200-500')}>200-500</PremiumButton>
                                        <PremiumButton variant="primary" size="sm" onClick={() => handleLeadsCount('500+')}>500+</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'ticket' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <PremiumButton variant="outline" size="sm" onClick={() => handleTicket('50k - 100k')}>50k - 100k</PremiumButton>
                                        <PremiumButton variant="primary" size="sm" onClick={() => handleTicket('150k+')}>150k+</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'authority' && (
                                    <div className="flex gap-3">
                                        <PremiumButton variant="primary" size="sm" className="flex-1" onClick={() => handleAuthority(true)}>Yo decido</PremiumButton>
                                        <PremiumButton variant="outline" size="sm" className="flex-1" onClick={() => handleAuthority(false)}>Somos varios</PremiumButton>
                                    </div>
                                )}

                                {bantStep === 'qualified' && (
                                    <PremiumButton
                                        variant="primary"
                                        size="lg"
                                        className="w-full shadow-indigo-500/50"
                                        onClick={() => window.location.href = '/clinic-alpha?qualified=true'}
                                    >
                                        AGENDAR SESIÓN ESTRATÉGICA
                                    </PremiumButton>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
