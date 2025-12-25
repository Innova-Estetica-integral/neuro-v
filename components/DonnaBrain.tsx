'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LucideSparkles, LucidePartyPopper, LucideTrendingUp, LucideAlertTriangle, LucideCheckCircle, LucideBrainCircuit } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';

export interface DonnaInsight {
    id: string;
    category: 'vip_celebration' | 'retention_alert' | 'upsell_opportunity' | 'marketing_tip';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    status: string;
    metadata: any;
}

export function DonnaBrain({ insights }: { insights: DonnaInsight[] }) {
    if (insights.length === 0) return null;

    const getIcon = (category: string) => {
        switch (category) {
            case 'vip_celebration': return <LucidePartyPopper className="text-pink-400" />;
            case 'retention_alert': return <LucideAlertTriangle className="text-amber-400" />;
            case 'upsell_opportunity': return <LucideTrendingUp className="text-emerald-400" />;
            case 'marketing_tip': return <LucideSparkles className="text-cyan-400" />;
            default: return <LucideBrainCircuit className="text-indigo-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'border-red-500/50 bg-red-500/10';
            case 'high': return 'border-amber-500/50 bg-amber-500/10';
            default: return 'border-indigo-500/30 bg-indigo-500/5';
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <LucideBrainCircuit className="text-indigo-600 w-6 h-6" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                    Donna: Memoria Ejecutiva
                </h2>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">
                    Proactiva
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {insights.map((insight, idx) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <GlassCard className={`p-5 relative overflow-hidden flex gap-4 ${getPriorityColor(insight.priority)}`}>
                                <div className="p-3 bg-white/10 rounded-2xl shrink-0 h-fit border border-white/20">
                                    {getIcon(insight.category)}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm tracking-tight flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {insight.title}
                                            {insight.status === 'executed' && (
                                                <LucideCheckCircle className="w-3 h-3 text-emerald-500" />
                                            )}
                                        </div>
                                        {insight.priority === 'critical' && (
                                            <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-black uppercase">Crítico</span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        {insight.description}
                                    </p>
                                    {insight.status === 'executed' ? (
                                        <div className="pt-3">
                                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-200">
                                                Ejecutado por Donna (Modo Ejecutivo)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="pt-3 flex gap-2">
                                            <PremiumButton size="sm" variant="outline" className="text-[10px] py-1 h-8">
                                                Ignorar
                                            </PremiumButton>
                                            <PremiumButton size="sm" className="text-[10px] py-1 h-8 bg-indigo-600 hover:bg-indigo-700">
                                                Aprobar & Ejecutar
                                            </PremiumButton>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
