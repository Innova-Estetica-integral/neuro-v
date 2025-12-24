'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideInstagram, LucideMousePointer, LucideMessageSquare, LucideCreditCard, LucideCalendarCheck, LucideSparkles } from 'lucide-react';

const ANIMATION_STEPS = [
    {
        id: 1,
        title: 'Lead desde Instagram',
        icon: LucideInstagram,
        color: 'from-pink-500 to-purple-500',
        description: 'Paciente ve tu anuncio',
        animation: 'scale'
    },
    {
        id: 2,
        title: 'Click en Anuncio',
        icon: LucideMousePointer,
        color: 'from-purple-500 to-indigo-500',
        description: 'Hace clic interesado',
        animation: 'bounce'
    },
    {
        id: 3,
        title: 'IA Califica en WhatsApp',
        icon: LucideMessageSquare,
        color: 'from-green-500 to-emerald-500',
        description: 'Cerebro de Ventas actúa',
        animation: 'pulse'
    },
    {
        id: 4,
        title: 'Pago Automático',
        icon: LucideCreditCard,
        color: 'from-indigo-500 to-blue-500',
        description: 'Link de pago enviado',
        animation: 'slide'
    },
    {
        id: 5,
        title: 'Confirmado en Agenda',
        icon: LucideCalendarCheck,
        color: 'from-blue-500 to-cyan-500',
        description: 'Sincronizado automáticamente',
        animation: 'rotate'
    }
];

export function AnimatedWorkflow() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % ANIMATION_STEPS.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const step = ANIMATION_STEPS[currentStep];
    const Icon = step.icon;

    return (
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Flowing Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
                        initial={{ x: Math.random() * 100 + '%', y: '100%' }}
                        animate={{
                            y: '-10%',
                            x: Math.random() * 100 + '%',
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="text-center"
                    >
                        {/* Animated Icon */}
                        <motion.div
                            className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center shadow-2xl relative`}
                            animate={{
                                scale: step.animation === 'pulse' ? [1, 1.1, 1] : 1,
                                rotate: step.animation === 'rotate' ? [0, 360] : 0,
                                y: step.animation === 'bounce' ? [0, -20, 0] : 0,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <Icon className="w-16 h-16 text-white" />

                            {/* Glow Effect */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-3xl blur-2xl opacity-50`}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        {/* Step Number */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-2 mb-4"
                        >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm`}>
                                {step.id}
                            </div>
                            <LucideSparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight"
                        >
                            {step.title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-400 text-lg font-medium"
                        >
                            {step.description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64">
                    <div className="flex gap-2 justify-center mb-4">
                        {ANIMATION_STEPS.map((s, index) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setCurrentStep(index);
                                    setIsPlaying(false);
                                }}
                                className={`transition-all ${index === currentStep
                                        ? 'w-12 h-2 bg-white'
                                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                    } rounded-full`}
                            />
                        ))}
                    </div>
                </div>

                {/* Play/Pause Button */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/20"
                >
                    {isPlaying ? (
                        <div className="flex gap-1">
                            <div className="w-1 h-4 bg-white rounded-full" />
                            <div className="w-1 h-4 bg-white rounded-full" />
                        </div>
                    ) : (
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                    )}
                </button>
            </div>

            {/* Connection Lines Animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.path
                    d="M 50 50 Q 250 100 450 50"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
