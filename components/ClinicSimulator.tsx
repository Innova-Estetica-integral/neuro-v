'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    MessageSquare,
    TrendingUp,
    Zap,
    LucideCheckCircle,
    LucideClock,
    LucideShieldCheck
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export function ClinicSimulator() {
    const [logs, setLogs] = useState([
        { id: 1, type: 'brain', text: 'Analizando tráfico Google Ads @HighIntent' },
        { id: 2, type: 'donna', text: 'Donna activada 24/7 p/ WhatsApp' }
    ]);
    const [roi, setRoi] = useState(12.5);

    useEffect(() => {
        const interval = setInterval(() => {
            const types = ['brain', 'donna', 'system', 'revenue'];
            const type = types[Math.floor(Math.random() * types.length)];
            const texts = {
                brain: [
                    'Sincronizando Staff: Box 3 disponible',
                    'Ajustando copy persuasivo en tiempo real',
                    'Scoring BANT: 92/100',
                    'Asignando paciente a Dra. Castillo'
                ],
                donna: [
                    'Cerrando cita p/ Hidrolipoclasia',
                    'Link de prepago enviado p/ Webpay',
                    'Solicitando Review Google: Paciente Satisfecho',
                    'Recordatorio de cita 24h activado'
                ],
                system: [
                    'Boleta electrónica generada: #6742',
                    'Actualizando stock: 1 vial Bótox descontado',
                    'Reporte BI: LTV paciente +12%',
                    'Sync Google Calendar: Reserva Confirmada'
                ],
                revenue: [
                    'Flash Offer activada: 3 huecos detectados',
                    'WhatsApp masivo enviado: Oferta Reactivación',
                    'Venta recuperada: $150.000 (Flash Offer)',
                    'Conversión proactiva Donna: +5.2%'
                ]
            };

            const newLog = {
                id: Date.now(),
                type,
                text: texts[type as keyof typeof texts][Math.floor(Math.random() * 4)]
            };

            setLogs(prev => [newLog, ...prev.slice(0, 5)]);
            setRoi(prev => +(prev + 0.1).toFixed(1));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-stretch pt-12">
            {/* Donna Brain Feed */}
            <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit">
                    <BrainCircuit size={18} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Donna Executive Brain</span>
                </div>

                <GlassCard className="h-[500px] flex flex-col p-6 border-white/10 bg-[#0A0B14]/80 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-[#0A0B14] to-transparent z-10" />
                    <div className="flex-1 space-y-4 pt-4 overflow-hidden">
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-2xl"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${log.type === 'donna' ? 'bg-indigo-500' :
                                            log.type === 'revenue' ? 'bg-[#B9FF66]' :
                                                'bg-green-500'}`}
                                        />
                                        <span className="text-[8px] font-black uppercase text-gray-500">{log.type} // NV-CORE</span>
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed">{log.text}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </GlassCard>
            </div>

            {/* Clinic Dashboard View */}
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-3 gap-6">
                    <DashboardMetric label="Agenda Completa" value="98%" trend="+12%" icon={<LucideCheckCircle size={20} />} />
                    <DashboardMetric label="Crecimiento ROI" value={`${roi}%`} trend="Live" icon={<TrendingUp size={20} />} />
                    <DashboardMetric label="No-Shows Evitados" value="42" trend="0% Fuga" icon={<LucideClock size={20} />} />
                </div>

                <GlassCard className="p-8 border-indigo-500/20 bg-indigo-950/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-mesh opacity-10" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-3xl font-black text-white">IMPACTO EN TIEMPO REAL</h3>
                                <p className="text-indigo-300 text-sm">Visualización operativa de una clínica promedio con NeuroV</p>
                            </div>
                            <div className="px-4 py-2 bg-indigo-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest animate-pulse">
                                Simulación Activa
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <OperationItem active title="Cualificación BANT" value="Done" />
                                <OperationItem active title="Envío de Link Pago" value="Done" />
                                <OperationItem active title="Confirmación Agenda" value="Done" />
                                <OperationItem title="Gestión de Insumos" value="Pending" />
                            </div>

                            <div className="relative flex items-center justify-center p-8 bg-black/40 border border-white/10 rounded-[3rem]">
                                <div className="text-center">
                                    <div className="flex -space-x-3 justify-center mb-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0B14] bg-indigo-500 flex items-center justify-center text-[10px] font-black">DR</div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Staff en Operación</p>
                                    <p className="text-lg font-black text-white">3 ESPECIALISTAS ACTIVOS</p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center p-8 bg-black/40 border border-white/10 rounded-[3rem]">
                                <div className="text-center">
                                    <LucideShieldCheck size={64} className="text-indigo-400 mx-auto mb-6 opacity-40" />
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Status de Seguridad</p>
                                    <p className="text-lg font-black text-white">PROTOCOLO RLS ACTIVO</p>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 py-2 bg-indigo-500/10 border-t border-indigo-500/20 text-center">
                                    <span className="text-[8px] font-black text-indigo-300 tracking-[0.4em]">FHIR R4 COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="p-8 bg-indigo-600 rounded-[2.5rem] flex items-center justify-between text-white">
                    <div className="max-w-md">
                        <h4 className="text-2xl font-black mb-2 tracking-tight">¿Ves cómo funciona?</h4>
                        <p className="text-indigo-100 text-sm font-medium opacity-80">Esta simulación utiliza exactamente la misma lógica que implementaremos en tu clínica.</p>
                    </div>
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                        Agendar Consultoría
                    </button>
                </div>
            </div>
        </div>
    );
}

function DashboardMetric({ label, value, trend, icon }: any) {
    return (
        <GlassCard className="p-6 border-white/5 bg-white/5">
            <div className="flex items-center justify-between mb-4">
                <div className="text-indigo-400">{icon}</div>
                <span className="text-[8px] font-black text-[#B9FF66] bg-[#B9FF66]/10 px-2 py-0.5 rounded uppercase tracking-widest">{trend}</span>
            </div>
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </GlassCard>
    );
}

function OperationItem({ title, value, active = false }: any) {
    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-indigo-500/20 border-indigo-400/30' : 'bg-white/5 border-white/5 opacity-40'}`}>
            <span className="text-xs font-bold text-white uppercase tracking-widest">{title}</span>
            <span className={`text-[10px] font-black p-1 rounded ${active ? 'text-indigo-400' : 'text-gray-500'}`}>{value}</span>
        </div>
    );
}
