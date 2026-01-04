'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideTrendingUp, LucideInfo, LucideWallet, LucideClock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';

export function ROICalculator() {
    const [citas, setCitas] = useState(100);
    const [noShows, setNoShows] = useState(25); // porcenjate
    const [ticket, setTicket] = useState(45000); // CLP promedio

    // Cálculos
    const citasPerdidas = Math.round(citas * (noShows / 100));
    const dineroPerdido = citasPerdidas * ticket;

    // Con NeuroV reducimos no-shows al 8% (dato real de la guía)
    const noShowsNeuroV = 8;
    const citasPerdidasNeuroV = Math.round(citas * (noShowsNeuroV / 100));
    const dineroPerdidoNeuroV = citasPerdidasNeuroV * ticket;

    const ahorroMensual = dineroPerdido - dineroPerdidoNeuroV;
    const ahorroAnual = ahorroMensual * 12;

    const formatCLP = (val: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <section className="container mx-auto px-6 py-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
                    >
                        <LucideTrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-emerald-300 tracking-widest uppercase">Lo que puedes recuperar</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                        ¿Cuánto dinero está dejando <br className="hidden md:block" /> pasar tu consulta?
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto italic">
                        Usa nuestra calculadora para ver cuánto podrías recuperar automatizando tus confirmaciones y cobros.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Controls */}
                    <GlassCard className="p-8 space-y-8 border-gray-200 bg-white/50 backdrop-blur-xl shadow-xl">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Citas al mes</label>
                                    <span className="text-emerald-600 font-black">{citas}</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="1000"
                                    step="10"
                                    value={citas}
                                    onChange={(e) => setCitas(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">% No-Shows (Inasistencias)</label>
                                    <span className="text-emerald-600 font-black">{noShows}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="1"
                                    value={noShows}
                                    onChange={(e) => setNoShows(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                                    <LucideInfo size={10} />
                                    <span>Promedio en Chile: 18% - 25%</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Valor Ticket Promedio</label>
                                    <span className="text-emerald-600 font-black">{formatCLP(ticket)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="15000"
                                    max="500000"
                                    step="5000"
                                    value={ticket}
                                    onChange={(e) => setTicket(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-gray-500">
                                <LucideClock className="text-emerald-500 shrink-0" size={20} />
                                <p className="text-sm">NeuroV reduce las inasistencias al <strong>8%</strong> mediante confirmaciones automáticas.</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Results */}
                    <div className="space-y-6">
                        <motion.div
                            key={ahorroMensual}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-10 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <LucideWallet size={80} className="text-emerald-400" />
                            </div>

                            <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Tu ahorro mensual</p>
                            <h3 className="text-5xl md:text-6xl font-black text-gray-900 mb-2 leading-none">
                                {formatCLP(ahorroMensual)}
                            </h3>
                            <p className="text-emerald-300/60 font-medium">Dinero que dejas de perder cada mes.</p>

                            <div className="mt-8 pt-8 border-t border-emerald-500/20">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Impacto Anual</p>
                                        <p className="text-2xl font-black text-emerald-600">{formatCLP(ahorroAnual)}</p>
                                    </div>
                                    <PremiumButton
                                        variant="primary"
                                        size="sm"
                                        onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        RECUPERAR AHORA
                                    </PremiumButton>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Citas Perdidas Hoy</p>
                                <p className="text-2xl font-black text-gray-900">{citasPerdidas}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Con NeuroV</p>
                                <p className="text-2xl font-black text-indigo-600">{citasPerdidasNeuroV}</p>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-black">
                            * Cálculos basados en reducción promedio de no-shows observada en 150+ clínicas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
