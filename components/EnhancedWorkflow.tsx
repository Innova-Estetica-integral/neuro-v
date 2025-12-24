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
        title: 'Lead desde Instagram',
        subtitle: 'Paciente ve tu anuncio',
        icon: LucideInstagram,
        color: 'from-pink-500 to-purple-500',
        metric: '1,000 leads/mes',
        impact: 'Tráfico calificado',
        animation: 'scale'
    },
    {
        id: 2,
        title: 'Perfilado Psicográfico',
        subtitle: 'IA detecta personalidad en 30 segundos',
        icon: LucideBrain,
        color: 'from-purple-500 to-indigo-500',
        metric: '+275% conversión',
        impact: 'De 1.2% a 4.5%',
        animation: 'pulse'
    },
    {
        id: 3,
        title: 'Filtro BANT Automático',
        subtitle: 'Solo leads con presupuesto >$30k',
        icon: LucideTarget,
        color: 'from-indigo-500 to-blue-500',
        metric: '100% calificados',
        impact: 'Cero tiempo perdido',
        animation: 'bounce'
    },
    {
        id: 4,
        title: 'Payment-Gating',
        subtitle: 'Prepago 100% obligatorio',
        icon: LucideShieldCheck,
        color: 'from-blue-500 to-cyan-500',
        metric: '0% no-shows',
        impact: 'De 40% a 0%',
        animation: 'rotate'
    },
    {
        id: 5,
        title: 'Pursuit System',
        subtitle: 'Recuperación automática de carritos abandonados',
        icon: LucideMessageSquare,
        color: 'from-cyan-500 to-teal-500',
        metric: '3 niveles WhatsApp',
        impact: '+30% recuperación',
        animation: 'slide'
    },
    {
        id: 6,
        title: 'Confirmación Pagada',
        subtitle: 'Agenda blindada, flujo de caja asegurado',
        icon: LucideCalendarCheck,
        color: 'from-teal-500 to-green-500',
        metric: '$2.25M/mes',
        impact: 'vs $600k anterior',
        animation: 'scale'
    },
    {
        id: 7,
        title: 'Retención Automática',
        subtitle: 'Recordatorios según tratamiento',
        icon: LucideRepeat,
        color: 'from-green-500 to-emerald-500',
        metric: 'LTV maximizado',
        impact: 'Botox: 120d, Rellenos: 180d',
        animation: 'pulse'
    },
    {
        id: 8,
        title: 'ROI Tracking',
        subtitle: 'GCLID: Sabe qué anuncio genera ventas reales',
        icon: LucideTrendingUp,
        color: 'from-emerald-500 to-pink-500',
        metric: '+474% ROI',
        impact: 'Primer año',
        animation: 'bounce'
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
        <div className="relative w-full aspect-square max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        className="text-center w-full"
                    >
                        {/* Animated Icon with Glow */}
                        <motion.div
                            className="relative mx-auto mb-8"
                            animate={{
                                scale: step.animation === 'pulse' ? [1, 1.15, 1] : 1,
                                rotate: step.animation === 'rotate' ? [0, 360] : 0,
                                y: step.animation === 'bounce' ? [0, -30, 0] : 0,
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <div className={`w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br ${step.color} rounded-[2.5rem] flex items-center justify-center shadow-2xl relative`}>
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-2 mb-4"
                        >
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xl border-2 border-white/20`}>
                                {step.id}
                            </div>
                            <LucideSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse drop-shadow-lg" />
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 tracking-tight leading-tight px-4"
                        >
                            {step.title}
                        </motion.h3>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-300 text-sm sm:text-base md:text-lg font-medium mb-6 px-4"
                        >
                            {step.subtitle}
                        </motion.p>

                        {/* Metrics Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 gap-3 max-w-md mx-auto px-4"
                        >
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Métrica</p>
                                <p className="text-lg sm:text-xl font-black text-white leading-tight">{step.metric}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Impacto</p>
                                <p className="text-lg sm:text-xl font-black text-white leading-tight">{step.impact}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ROI Badge - Bottom Center */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-2xl border-2 border-white/20 flex items-center gap-2"
            >
                <LucideZap className="w-4 h-4" />
                ROI: +474% Año 1
            </motion.div>

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

const step = WORKFLOW_STEPS[currentStep];
const Icon = step.icon;

return (
    <div className="relative w-full min-h-[700px] py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />
        </div>

        {/* Flowing Money Particles */}
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl opacity-20"
                    initial={{ x: Math.random() * 100 + '%', y: '110%' }}
                    animate={{
                        y: '-10%',
                        x: Math.random() * 100 + '%',
                    }}
                    transition={{
                        duration: Math.random() * 15 + 10,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: Math.random() * 5
                    }}
                >
                    💰
                </motion.div>
            ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Animated Icon with Glow */}
                    <motion.div
                        className="relative mx-auto mb-12"
                        animate={{
                            scale: step.animation === 'pulse' ? [1, 1.15, 1] : 1,
                            rotate: step.animation === 'rotate' ? [0, 360] : 0,
                            y: step.animation === 'bounce' ? [0, -30, 0] : 0,
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <div className={`w-48 h-48 sm:w-56 sm:h-56 mx-auto bg-gradient-to-br ${step.color} rounded-[3rem] flex items-center justify-center shadow-2xl relative`}>
                            <Icon className="w-24 h-24 sm:w-28 sm:h-28 text-white drop-shadow-2xl" strokeWidth={1.5} />

                            {/* Multi-layer Glow */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-[3rem] blur-3xl opacity-60`}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.3, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-[3rem] blur-2xl opacity-40`}
                                animate={{ scale: [1.2, 1.6, 1.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Step Number Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-2xl shadow-xl border-2 border-white/20`}>
                            {step.id}
                        </div>
                        <LucideSparkles className="w-7 h-7 text-yellow-400 animate-pulse drop-shadow-lg" />
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <p className="text-xs font-black text-white/80 uppercase tracking-widest">Paso {step.id} de {WORKFLOW_STEPS.length}</p>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 tracking-tight leading-tight"
                    >
                        {step.title}
                    </motion.h3>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-300 text-xl sm:text-2xl font-medium mb-8 max-w-3xl mx-auto"
                    >
                        {step.subtitle}
                    </motion.p>

                    {/* Metrics Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
                    >
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Métrica Clave</p>
                            <p className="text-3xl font-black text-white">{step.metric}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Impacto</p>
                            <p className="text-3xl font-black text-white">{step.impact}</p>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="mt-16">
                <div className="flex gap-2 justify-center flex-wrap max-w-md mx-auto">
                    {WORKFLOW_STEPS.map((s, index) => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setCurrentStep(index);
                                setIsPlaying(false);
                            }}
                            className={`transition-all ${index === currentStep
                                ? 'w-20 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50'
                                : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                } rounded-full`}
                            aria-label={`Ir a paso ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Play/Pause Button */}
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-6 right-6 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/20 group shadow-xl"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
                {isPlaying ? (
                    <div className="flex gap-1.5">
                        <div className="w-2 h-6 bg-white rounded-full group-hover:bg-indigo-400 transition-colors" />
                        <div className="w-2 h-6 bg-white rounded-full group-hover:bg-indigo-400 transition-colors" />
                    </div>
                ) : (
                    <div className="w-0 h-0 border-l-[12px] border-l-white group-hover:border-l-indigo-400 border-y-[8px] border-y-transparent ml-1 transition-colors" />
                )}
            </button>

            {/* ROI Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full font-black text-sm shadow-2xl border-2 border-white/20 flex items-center gap-2"
            >
                <LucideZap className="w-5 h-5" />
                ROI: +474% Año 1
            </motion.div>
        </div>

        {/* Animated Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <motion.circle
                cx="50%"
                cy="50%"
                r="200"
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
