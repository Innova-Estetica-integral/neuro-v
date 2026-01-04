'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideInstagram,
    LucideBrain,
    LucideShieldCheck,
    LucideMessageSquare,
    LucideCreditCard,
    LucideCalendarCheck,
    LucideSparkles,
    LucideTrendingUp,
    LucideTarget,
    LucideRepeat,
    LucideZap
} from 'lucide-react';

const WORKFLOW_STEPS = [
    {
        id: 1,
        title: 'Captación de Interesados',
        subtitle: 'Tus anuncios en Google y Meta atraen a pacientes ideales',
        icon: LucideTarget,
        color: 'from-indigo-600 to-indigo-400',
        metric: 'Tráfico Calificado',
        impact: 'Más visibilidad',
        animation: 'scale'
    },
    {
        id: 2,
        title: 'Respuesta Inmediata',
        subtitle: 'Donna atiende cada mensaje en menos de 1 minuto',
        icon: LucideZap,
        color: 'from-indigo-500 to-purple-500',
        metric: 'Atención 24/7',
        impact: 'Cero leads perdidos',
        animation: 'pulse'
    },
    {
        id: 3,
        title: 'Calificación Inteligente',
        subtitle: 'Donna identifica la urgencia y el tipo de tratamiento',
        icon: LucideBrain,
        color: 'from-purple-500 to-pink-500',
        metric: 'IA Psicográfica',
        impact: 'Pacientes reales',
        animation: 'bounce'
    },
    {
        id: 4,
        title: 'Cierre de Cita',
        subtitle: 'Donna guía al paciente directo a tu agenda clínica',
        icon: LucideCalendarCheck,
        color: 'from-pink-500 to-rose-500',
        metric: 'Agendado Directo',
        impact: 'Consultas llenas',
        animation: 'scale'
    },
    {
        id: 5,
        title: 'Reputación en Google',
        subtitle: 'Tras la consulta, Donna captura reseñas positivas',
        icon: LucideSparkles,
        color: 'from-rose-500 to-amber-500',
        metric: '+ Estrellas',
        impact: 'Confianza digital',
        animation: 'rotate'
    }
];

export function EnhancedWorkflow() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        }, 4000); // 4 seconds per step, continuous loop

        return () => clearInterval(interval);
    }, []);

    const step = WORKFLOW_STEPS[currentStep];
    const Icon = step.icon;

    return (
        <div className="relative w-full min-h-[500px] bg-[#0A0B14] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-10 py-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.8, x: -30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 30 }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        className="text-left w-full max-w-md mx-auto flex flex-col items-start"
                    >
                        {/* Animated Icon with Glow - Centered */}
                        <motion.div
                            className="relative mx-auto mb-10 w-full flex justify-center"
                            animate={{
                                scale: step.animation === 'pulse' ? [1, 1.25, 1] : 1,
                                rotate: step.animation === 'rotate' ? [0, 360, 0] : step.animation === 'shake' ? [0, -10, 10, -10, 0] : 0,
                                y: step.animation === 'bounce' ? [0, -30, 0] : step.animation === 'slide' ? [0, -15, 0] : 0,
                                x: step.animation === 'slide' ? [0, 15, 0] : 0,
                            }}
                            transition={{
                                duration: step.animation === 'rotate' ? 4 : 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <div className={`w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br ${step.color} rounded-[2rem] flex items-center justify-center shadow-2xl relative`}>
                                <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-2xl" strokeWidth={1.5} />

                                {/* Multi-layer Glow */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-[2.5rem] blur-3xl opacity-60`}
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.3, 0.6] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-[2.5rem] blur-2xl opacity-40`}
                                    animate={{ scale: [1.2, 1.6, 1.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>

                        {/* Step Number Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-start gap-3 mb-4"
                        >
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xl border-2 border-white/20`}>
                                {step.id}
                            </div>
                            <LucideSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse drop-shadow-lg" />
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 tracking-tight leading-tight"
                        >
                            {step.title}
                        </motion.h3>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-300 text-sm sm:text-base md:text-lg font-medium mb-6"
                        >
                            {step.subtitle}
                        </motion.p>

                        {/* Metrics Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 gap-3 w-full mr-auto"
                        >
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Métrica</p>
                                <p className="text-base sm:text-lg font-black text-white leading-tight">{step.metric}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Impacto</p>
                                <p className="text-base sm:text-lg font-black text-white leading-tight">{step.impact}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>



            {/* Animated Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r="150"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
