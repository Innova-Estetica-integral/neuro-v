'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronLeft, LucideChevronRight, LucidePlay, LucidePause } from 'lucide-react';
import Image from 'next/image';
import { GlassCard } from './ui/GlassCard';

const WORKFLOW_STEPS = [
    {
        id: 1,
        title: 'Lead desde Instagram',
        description: 'Tu paciente ve tu anuncio de tratamiento estético en su feed',
        image: '/assets/workflow/step_1_instagram.png',
        color: 'from-pink-500 to-purple-500'
    },
    {
        id: 2,
        title: 'Landing Adaptada',
        description: 'Aterriza en una página personalizada según su perfil psicográfico',
        image: '/assets/workflow/step_2_landing.png',
        color: 'from-purple-500 to-indigo-500'
    },
    {
        id: 3,
        title: 'IA en WhatsApp',
        description: 'Nuestro Cerebro de Ventas califica y cierra la venta automáticamente',
        image: '/assets/workflow/step_3_whatsapp.png',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 4,
        title: 'Pago Automático',
        description: 'Envío instantáneo de link de pago por Transbank para asegurar la reserva',
        image: '/assets/workflow/step_4_payment.png',
        color: 'from-indigo-500 to-blue-500'
    },
    {
        id: 5,
        title: 'Agenda Sincronizada',
        description: 'Confirmación automática en tu Google Calendar. Cero fricción.',
        image: '/assets/workflow/step_5_calendar.png',
        color: 'from-blue-500 to-cyan-500'
    }
];

export function WorkflowMockup() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // Auto-play carousel
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [isPlaying]);

    const goToStep = (index: number) => {
        setCurrentStep(index);
        setIsPlaying(false);
    };

    const nextStep = () => {
        setCurrentStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        setIsPlaying(false);
    };

    const prevStep = () => {
        setCurrentStep((prev) => (prev - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length);
        setIsPlaying(false);
    };

    const step = WORKFLOW_STEPS[currentStep];

    return (
        <div className="relative w-full">
            {/* Main Carousel */}
            <GlassCard className="relative overflow-hidden border-white/10 bg-black/40 p-0">
                {/* Step Content */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-black/60 to-black/80">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center p-8"
                        >
                            <div className="relative w-full h-full max-w-md mx-auto">
                                {/* Mockup Image */}
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                {/* Gradient Overlay for Text Readability */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-10 rounded-2xl pointer-events-none`} />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevStep}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/20 z-10"
                        aria-label="Previous step"
                    >
                        <LucideChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={nextStep}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/20 z-10"
                        aria-label="Next step"
                    >
                        <LucideChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/20 z-10"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <LucidePause className="w-5 h-5 text-white" />
                        ) : (
                            <LucidePlay className="w-5 h-5 text-white ml-0.5" />
                        )}
                    </button>
                </div>

                {/* Step Info */}
                <div className="p-6 bg-gradient-to-b from-black/60 to-black/80 border-t border-white/10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm`}>
                                    {step.id}
                                </div>
                                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Dots */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {WORKFLOW_STEPS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToStep(index)}
                            className={`transition-all ${index === currentStep
                                    ? 'w-8 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                                } rounded-full`}
                            aria-label={`Go to step ${index + 1}`}
                        />
                    ))}
                </div>
            </GlassCard>

            {/* Step Timeline (Desktop) */}
            <div className="hidden lg:flex justify-between mt-8 gap-2">
                {WORKFLOW_STEPS.map((s, index) => (
                    <button
                        key={s.id}
                        onClick={() => goToStep(index)}
                        className={`flex-1 p-3 rounded-xl transition-all ${index === currentStep
                                ? 'bg-white/10 border-2 border-white/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${s.color} mx-auto mb-2 flex items-center justify-center text-white text-xs font-black`}>
                            {s.id}
                        </div>
                        <p className={`text-xs font-bold text-center ${index === currentStep ? 'text-white' : 'text-gray-500'
                            }`}>
                            {s.title}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
