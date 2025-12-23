'use client';

import { motion } from 'framer-motion';
import { LucideZap, LucideAward, LucideTrendingUp, LucideShieldCheck } from 'lucide-react';
import type { PsychProfile } from '@/lib/ai/psychographic-profiler';

interface DynamicHeroProps {
    profile: PsychProfile;
    uiConfig: any;
    onBookingClick: () => void;
    classified: boolean;
}

export function DynamicHero({ profile, uiConfig, onBookingClick, classified }: DynamicHeroProps) {
    // Dynamic gradient colors based on profile
    const gradients = {
        impulsive: 'from-red-500 via-orange-500 to-yellow-500',
        analytic: 'from-blue-600 via-indigo-600 to-purple-700',
        price_sensitive: 'from-green-600 via-teal-600 to-cyan-600',
        hesitant: 'from-gray-600 via-slate-600 to-zinc-700'
    };

    // Dynamic text accent colors
    const accentColors = {
        impulsive: 'text-yellow-300',
        analytic: 'text-blue-300',
        price_sensitive: 'text-green-300',
        hesitant: 'text-gray-300'
    };

    // Dynamic badge icons
    const BadgeIcon = {
        impulsive: LucideZap,
        analytic: LucideAward,
        price_sensitive: LucideTrendingUp,
        hesitant: LucideShieldCheck
    }[profile];

    const badgeText = {
        impulsive: '¡OFERTA FLASH!',
        analytic: 'Certificación FDA',
        price_sensitive: 'Mejor Precio Garantizado',
        hesitant: '100% Seguro y Confidencial'
    }[profile];

    return (
        <motion.div
            key={profile} // Re-render when profile changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
        >
            {/* Dynamic Badge */}
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm ${uiConfig.animations === 'fast' ? 'animate-pulse' : ''}`}
            >
                <BadgeIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${accentColors[profile]}`} />
                <span className="font-semibold">{badgeText}</span>
            </motion.div>

            {/* Dynamic Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                {uiConfig.headline.split(' ').slice(0, 3).join(' ')}
                <br />
                <span className={accentColors[profile]}>
                    {uiConfig.headline.split(' ').slice(3).join(' ')}
                </span>
            </h1>

            {/* Dynamic Subheadline */}
            <p className="text-base sm:text-lg md:text-xl leading-relaxed opacity-90 max-w-xl">
                {uiConfig.subheadline}
            </p>

            {/* Scarcity Counter (only for impulsive/price_sensitive) */}
            {uiConfig.showCountdown && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                    <LucideZap className="w-4 h-4 text-red-300 animate-pulse" />
                    <span className="text-sm font-bold">3 cupos disponibles HOY</span>
                </motion.div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-4 pt-2 sm:pt-4">
                {profile === 'analytic' && (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <LucideShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                            <span className="text-xs sm:text-sm font-bold">Certificado ISO 9001</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <LucideAward className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                            <span className="text-xs sm:text-sm font-bold">94.2% Efectividad</span>
                        </div>
                    </>
                )}

                {profile === 'price_sensitive' && (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <LucideTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                            <span className="text-xs sm:text-sm font-bold">20% OFF Hoy</span>
                        </div>
                    </>
                )}

                {profile === 'impulsive' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <LucideZap className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" />
                        <span className="text-xs sm:text-sm font-bold">Solo quedan 3 cupos</span>
                    </div>
                )}
            </div>

            {/* Dynamic CTA Button */}
            <button
                onClick={onBookingClick}
                className={`group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r ${gradients[profile]} rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-2xl active:scale-95 sm:hover:scale-105 transition-all text-white flex items-center justify-center gap-2 sm:gap-3 ${uiConfig.animations === 'fast' ? 'animate-pulse' : ''}`}
            >
                {uiConfig.cta}
                <LucideZap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:fill-current transition-all" />
            </button>

            {/* Profile Debug Info (development only) */}
            {process.env.NODE_ENV === 'development' && classified && (
                <div className="mt-4 p-3 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                        <span className="opacity-60">Perfil Detectado:</span>
                        <span className={`font-bold ${accentColors[profile]}`}>{profile.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-60">Urgencia:</span>
                        <span>{uiConfig.urgency}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-60">Énfasis:</span>
                        <span>{uiConfig.emphasize}</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
