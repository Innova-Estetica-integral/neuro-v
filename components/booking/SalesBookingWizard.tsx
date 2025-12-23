'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCalendar, LucideClock, LucideUser, LucideFileText, LucideCheckCircle2, LucideLock, LucideTrendingUp, LucideArrowRight } from 'lucide-react';
import { PremiumButton } from '../ui/PremiumButton';
import { GlassCard } from '../ui/GlassCard';

interface SalesBookingWizardProps {
    isQualified: boolean;
}

export function SalesBookingWizard({ isQualified }: SalesBookingWizardProps) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [bookingDone, setBookingDone] = useState(false);

    if (!isQualified) {
        return (
            <GlassCard className="max-w-4xl mx-auto py-20 text-center border-red-500/20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mx-auto mb-6">
                    <LucideLock className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-4">Acceso Reservado</h3>
                <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed capitalize">
                    Para mantener la exclusividad de nuestro motor de ingresos, solo agendamos demos con directores calificados. Habla con nuestro asistente virtual para calificar.
                </p>
                <PremiumButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                        // Logic to open assistant if it was closed
                        const assistantBtn = document.querySelector('button.btn-premium.w-16.h-16') as HTMLButtonElement;
                        if (assistantBtn) assistantBtn.click();
                    }}
                >
                    HABLAR CON ASISTENTE
                </PremiumButton>
            </GlassCard>
        );
    }

    return (
        <div id="booking-wizard" className="max-w-5xl mx-auto py-20 px-6">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                    <LucideTrendingUp className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black text-indigo-300 tracking-widest uppercase text-gradient">Status: Lead de Alta Prioridad</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic">Agenda tu Sesión Estratégica</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Steps Sidebar */}
                <div className="space-y-4">
                    <StepIndicator active={step === 1} completed={step > 1} number={1} label="Selección de Horario" />
                    <StepIndicator active={step === 2} completed={step > 2} number={2} label="Validación ROI Proyectado" />
                    <StepIndicator active={step === 3} completed={bookingDone} number={3} label="Confirmación" />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!bookingDone ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {step === 1 && (
                                    <GlassCard className="p-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Fecha</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[24, 25, 26, 27].map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => setSelectedDate(`Dic ${d}`)}
                                                            className={`p-3 rounded-xl border font-bold text-sm transition-all ${selectedDate === `Dic ${d}` ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                                        >
                                                            {d}<br /><span className="text-[8px] opacity-40">DIC</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Hora</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['10:00', '11:00', '15:30', '17:00'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setSelectedTime(t)}
                                                            className={`p-3 rounded-xl border font-bold text-sm transition-all ${selectedTime === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <PremiumButton
                                            disabled={!selectedDate || !selectedTime}
                                            className="w-full mt-10"
                                            onClick={() => setStep(2)}
                                        >
                                            CONTINUAR A ROI
                                        </PremiumButton>
                                    </GlassCard>
                                )}

                                {step === 2 && (
                                    <GlassCard className="p-8 border-indigo-500/30">
                                        <div className="bg-indigo-500/10 p-6 rounded-3xl mb-8 flex items-center gap-6">
                                            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center">
                                                <LucideFileText className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white uppercase italic">Informe ROI Proyectado</h4>
                                                <p className="text-xs text-indigo-300 font-bold tracking-widest uppercase">Listo para la sesión</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6 mb-10 text-sm">
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <span className="text-gray-400">Recuperación No-Shows</span>
                                                <span className="text-green-400 font-black">+143%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <span className="text-gray-400">Escalabilidad de Ingresos</span>
                                                <span className="text-cyan-400 font-black">2.4x</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-indigo-500/20">
                                                <span className="text-white font-bold">Aumento Facturación Est.</span>
                                                <span className="text-indigo-400 font-black text-xl">$4.2M - $8.1M</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5">Volver</button>
                                            <PremiumButton className="flex-1" onClick={() => setBookingDone(true)}>CONFIRMAR ASESORÍA</PremiumButton>
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
        <div className={`p-6 rounded-3xl border flex items-center gap-6 transition-all duration-500 ${active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${completed ? 'bg-green-500 text-white' : active ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                {completed ? <LucideCheckCircle2 className="w-6 h-6" /> : number}
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-indigo-300' : 'text-gray-600'}`}>PASO {number}</p>
                <p className={`font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</p>
            </div>
        </div>
    );
}
