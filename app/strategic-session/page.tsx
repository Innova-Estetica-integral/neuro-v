'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideCalendar,
    LucideUser,
    LucideMail,
    LucideCheckCircle,
    LucideChevronRight,
    LucideClock,
    LucideArrowLeft,
    BrainCircuit
} from 'lucide-react';
import { DatePicker } from '@mantine/dates';
import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';

export default function StrategicSessionPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: null as Date | null,
        time: ''
    });

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const d = params.get('date');
        const t = params.get('time');

        if (d || t) {
            setFormData(prev => ({
                ...prev,
                date: d ? new Date(d + 'T12:00:00') : prev.date,
                time: t || prev.time
            }));
            // If we have date and time, we could potentially skip to step 1 (identity)
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookingLink, setBookingLink] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/booking/b2b', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    date: formData.date?.toISOString().split('T')[0],
                    time: formData.time
                })
            });

            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                setBookingLink(data.link);
                setStep(3);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-indigo-100 p-6 md:p-12">
            <nav className="max-w-7xl mx-auto mb-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-600 transition-colors">
                        <BrainCircuit size={20} />
                    </div>
                    <span className="font-black tracking-tighter text-xl uppercase text-slate-900">
                        Neuro<span className="text-indigo-600">V</span> <span className="text-slate-400 font-bold ml-1 text-sm">B2B</span>
                    </span>
                </Link>
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">
                    <LucideArrowLeft size={14} /> Volver
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center">
                                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">PASO 01 // IDENTIDAD</span>
                                <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-tight mb-6 text-slate-900">Sesión Estratégica.</h1>
                                <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">Comencemos por conocerte. ¿Con quién tendremos el placer de hablar?</p>
                            </div>


                            <div className="relative max-w-2xl mx-auto">
                                {/* Strong shadow layer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[3rem] blur-2xl translate-y-8" />

                                <GlassCard
                                    hoverIntensity="none"
                                    className="relative p-12 md:p-16 !bg-white hover:!bg-white border border-slate-300 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] hover:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.4)] rounded-[3rem] transition-all duration-300"
                                >
                                    {/* Header with icon */}
                                    <div className="text-center mb-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
                                            <LucideUser className="text-white" size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Información de Contacto</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Name Field */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">
                                                Nombre Completo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                    <LucideUser className="text-indigo-600" size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Ej. Dr. Claudio Castro"
                                                    className="w-full pl-20 pr-6 py-5 bg-white border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 text-lg placeholder:text-slate-400 shadow-sm hover:border-indigo-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">
                                                Email Corporativo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                    <LucideMail className="text-indigo-600" size={20} />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="doctor@clinica.com"
                                                    className="w-full pl-20 pr-6 py-5 bg-white border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 text-lg placeholder:text-slate-400 shadow-sm hover:border-indigo-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-10">
                                        <PremiumButton
                                            disabled={!formData.name || !formData.email}
                                            variant="primary"
                                            className="w-full py-6 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all"
                                            onClick={() => setStep(2)}
                                        >
                                            CONTINUAR AL CALENDARIO
                                            <LucideChevronRight size={20} className="inline ml-3" />
                                        </PremiumButton>
                                    </div>

                                    {/* Progress indicator */}
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <div className="w-8 h-1.5 bg-indigo-600 rounded-full" />
                                        <div className="w-8 h-1.5 bg-slate-200 rounded-full" />
                                        <div className="w-8 h-1.5 bg-slate-200 rounded-full" />
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center">
                                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">PASO 02 // AGENDA</span>
                                <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-none mb-6">Bloquea tu Espacio.</h1>
                            </div>

                            <GlassCard
                                hoverIntensity="none"
                                className="p-8 md:p-12 !bg-white hover:!bg-white border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] flex flex-col md:row gap-12 rounded-[3rem] transition-shadow duration-300"
                            >
                                <div className="flex-1 flex justify-center">
                                    <DatePicker
                                        value={formData.date}
                                        onChange={(val) => setFormData({ ...formData, date: val as Date | null })}
                                        minDate={new Date()}
                                        size="lg"
                                    />
                                </div>
                                <div className="w-full md:w-64 space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horarios Disponibles (GMT-3)</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['09:00', '10:30', '14:00', '16:30'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, time: t })}
                                                className={`py-4 rounded-xl border font-bold transition-all ${formData.time === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-50 border-gray-100 hover:border-indigo-200'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <PremiumButton
                                        disabled={!formData.date || !formData.time || loading}
                                        variant="primary"
                                        className="w-full py-6 rounded-2xl text-xs uppercase tracking-widest"
                                        onClick={handleSubmit}
                                    >
                                        {loading ? 'AGENDANDO...' : 'CONFIRMAR SESIÓN'}
                                    </PremiumButton>
                                    <button onClick={() => setStep(1)} className="w-full text-center text-gray-400 text-[10px] font-black uppercase tracking-widest pt-2">Volver</button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <LucideCheckCircle className="text-green-600" size={48} />
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none">¡Todo Listo!</h2>
                            <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto">Recibirás una invitación en tu correo electrónico con el link de Google Meet.</p>

                            <GlassCard
                                hoverIntensity="none"
                                className="p-8 !bg-white hover:!bg-white border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] max-w-md mx-auto space-y-4 rounded-[3rem] transition-shadow duration-300"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <LucideClock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha y Hora</p>
                                        <p className="font-bold">{formData.date?.toLocaleDateString()} - {formData.time} (UTC-3)</p>
                                    </div>
                                </div>
                                <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors">
                                    Ver en Google Calendar
                                </a>
                            </GlassCard>

                            <Link href="/">
                                <button className="mt-12 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Volver a la Home</button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
