'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { PremiumButton } from '../ui/PremiumButton';
import Link from 'next/link';

export function BetaFinalSection() {
    const [showComparison, setShowComparison] = useState(false);

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* OBJECTION HANDLING: COMPARISON TABLE */}
                <div className="mb-32 text-center">
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all mb-12 shadow-sm"
                    >
                        {showComparison ? 'OCULTAR COMPARATIVA' : 'VER COMPARATIVA VS. OTROS'}
                        <ChevronDown className={`transition-transform duration-500 ${showComparison ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showComparison && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-8 sm:p-12 bg-gray-50/50 border border-gray-100 rounded-[3rem] overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Característica</th>
                                                <th className="py-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Otros Sistemas (Tú trabajas)</th>
                                                <th className="py-6 font-black text-[10px] uppercase tracking-widest text-indigo-600">NeuroV (Donna trabaja)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { label: "Implementación", other: "Semanas de configuración manual.", nv: "Lista para operar en 48 horas.", icon: true },
                                                { label: "Agenda", other: "Tú confirmas y mueves citas.", nv: "Donna lo hace automáticamente.", icon: true },
                                                { label: "Boletas/SII", other: "Riesgo de errores y olvidos.", nv: "Sincronizado y automático.", icon: true },
                                                { label: "Captación", other: "Tú buscas pacientes.", nv: "Donna califica y cierra.", icon: true }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-gray-100 last:border-0">
                                                    <td className="py-6 font-bold text-gray-900">{row.label}</td>
                                                    <td className="py-6 text-gray-400 flex items-center gap-2">
                                                        <XCircle size={14} className="text-red-400" /> {row.other}
                                                    </td>
                                                    <td className="py-6 font-black text-indigo-600 flex items-center gap-2">
                                                        <CheckCircle2 size={14} className="text-indigo-600" /> {row.nv}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* FINAL CTA: THE AGENDAMIENTO */}
                <div id="agenda" className="relative p-12 sm:p-24 bg-gray-900 rounded-[4rem] text-center overflow-hidden">
                    {/* Visual background details */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-[150px] rounded-full" />

                    <div className="relative z-10">
                        <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-10 block italic">Motor de Ingresos</span>
                        <h2 className="text-4xl sm:text-7xl font-black text-white mb-10 tracking-tightest leading-tight uppercase italic">
                            Agenda tu Sesión <br /> de Crecimiento.
                        </h2>
                        <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
                            Nuestro equipo de consultores diseñará tu arquitectura de ingresos NeuroV en 30 minutos.
                        </p>

                        <Link href="/strategic-session">
                            <PremiumButton variant="primary" size="lg" className="px-16 py-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30">
                                RESERVAR EN GOOGLE CALENDAR <ArrowRight size={14} className="ml-2" />
                            </PremiumButton>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
