'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCalendar, LucideClock, LucideUser, LucideFileText, LucideCheckCircle2, LucideLock, LucideTrendingUp, LucideArrowRight } from 'lucide-react';
import { PremiumButton } from '../ui/PremiumButton';
import { GlassCard } from '../ui/GlassCard';

interface SalesBookingWizardProps {
    isQualified: boolean;
}

import { usePsychographic } from '@/lib/hooks/use-psychographic';

export function SalesBookingWizard({ isQualified }: SalesBookingWizardProps) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [bookingDone, setBookingDone] = useState(false);
    const { profile } = usePsychographic();

    if (!isQualified) {
        return (
            <div className="py-24 px-6 relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

                <div className="max-w-[400px] mx-auto relative z-10 w-full">
                    <GlassCard className="w-full border-white/10 shadow-3xl text-center">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-8">
                            <LucideLock className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-white leading-none">Acceso Reservado</h3>

                        <p className="text-sm text-gray-400 mb-10 leading-relaxed font-medium">
                            El Motor de Ingresos de NeuroV tiene cupos limitados. Califica con nuestra IA para desbloquear la agenda.
                        </p>

                        <PremiumButton
                            variant="primary"
                            size="md"
                            className="w-full py-4 font-black"
                            onClick={() => {
                                const assistantBtn = document.querySelector('button.fixed.bottom-6.right-6, button.fixed.bottom-10.right-10') as HTMLButtonElement;
                                if (assistantBtn) assistantBtn.click();
                            }}
                        >
                            CALIFICAR CON CEREBRO IA
                        </PremiumButton>
                    </GlassCard>
                </div>
            </div>
        );
    }

    return (
        <div id="agenda" className="max-w-6xl mx-auto py-20 px-6">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--profile-accent))]/10 border border-[hsl(var(--profile-accent))]/20 rounded-full mb-4">
                    <LucideTrendingUp className="w-4 h-4 text-[hsl(var(--profile-accent))]" />
                    <span className="text-xs font-black text-[hsl(var(--profile-accent))] tracking-widest uppercase">Estatus: Lead Calificado para Motor de Ingresos</span>
                </div>
                <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
                    Agendar <span className="text-gradient">Demo Técnica</span>
                </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Visual Triggers Column */}
                <div className="lg:col-span-4 space-y-6">
                    <StepIndicator active={step === 1} completed={step > 1} number={1} label="Horario" />
                    <StepIndicator active={step === 2} completed={step > 2} number={2} label="Validación ROI" />
                    <StepIndicator active={step === 3} completed={bookingDone} number={3} label="Confirmar" />

                    <AnimatePresence>
                        {profile === 'impulsive' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl text-center"
                            >
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Urgencia Detectada</p>
                                <p className="text-white font-black text-lg">⚠️ ÚLTIMOS 3 CUPOS</p>
                                <p className="text-xs text-gray-400 mt-2">Para consultoría clínica este mes.</p>
                                <div className="mt-4 flex justify-center gap-1">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />)}
                                </div>
                            </motion.div>
                        )}

                        {(profile === 'hesitant' || profile === 'analytic') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl"
                            >
                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Prueba Social Técnica</p>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 shrink-0" />
                                        <p className="text-[10px] text-gray-300 italic">"La implementación de NeuroV redujo mi no-show del 30% al 4% en solo 60 días."</p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 shrink-0" />
                                        <p className="text-[10px] text-gray-300 italic">"Lo mejor es la seguridad pgsodium; mis datos de pacientes nunca han estado tan seguros."</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {!bookingDone ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {step === 1 && (
                                    <GlassCard className="p-6 sm:p-10 border-[hsl(var(--profile-accent))]/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 block">Calendario de Ingeniería</label>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {[24, 26, 27, 28].map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => setSelectedDate(`Dic ${d}`)}
                                                            className={`p-4 rounded-2xl border font-black text-sm transition-all ${selectedDate === `Dic ${d}` ? 'bg-[hsl(var(--profile-accent))] border-[hsl(var(--profile-accent))] text-white shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                                        >
                                                            {d}<br /><span className="text-[8px] opacity-40 uppercase">Dic</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 block">Horarios Disponibles (GMT-3)</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['09:00', '11:00', '15:30', '16:45'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setSelectedTime(t)}
                                                            className={`p-4 rounded-2xl border font-black text-sm transition-all ${selectedTime === t ? 'bg-[hsl(var(--profile-accent))] border-[hsl(var(--profile-accent))] text-white shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <PremiumButton
                                            disabled={!selectedDate || !selectedTime}
                                            className="w-full mt-8 sm:mt-12 py-6 sm:py-8 text-base sm:text-lg font-black"
                                            onClick={() => setStep(2)}
                                        >
                                            CONTINUAR A PROYECCIÓN ROI <LucideArrowRight className="ml-2 w-5 h-5" />
                                        </PremiumButton>
                                    </GlassCard>
                                )}

                                {step === 2 && (
                                    <GlassCard className="p-6 sm:p-10 border-[hsl(var(--profile-accent))]/30">
                                        <div className="bg-[hsl(var(--profile-accent))]/10 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] mb-8 sm:mb-10 flex flex-col sm:row items-center gap-4 sm:gap-8 border border-[hsl(var(--profile-accent))]/20 text-center sm:text-left">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[hsl(var(--profile-accent))] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl rotate-3 shrink-0">
                                                <LucideFileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white uppercase tracking-tighter text-xl sm:text-2xl italic">Protocolo de Retorno</h4>
                                                <p className="text-[10px] text-[hsl(var(--profile-accent))] font-black tracking-widest uppercase mt-1">Estimación Técnica Generada</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                                            <div className="p-4 sm:p-6 bg-black/40 rounded-2xl sm:rounded-3xl border border-white/10">
                                                <span className="text-gray-500 text-[8px] sm:text-[10px] uppercase font-black tracking-widest block mb-1 sm:mb-4">Eliminación No-Shows</span>
                                                <span className="text-green-400 font-black text-3xl sm:text-4xl">Garantizada</span>
                                            </div>
                                            <div className="p-4 sm:p-6 bg-black/40 rounded-2xl sm:rounded-3xl border border-white/10">
                                                <span className="text-gray-500 text-[8px] sm:text-[10px] uppercase font-black tracking-widest block mb-1 sm:mb-4">Escala de Conversión</span>
                                                <span className="text-[hsl(var(--profile-accent))] font-black text-3xl sm:text-4xl">UP TO 275%</span>
                                            </div>
                                            <div className="md:col-span-2 p-6 sm:p-8 bg-gradient-to-r from-[hsl(var(--profile-accent))]/10 to-transparent rounded-[1.5rem] sm:rounded-[2rem] border border-[hsl(var(--profile-accent))]/20 text-center">
                                                <span className="text-white font-black uppercase tracking-widest text-[10px] mb-2 block">Impacto Neto Est. Proyectado</span>
                                                <span className="text-white font-black text-3xl sm:text-5xl md:text-7xl tracking-tighter">$7.5M - $12.4M</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(1)} className="px-8 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all">Atras</button>
                                            <PremiumButton variant="primary" className="flex-1 font-black shadow-lg shadow-[hsl(var(--profile-accent))]/30" onClick={() => setBookingDone(true)}>CONFIRMAR DIAGNÓSTICO LIVE</PremiumButton>
                                        </div>
                                    </GlassCard>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto mb-8 animate-bounce">
                                    <LucideCheckCircle2 className="w-12 h-12" />
                                </div>
                                <h3 className="text-4xl font-black mb-4">Agendamiento de Éxito</h3>
                                <p className="text-gray-400 mb-10 max-w-sm mx-auto">
                                    Hemos enviado el Informe de ROI a tu email y WhatsApp. Tu sesión estratégica está confirmada para el <span className="text-white font-bold">{selectedDate}</span> a las <span className="text-white font-bold">{selectedTime}</span>.
                                </p>
                                <PremiumButton variant="secondary" onClick={() => (window.location.href = '/')}>VOLVER AL INICIO</PremiumButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ active, completed, number, label }: { active: boolean, completed: boolean, number: number, label: string }) {
    return (
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border flex items-center gap-4 sm:gap-6 transition-all duration-500 ${active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-black transition-all ${completed ? 'bg-green-500 text-white' : active ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-500'} shrink-0`}>
                {completed ? <LucideCheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : number}
            </div>
            <div>
                <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${active ? 'text-indigo-300' : 'text-gray-600'}`}>PASO {number}</p>
                <p className={`text-sm sm:text-base font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</p>
            </div>
        </div>
    );
}
