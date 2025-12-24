'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideX, LucideMic, LucideVolume2, LucideSend, LucideCheckCircle2, LucideTrendingUp, LucideSmile, LucideBrainCircuit } from 'lucide-react';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { PsychProfile } from '@/lib/ai/psychographic-profiler';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';

type Message = {
    role: 'bot' | 'user';
    content: string;
};

type BantStep = 'initial' | 'leads' | 'ticket' | 'authority' | 'qualified';

export function SalesAssistant({ mode = 'technical' }: { mode?: 'technical' | 'growth' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const initialMessage = mode === 'technical'
        ? 'Protocolo de Auditoría NeuroV activo. ¿Iniciamos el diagnóstico de interoperabilidad y conversión?'
        : '¡Hola! Soy tu Cerebro de Ventas. ¿Quieres ver cuánta plata estás dejando sobre la mesa y cómo podemos recuperarla hoy?';

    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: initialMessage }
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

    const getAdaptiveMessage = (step: string, context?: any) => {
        const messages: Record<string, Record<PsychProfile, string>> = {
            intro: {
                analytic: 'Protocolo de auditoría BANT iniciado. Analizando viabilidad técnica e interoperabilidad de su flujo de pacientes.',
                impulsive: '¡Perfecto! Vamos a ver cuánta plata estás dejando sobre la mesa ahora mismo. Hagamos el scanner.',
                price_sensitive: 'Excelente decisión. El objetivo es maximizar tu ROI reduciendo costos operativos por inasistencias.',
                hesitant: 'No se preocupe, es un diagnóstico preventivo. Vamos paso a paso para evaluar si NeuroV es adecuado para usted.'
            },
            leads_q: {
                analytic: 'Pregunta 1/3: ¿Cuál es su volumen promedio de adquisición de prospectos (leads) mensuales?',
                impulsive: 'Primero: ¿Cuánta gente te escribe al mes preguntando por servicios? (Leads)',
                price_sensitive: 'Para calcular el retorno: ¿Cuántos contactos generas mensualmente hoy?',
                hesitant: 'Para empezar, cuéntenos más o menos cuántos interesados recibe su clínica cada mes.'
            },
            ticket_q: {
                analytic: 'Pregunta 2/3: Para el cálculo de rentabilidad, ¿cuál es el ticket promedio de sus procedimientos de alta gama?',
                impulsive: 'Bien. Cuando vendes algo premium, ¿cuánto cuesta ese tratamiento? (Aprox)',
                price_sensitive: '¿De cuánto es el valor de tus servicios con mayor margen de utilidad?',
                hesitant: 'Entiendo. ¿Y cuál suele ser el valor promedio de sus tratamientos principales?'
            },
            authority_q: {
                analytic: 'Pregunta 3/3: ¿Posee usted la facultad de firma para implementaciones de arquitectura digital o requiere validación de socios?',
                impulsive: 'Última: ¿Tú eres quien manda o tienes que pedirle permiso a alguien para ganar más plata hoy?',
                price_sensitive: 'Finalmente: ¿Eres el tomador de decisiones o el encargado de evaluar la inversión?',
                hesitant: 'Y por último, para saber cómo proceder: ¿Es usted quien decide las nuevas tecnologías o lo ve con un equipo?'
            }
        };
        return messages[step][profile];
    };

    const handleInitialResponse = (response: boolean) => {
        setMessages(prev => [...prev, { role: 'user', content: response ? 'Empecemos el diagnóstico.' : 'Ahora no.' }]);

        if (response) {
            const currentProfile = forceClassify();
            addBotMessage(getAdaptiveMessage('intro'));

            setTimeout(() => {
                addBotMessage(getAdaptiveMessage('leads_q'));
                setBantStep('leads');
            }, 1000);
        } else {
            addBotMessage('Entiendo. La ineficiencia es costosa. Estaré aquí cuando decidas detener la fuga de ingresos.');
        }
    };

    const handleLeadsCount = (countAtStep: number, label: string) => {
        setStats(prev => ({ ...prev, leads: countAtStep }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);

        const reaction = countAtStep > 200
            ? (profile === 'analytic' ? 'Volumen significativo detectado. Optimizaremos la conversión.' : '¡Eso es mucha gente! Estás perdiendo una fortuna en no-shows.')
            : (profile === 'analytic' ? 'Volumen base. Enfoque en maximizar el valor de cada prospecto.' : 'Buen flujo. Vamos a blindar ese agendamiento.');

        addBotMessage(reaction, false);

        setTimeout(() => {
            addBotMessage(getAdaptiveMessage('ticket_q'));
            setBantStep('ticket');
        }, 800);
    };

    const handleTicket = (price: number, label: string) => {
        setStats(prev => ({ ...prev, ticket: price }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);

        const potentialFuga = stats.leads * 0.25 * price; // 25% avg no-show
        const reaction = price > 100000
            ? (profile === 'analytic' ? 'Servicios Premium confirmados. El riesgo financiero por inasistencia es alto.' : '¡Wow! Con esos precios, cada paciente que no llega es un golpe duro al bolsillo.')
            : (profile === 'analytic' ? 'Servicios estándar. Buscaremos escalabilidad estructural.' : 'Entiendo. Vamos a asegurar que nadie se pierda su cita.');

        addBotMessage(reaction, false);

        setTimeout(() => {
            addBotMessage(getAdaptiveMessage('authority_q'));
            setBantStep('authority');
        }, 800);
    };

    const handleAuthority = (isDecider: boolean) => {
        setMessages(prev => [...prev, { role: 'user', content: isDecider ? 'Tengo autoridad total.' : 'Consulto con socios.' }]);

        // ADVANCED QUALIFICATION ENGINE (Optimized for maximum conversion)
        const potentialMonthlyRevenue = stats.leads * stats.ticket;
        const potentialWaste = potentialMonthlyRevenue * 0.20; // 20% waste estimation

        // Inclusive Logic: If you have business, you qualify.
        // We use "status" to keep the premium feel without rejecting anyone.
        const isElite = stats.ticket >= 150000 && potentialMonthlyRevenue >= 5000000;

        // EVERYONE qualifies for a demo as long as they have some potential
        const isQualified = potentialMonthlyRevenue > 0;

        setQualified(isQualified);
        setBantStep('qualified');

        if (isElite) {
            const closing = {
                analytic: `AUDITORÍA POSITIVA (CATEGORÍA ELITE): Detectamos una fuga estimada de $${(potentialWaste / 1000000).toFixed(1)}M mensuales. Su estructura es prioritaria para integración técnica.`,
                impulsive: `¡DIAGNÓSTICO CRÍTICO! Estás perdiendo casi $${(potentialWaste / 1000).toFixed(0)} mil pesos al mes. Tu clínica es categoría ELITE. Reserva tu cupo técnico ahora.`,
                price_sensitive: `ROI PROYECTADO: 5.2x. El sistema se paga solo con el primer paciente rescatado. Su clínica califica para nuestro programa de alto impacto.`,
                hesitant: `EXCELENTES NOTICIAS. Tras el análisis, confirmamos que su clínica posee una estructura robusta. Es el momento perfecto para blindar sus ingresos.`
            };
            addBotMessage(closing[profile]);
        } else {
            const highGrowth = {
                analytic: `DIAGNÓSTICO: ALTO POTENCIAL. Hemos identificado una oportunidad de optimización de ingresos de $${(potentialWaste / 1000).toFixed(0)} mil pesos. Califica para nuestro programa de Crecimiento Acelerado.`,
                impulsive: `¡BUENAS NOTICIAS! Tienes un potencial de crecimiento masivo. Vamos a detener esa fuga de dinero hoy mismo. Agenda tu sesión técnica.`,
                price_sensitive: `EVALUACIÓN POSITIVA: NeuroV escalará su rentabilidad de forma inmediata. Su clínica califica para el acceso de implementación rápida.`,
                hesitant: `TODO LISTO. Hemos verificado que NeuroV puede ayudarle a dar el siguiente paso con total seguridad. Su clínica es elegible para nuestra demo técnica.`
            };
            addBotMessage(highGrowth[profile]);

            if (!isDecider) {
                addBotMessage("Tip: Como consulta con socios, le enviaremos un reporte de impacto para que puedan evaluarlo juntos en la sesión.");
            }
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
                                        {[
                                            { range: '0-50', val: 25 },
                                            { range: '50-200', val: 125 },
                                            { range: '200-500', val: 350 },
                                            { range: '500+', val: 600 }
                                        ].map((item) => (
                                            <button
                                                key={item.range}
                                                onClick={() => handleLeadsCount(item.val, `${item.range} Leads`)}
                                                className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white hover:bg-indigo-600 transition-all uppercase tracking-widest"
                                            >
                                                {item.range} Leads
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {bantStep === 'ticket' && (
                                    <div className="grid grid-cols-1 gap-3">
                                        <button onClick={() => handleTicket(45000, 'Ticket Estándar (< $50k)')} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white hover:bg-red-500/20 transition-all uppercase tracking-widest">Procedimientos Estándar</button>
                                        <button onClick={() => handleTicket(180000, 'Ticket Premium ($150k+)')} className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-[10px] font-black text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all uppercase tracking-widest">Tratamientos Alta Gama</button>
                                    </div>
                                )}

                                {bantStep === 'authority' && (
                                    <div className="flex flex-col gap-3">
                                        <PremiumButton variant="primary" size="md" className="w-full font-black rounded-2xl py-4" onClick={() => handleAuthority(true)}>SOY DECISOR</PremiumButton>
                                        <button className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2" onClick={() => handleAuthority(false)}>TENGO SOCIOS</button>
                                    </div>
                                )}

                                {bantStep === 'qualified' && (
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
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
