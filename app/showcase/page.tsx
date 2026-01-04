'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import {
    LucideBrainCircuit,
    LucideShieldCheck,
    LucideTrendingUp,
    LucideArrowRight,
    LucideTarget,
    LucideZap,
    LucideUserCheck
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { ServiceTabs } from '@/components/ServiceTabs';
import { ROICalculator } from '@/components/ROICalculator';
import { EnhancedWorkflow } from '@/components/EnhancedWorkflow';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { Footer } from '@/components/Footer';

export default function ShowcasePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
            <ShowcaseContent />
        </Suspense>
    );
}

function ShowcaseContent() {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 bg-mesh relative overflow-x-hidden">
            {/* Background grain */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

            {/* Simple Navigation */}
            <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LucideBrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">NeuroV <span className="text-indigo-500">Vision</span></span>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 space-y-40">
                {/* 1. HERO - Focus on Human Solution */}
                <section className="container mx-auto px-6 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[150px] rounded-full" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
                            <LucideTarget className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">Propuesta de Valor NeuroV</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
                            Menos Caos Administrativo, <br />
                            <span className="text-gradient from-indigo-400 to-purple-600">Más Tiempo para Tus Pacientes</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 font-medium">
                            NeuroV no es solo software. Es el orquestador inteligente que elimina el agobio de tu consulta, automatizando lo que te quita vida para que tú te dediques a lo que amas.
                        </p>
                        <PremiumButton size="lg" variant="primary" onClick={() => document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' })}>
                            EXPLORA LA SOLUCIÓN
                        </PremiumButton>
                    </motion.div>
                </section>

                {/* 2. THE PROBLEM - Visualizing the Drain */}
                <section className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <ProblemCard
                            title="Desorden en la Agenda"
                            desc="Citas que se cruzan, olvidos y falta de control médico."
                            icon={<LucideShieldCheck className="text-red-400" />}
                        />
                        <ProblemCard
                            title="Inasistencias (No-Shows)"
                            desc="El 25% de tus horas se pierden porque el paciente olvidó asistir."
                            icon={<LucideTrendingUp className="text-red-400" />}
                        />
                        <ProblemCard
                            title="Agobio en WhatsApp"
                            desc="Tu secretaria colapsada respondiendo lo mismo una y otra vez."
                            icon={<LucideBrainCircuit className="text-red-400" />}
                        />
                    </div>
                </section>

                {/* 3. SOLUTION - Service Tabs (Refactorizados) */}
                <div id="solucion">
                    <ServiceTabs />
                </div>

                {/* 4. WORKFLOW - How it works */}
                <section className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">La Inteligencia detrás del Orden</h2>
                        <p className="text-gray-400 font-medium">Desde el primer mensaje en Instagram hasta el pago confirmado.</p>
                    </div>
                    <EnhancedWorkflow />
                </section>

                {/* 5. ROI CALCULATOR */}
                <div id="calculadora">
                    <ROICalculator />
                </div>

                {/* 6. CASE STUDIES - Proof of Value */}
                <section className="container mx-auto px-6">
                    <div className="text-left mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Resultados con <br className="hidden md:block" />Nombre y Apellido.</h2>
                        <p className="text-gray-400 font-medium max-w-xl">No es teoría. Estas son clínicas reales que recuperaron su vida profesional.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CaseStudyCard
                            clinicName="Clínica Estética Vitacura"
                            specialty="Dermatología & Estética"
                            before="Teníamos 40% de no-shows y la secretaria pasaba el día en WhatsApp sin cerrar nada."
                            after="Donna ahora confirma todo. El ausentismo bajó al 4% y las ventas de paquetes subieron un 20%."
                            stat="96%"
                            statLabel="Asistencia Confirmada"
                            color="indigo"
                        />
                        <CaseStudyCard
                            clinicName="Dental Care Santiago"
                            specialty="Odontología Integral"
                            before="Mucho paciente 'preguntón' en Instagram que nunca agendaba."
                            after="La IA filtra por presupuesto (BANT) y solo nos pasan leads calificados. Ya no perdemos tiempo."
                            stat="+15"
                            statLabel="Nuevos Pacientes / Sem"
                            color="emerald"
                        />
                        <CaseStudyCard
                            clinicName="KineSport Pro"
                            specialty="Kinesiología & Deporte"
                            before="Un desastre con el pago de Isapre e I-Med. Muchas boletas perdidas."
                            after="Todo integrado. El paciente paga su copago al agendar y la boleta se emite sola."
                            stat="10h"
                            statLabel="Libres de Admin / Mes"
                            color="pink"
                        />
                    </div>
                </section>

                {/* 7. ECOSYSTEM INTEGRATIONS */}
                <section className="container mx-auto px-6 py-20 bg-white/5 rounded-[3rem] border border-white/10 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-8">Conectado a Todo Chile</h2>
                    <p className="max-w-2xl mx-auto text-gray-400 mb-16 font-medium">
                        NeuroV no es una isla. Se integra con las herramientas que ya usas para que todo ocurra en un solo lugar.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        {['I-MED', 'TRANSBANK', 'BUK', 'PREVIRED', 'SII'].map((p) => (
                            <div key={p} className="text-2xl font-black tracking-widest">{p}</div>
                        ))}
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="container mx-auto px-6 text-center py-20">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8">¿Listo para recuperar tu tiempo?</h2>
                        <p className="text-xl text-indigo-100/80 mb-12 max-w-xl mx-auto">
                            Únete a cientos de profesionales que ya dejaron de ser esclavos de la administración.
                        </p>
                        <PremiumButton size="lg" variant="primary" className="bg-white text-indigo-600 hover:bg-slate-100 shadow-2xl">
                            RESERVAR MI DEMO GRATUITA
                        </PremiumButton>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}

function ProblemCard({ title, desc, icon }: { title: string, desc: string, icon: any }) {
    return (
        <GlassCard className="p-8 border-red-500/10 hover:border-red-500/30 transition-all">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">{desc}</p>
        </GlassCard>
    );
}
