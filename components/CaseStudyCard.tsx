'use client';

import { motion } from 'framer-motion';
import { LucideCheckCircle2, LucideTrendingUp, LucideUserCheck } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface CaseStudyProps {
    clinicName: string;
    specialty: string;
    before: string;
    after: string;
    stat: string;
    statLabel: string;
    color?: string;
}

export function CaseStudyCard({ clinicName, specialty, before, after, stat, statLabel, color = 'indigo' }: CaseStudyProps) {
    const colorClasses = {
        indigo: 'from-indigo-400 to-purple-600 border-indigo-500/30',
        emerald: 'from-emerald-400 to-teal-600 border-emerald-500/30',
        pink: 'from-pink-400 to-rose-600 border-pink-500/30'
    };

    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

    return (
        <GlassCard className={`p-8 border-white/10 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden`} hoverIntensity="high">
            {/* Soft Glow Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${selectedColor} opacity-5 blur-3xl`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-xl font-black text-white tracking-tighter uppercase italic">{clinicName}</h4>
                        <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">{specialty}</p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-indigo-400`}>
                        <LucideUserCheck size={20} />
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] font-black text-red-400/60 uppercase tracking-widest mb-1 italic">Antes del Caos</p>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed italic">&quot;{before}&quot;</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative">
                        <div className="absolute -top-2 -right-2">
                            <LucideCheckCircle2 size={16} className="text-emerald-400" />
                        </div>
                        <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mb-1 italic">Con NeuroV</p>
                        <p className="text-sm text-emerald-100 font-semibold leading-relaxed">&quot;{after}&quot;</p>
                    </div>
                </div>

                <div className={`pt-6 border-t border-white/10 flex items-center justify-between`}>
                    <div>
                        <p className="text-3xl font-black text-white tracking-widest">{stat}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{statLabel}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedColor} flex items-center justify-center text-white shadow-lg`}>
                        <LucideTrendingUp size={20} />
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
