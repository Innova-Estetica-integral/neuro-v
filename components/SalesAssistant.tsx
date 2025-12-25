'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMessageSquare, LucideX, LucideMic, LucideVolume2, LucideSend, LucideCheckCircle2, LucideTrendingUp, LucideSmile, LucideBrainCircuit } from 'lucide-react';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { PsychProfile } from '@/lib/ai/psychographic-profiler';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';
import { CyberAvatar } from './CyberAvatar';
import { analytics } from '@/lib/analytics/tracker';

type Message = {
    role: 'bot' | 'user';
    content: string;
};

type BantStep = 'initial' | 'leads' | 'ticket' | 'authority' | 'qualified';

export function SalesAssistant({ mode = 'technical' }: { mode?: 'technical' | 'growth' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Track when assistant is opened
    const handleOpen = () => {
        setIsOpen(true);
        analytics.salesAssistant.opened(mode);
    };

    const initialMessage = "Hola, soy Donna, la asistente virtual de Neuro-Ve.\n\nMi objetivo es simple: liberarte de la gestión operativa y el marketing, para que tú te enfoques en crecer, mientras tu negocio avanza en piloto automático. Diagnosticaré y crearé una estrategia para escalar tu negocio.";

    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: initialMessage }
    ]);
    const [bantStep, setBantStep] = useState<BantStep>('initial');
    const [qualified, setQualified] = useState(false);
    const [stats, setStats] = useState({ leads: 0, ticket: 0 });
    const [isThinking, setIsThinking] = useState(false);
    const { profile, forceClassify } = usePsychographic();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    // Debug: verificar que el componente se renderiza
    useEffect(() => {
        console.log('🤖 SalesAssistant renderizado en modo:', mode);
    }, [mode]);

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();

            // Wait a tiny bit for the cancel to process
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(text);

                // Sound Design: Human-like configuration
                const voices = window.speechSynthesis.getVoices();
                // Prioritize high-quality neural FEMALE voices
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
                utterance.rate = 0.98; // Slightly slower for better articulation
                utterance.pitch = 1.05; // Slightly warmer tone
                utterance.volume = 1;

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);

                window.speechSynthesis.speak(utterance);
            }, 100);
        }
    };

    const addBotMessage = (content: string, shouldSpeak = true) => {
        setIsThinking(true);
        const delay = Math.min(2000, Math.max(800, content.length * 15)); // Dynamic realistic delay

        setTimeout(() => {
            setIsThinking(false);
            setMessages(prev => [...prev, { role: 'bot', content }]);
            if (shouldSpeak) speak(content);
        }, delay);
    };

    const getAdaptiveMessage = (step: string, context?: any) => {
        const messages: Record<string, Record<PsychProfile, string>> = {
            intro: {
                analytic: 'Iniciando mi auditoría BANT. Voy a diseccionar tu flujo de pacientes para encontrar el ROI escondido.',
                impulsive: 'Me gusta tu velocidad. Vamos directo a las oportunidades de dinero que estás ignorando hoy.',
                price_sensitive: 'Sabes que cada peso cuenta. Mi meta es que tu sistema se pague solo antes de que termine el mes.',
                hesitant: 'Tranquila, estás en buenas manos. Haré un diagnóstico honesto para ver si estás lista para el siguiente nivel.'
            },
            leads_q: {
                analytic: 'Primero, la base: ¿Cuántos pacientes nuevos entran al mes? Sé precisa, los decimales importan.',
                impulsive: 'Dame el número: ¿Cuántos pacientes nuevos recibes mensualmente?',
                price_sensitive: 'Hablemos de escala: ¿Cuántos contactos comerciales generas al mes?',
                hesitant: 'Empecemos por lo básico: ¿Cuántos interesados llegan a tu clínica cada mes?'
            },
            ticket_q: {
                analytic: 'Correcto. Ahora el ticket promedio. ¿Cuál es el valor real de tus procedimientos estrella?',
                impulsive: '¿Cuánto te paga un paciente promedio? Dame el número de tus tratamientos principales.',
                price_sensitive: 'Necesito ver el margen. ¿Cuál es el valor promedio de tus servicios?',
                hesitant: 'Vamos bien. ¿Qué valor suele tener un tratamiento promedio en tu consulta?'
            },
            authority_q: {
                analytic: 'Soy Donna, así que hablo con quien decide. ¿Tienes autoridad total o debo convencer a tus socios?',
                impulsive: 'Última pregunta: ¿Eres tú quien tiene la última palabra o hay socios en el camino?',
                price_sensitive: '¿Decides tú la inversión o es una decisión compartida?',
                hesitant: 'Finalmente: ¿Eres tú el pilar de decisiones o compartes esa responsabilidad estratégica?'
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
            }, 12000); // Adjusted to 12 seconds
        } else {
            addBotMessage('Entiendo. La ineficiencia es costosa. Estaré aquí cuando decidas detener la fuga de ingresos.');
        }
    };

    const handleLeadsCount = (countAtStep: number, label: string) => {
        setStats(prev => ({ ...prev, leads: countAtStep }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);

        const reaction = countAtStep > 200
            ? (profile === 'analytic' ? 'Volumen significativo detectado. Optimizaremos la conversión.' : 'Excelente volumen. Hay gran potencial de optimización aquí.')
            : (profile === 'analytic' ? 'Volumen base. Enfoque en maximizar el valor de cada prospecto.' : 'Buen flujo. Vamos a maximizar la conversión de cada lead.');

        addBotMessage(reaction, false);

        setTimeout(() => {
            addBotMessage(getAdaptiveMessage('ticket_q'));
            setBantStep('ticket');
        }, 3000); // 3 seconds gap
    };

    const handleTicket = (price: number, label: string) => {
        setStats(prev => ({ ...prev, ticket: price }));
        setMessages(prev => [...prev, { role: 'user', content: label }]);

        const potentialFuga = stats.leads * 0.25 * price; // 25% avg no-show
        const reaction = price > 100000
            ? (profile === 'analytic' ? 'Servicios Premium confirmados. El riesgo financiero por inasistencia es alto.' : 'Servicios premium. El impacto de cada no-show es significativo.')
            : (profile === 'analytic' ? 'Servicios estándar. Buscaremos escalabilidad estructural.' : 'Perfecto. Optimizaremos la confirmación de cada cita.');

        addBotMessage(reaction, false);

        setTimeout(() => {
            addBotMessage(getAdaptiveMessage('authority_q'));
            setBantStep('authority');
        }, 3000); // 3 seconds gap
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

        // Track qualification result
        const qualificationStatus = isElite ? 'elite' : 'growth';
        analytics.salesAssistant.qualified(qualificationStatus, potentialMonthlyRevenue);
        analytics.salesAssistant.stepCompleted('authority', {
            isDecider,
            isElite,
            potentialMonthlyRevenue,
            qualificationStatus
        });

        if (isElite) {
            const closing = {
                analytic: `AUDITORÍA POSITIVA: He identificado una fuga de $${(potentialWaste / 1000000).toFixed(1)}M mensuales. Tu estructura es ELITE. No pierdas más tiempo, hablemos de implementación.`,
                impulsive: `¡DIAGNÓSTICO CRÍTICO! Estás quemando $${(potentialWaste / 1000).toFixed(0)} mil pesos al mes. Eres categoría ELITE. Reserva tu sesión técnica ahora, yo me encargo del resto.`,
                price_sensitive: `ROI PROYECTADO: 5.2x. El sistema se paga solo rescatando a tu primer paciente. Tu clínica merece el estándar ELITE.`,
                hesitant: `EXCELENTES NOTICIAS. Tu clínica es una máquina robusta. Es el momento de blindarla. Hagamos esa demo técnica pronto.`
            };
            addBotMessage(closing[profile]);
        } else {
            const highGrowth = {
                analytic: `DIAGNÓSTICO: ALTO POTENCIAL. Veo una oportunidad de $${(potentialWaste / 1000).toFixed(0)} mil pesos adicionales al mes. Calificas para mi plan de Crecimiento Acelerado.`,
                impulsive: `¡TIENES UN POTENCIAL MASIVO! Vamos a detener esa fuga de dinero hoy mismo. Agenda tu sesión y hablemos de escala.`,
                price_sensitive: `EVALUACIÓN POSITIVA: NeuroV escalará tu rentabilidad de inmediato. Es la inversión más inteligente que harás este año.`,
                hesitant: `TODO LISTO. NeuroV te dará la seguridad para dar el siguiente paso. Eres elegible para mi demo técnica personalizada.`
            };
            addBotMessage(highGrowth[profile]);

            if (!isDecider) {
                addBotMessage("Tip: Como consultas con socios, ya preparé un reporte de impacto para que los dejes sin palabras en la sesión.");
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
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_32px_rgba(99,102,241,0.4)] flex items-center justify-center z-[250] text-white cursor-pointer"
                onClick={() => {
                    if (!isOpen) {
                        handleOpen();
                        if (messages.length === 1) speak(messages[0].content);
                    } else {
                        setIsOpen(false);
                    }
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
                        className="fixed inset-4 sm:left-auto sm:right-8 sm:bottom-8 sm:top-8 sm:w-[420px] z-[200] flex flex-col"
                    >
                        <div className="h-full flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0f1e]/60 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative">
                            {/* Video de fondo */}
                            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] z-0">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-30"
                                >
                                    <source src="/grok-video-d03d2654.mp4" type="video/mp4" />
                                    <source src="/grok-video-d03d2654.webm" type="video/webm" />
                                </video>
                                {/* Overlay oscuro para legibilidad */}
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
                            </div>

                            {/* Contenido del chat - ahora con z-index mayor */}
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Seamless Header */}
                                <div className="p-8 pb-4 flex items-center gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />
                                    {/* Avatar cibernético */}
                                    <div className="relative z-10">
                                        <CyberAvatar size={64} isActive={isSpeaking} />
                                    </div>
                                    <div className="relative z-10 flex-1">
                                        <h4 className="font-black text-white uppercase tracking-tighter text-lg leading-none mb-1">Donna - Directora OPS</h4>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                            <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">
                                                {isSpeaking ? 'Hablando...' : 'En Línea'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Transparent Message Area */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar"
                                >
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start gap-3'} animate-in fade-in slide-in-from-bottom-2`}>
                                            {/* Avatar del bot */}
                                            {m.role === 'bot' && (
                                                <div className="shrink-0">
                                                    <CyberAvatar size={32} isActive={false} />
                                                </div>
                                            )}
                                            <div className={`max-w-[75%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed backdrop-blur-xl ${m.role === 'user'
                                                ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/40 text-indigo-100 rounded-tr-none shadow-lg shadow-indigo-500/20'
                                                : 'bg-white/10 border border-cyan-400/30 text-cyan-50 rounded-tl-none shadow-lg shadow-cyan-500/10'
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
                                                onClick={() => {
                                                    analytics.salesAssistant.ctaClicked('/demo?qualified=true');
                                                    window.location.href = '/demo?qualified=true';
                                                }}
                                            >
                                                ACCEDER AL PROTOCOLO
                                            </PremiumButton>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div> {/* Cierre del contenedor con video */}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
