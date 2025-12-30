'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import {
    LucideZap,
    LucideBrainCircuit
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { SalesAssistant } from '@/components/SalesAssistant';
import { TechnicalLanding } from '@/components/TechnicalLanding';
import { GrowthLanding } from '@/components/GrowthLanding';
import { PsychographicAdapter } from '@/components/PsychographicAdapter';
import { useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics/tracker';
import { parseUTM } from '@/lib/utils/utm';

function CorporateHomeContent() {
    const searchParams = useSearchParams();

    // UTM-based tracking
    useEffect(() => {
        const utm = parseUTM(searchParams);
        analytics.trackUTM(utm);

        analytics.page('home', {
            utm
        });
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
            {/* Navigation SPA Optimized */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform text-white">NV</div>
                        <span className="font-black tracking-tighter text-2xl uppercase">NeuroV</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/#tecnologia" className="text-xs font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Tecnología</Link>
                        <Link href="/#roi" className="text-xs font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors">ROI</Link>
                        <Link href="/#seguridad" className="text-xs font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Seguridad</Link>
                        <Link href="/solutions-test" className="text-xs font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Soluciones</Link>
                    </div>

                    <Link href="/booking">
                        <PremiumButton size="sm" className="hidden sm:flex rounded-2xl px-6">
                            AGENDAR DEMO
                        </PremiumButton>
                    </Link>
                </div>
            </nav>

            {/* Dynamic Content Adapter */}
            <div className="pt-20">
                <PsychographicAdapter>
                    {({ profile }) => (
                        <>
                            {profile === 'hesitant' || profile === 'analytic' ? (
                                <TechnicalLanding profile={profile} />
                            ) : (
                                <GrowthLanding />
                            )}
                        </>
                    )}
                </PsychographicAdapter>
            </div>

            {/* Common Booking Section */}
            <section id="agenda" className="container mx-auto px-6 py-32">
                <GlassCard className="max-w-4xl mx-auto p-12 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <LucideZap className="w-16 h-16 text-indigo-400 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
                        ¿LISTO PARA EL <span className="text-gradient">SIGUIENTE NIVEL</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                        Tu clínica estética merece una infraestructura que convierta pacientes mientras duermes.
                    </p>
                    <Link href="/booking">
                        <PremiumButton size="lg" className="px-12 rounded-3xl text-lg shine-effect">
                            COMENZAR EVALUACIÓN BANT
                        </PremiumButton>
                    </Link>
                </GlassCard>
            </section>

            {/* Footer SPA Optimized */}
            <footer className="border-t border-white/5 py-20 bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs text-white">NV</div>
                                <span className="font-black tracking-widest uppercase">NeuroV Engine</span>
                            </div>
                            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                                La primera plataforma de inteligencia de ingresos diseñada específicamente para el sector médico-estético de alto rendimiento.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-indigo-400">Plataforma</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="/#tecnologia" className="hover:text-white transition-colors">Infraestructura</Link></li>
                                <li><Link href="/#seguridad" className="hover:text-white transition-colors">Seguridad RLS</Link></li>
                                <li><Link href="/demo" className="hover:text-white transition-colors">Demo Técnica</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-indigo-400">Legal</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="/terms" className="hover:text-white transition-colors">Términos</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link></li>
                                <li><Link href="/compliance" className="hover:text-white transition-colors">Cumplimiento Ley 21.668</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:row justify-between items-center pt-8 border-t border-white/5 gap-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            © 2025 NeuroV. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">System Status: Optimal</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Sales Assistant overlay */}
            <SalesAssistant mode="technical" />
        </main>
    );
}

export default function CorporateHomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
            <CorporateHomeContent />
        </Suspense>
    );
}
