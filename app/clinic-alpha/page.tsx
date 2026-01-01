'use client';

import { useState, useEffect } from 'react';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import { BANTQualifier } from '@/components/booking/BANTQualifier';
import { DynamicHero } from '@/components/DynamicHero';
import { LucideShieldCheck, LucideZap, LucideUsers, LucideActivity, LucideHeart, LucideAward, LucideCreditCard, LucideMenu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
    const { profile, uiConfig, behavior, classified, trackBehavior } = usePsychographic();
    const [showBooking, setShowBooking] = useState(false);
    const [qualified, setQualified] = useState(false);
    const [gclid, setGclid] = useState<string | null>(null);

    // Capture GCLID from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const g = urlParams.get('gclid');
        if (g) setGclid(g);
    }, []);

    const handleBookingStart = () => {
        trackBehavior({ clicksCount: behavior.clicksCount + 1 });
        // Redirección directa para mejor UX móvil (menos distracciones)
        window.location.href = `/booking?profile=${profile}&gclid=${gclid || ''}`;
    };

    return (
        <div className="min-h-screen relative text-white overflow-hidden">
            {/* Fondo Gradiente Profesional */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B8FB9] via-[#7986CB] to-[#9575CD]" />
                <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-400/20 rounded-full blur-[100px] md:blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px]" />
            </div>

            {/* Header */}
            <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <LucideHeart className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                    <span className="text-lg sm:text-2xl font-black tracking-tight">
                        Clínica <span className="text-cyan-300">Alpha</span>
                    </span>
                </div>

                <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <LucideMenu className="w-6 h-6" />
                </button>

                <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
                    <a href="#servicios" className="hover:text-cyan-300 transition-colors">Servicios</a>
                    <a href="#resultados" className="hover:text-cyan-300 transition-colors">Resultados</a>
                    <a href="#equipo" className="hover:text-cyan-300 transition-colors">Equipo</a>
                </div>
            </nav>

            <main className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-16 sm:pb-24">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Left Column: Hero Content - DYNAMIC */}
                    <div className="space-y-4 relative z-10 order-2 lg:order-1">
                        <DynamicHero
                            profile={profile}
                            uiConfig={uiConfig}
                            onBookingClick={handleBookingStart}
                            classified={classified}
                        />

                        {/* Testimonials Floating */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-600" />
                                ))}
                            </div>
                            <div>
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s} className="text-yellow-300 text-sm sm:text-base">★</span>
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm opacity-90">
                                    <span className="font-bold">4.9/5</span> · Más de 1,200 reseñas verificadas
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive Card */}
                    <div className="relative order-1 lg:order-2">
                        <AnimatePresence mode="wait">
                            {!showBooking ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="relative"
                                >
                                    {/* Main Card */}
                                    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4 sm:space-y-6">
                                        {/* Hero Image Placeholder */}
                                        <div className="relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-cyan-400/30 to-indigo-600/30 backdrop-blur-xl flex items-center justify-center border-4 border-white/20">
                                                    <LucideActivity className="w-16 h-16 sm:w-24 sm:h-24 text-white/80" />
                                                </div>
                                            </div>

                                            {/* Floating Testimonial Card */}
                                            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 backdrop-blur-xl bg-white/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl max-w-[160px] sm:max-w-[200px]">
                                                <div className="flex gap-0.5 mb-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <span key={s} className="text-yellow-500 text-[10px] sm:text-xs">★</span>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-gray-700 font-medium leading-tight">
                                                    &quot;El mejor tratamiento que he recibido, resultados increíbles&quot;
                                                </p>
                                                <p className="text-[8px] sm:text-[10px] text-gray-500 mt-1">María G. - Botox</p>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-2 sm:space-y-3">
                                            <h3 className="text-xl sm:text-2xl font-black">Agenda tu Evaluación</h3>
                                            <p className="text-xs sm:text-sm opacity-80">Análisis personalizado sin costo</p>
                                        </div>

                                        <button
                                            onClick={handleBookingStart}
                                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl sm:rounded-2xl transition-all font-bold text-sm sm:text-base text-gray-900 shadow-lg shadow-cyan-500/30 active:scale-95"
                                        >
                                            Iniciar Evaluación Gratuita
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="booking"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="backdrop-blur-2xl bg-white/10 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 sm:space-y-8 min-h-[400px] sm:min-h-[500px]"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl sm:text-2xl font-bold">Calificación BANT</h3>
                                        <button onClick={() => setShowBooking(false)} className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                                            Cancelar
                                        </button>
                                    </div>

                                    {!qualified ? (
                                        <BANTQualifier
                                            profile={profile}
                                            onQualified={(data) => {
                                                setQualified(true);
                                                setTimeout(() => {
                                                    window.location.href = `/booking?profile=${profile}&gclid=${gclid || ''}&budget=${data.budget}`;
                                                }, 1500);
                                            }}
                                            onDisqualified={(reason) => {
                                                alert('Presupuesto insuficiente para tratamientos premium (min $30.000 CLP)');
                                                setShowBooking(false);
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4 text-center py-8">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                                                <LucideShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                            </div>
                                            <h4 className="text-lg sm:text-xl font-bold">¡Perfil Calificado!</h4>
                                            <p className="text-sm sm:text-base text-gray-300">Redirigiendo a agenda prioritaria...</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Cards Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20"
                >
                    <div className="backdrop-blur-xl bg-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group cursor-pointer active:scale-95">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                            <LucideActivity className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Ciencia & Experiencia</h4>
                        <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Más de 15 años transformando vidas con tecnología FDA</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group cursor-pointer active:scale-95"
                        onClick={() => trackBehavior({ viewedPricing: true })}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                            <LucideCreditCard className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Pago Seguro</h4>
                        <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Webpay, Mercado Pago y todas las tarjetas</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/15 transition-all group cursor-pointer active:scale-95 sm:col-span-2 md:col-span-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                            <LucideUsers className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Equipo Experto</h4>
                        <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Médicos certificados internacionalmente</p>
                    </div>
                </motion.div>
            </main >

            {/* Dev Info */}
            < div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 text-[8px] sm:text-[10px] font-mono text-white/40 bg-black/30 p-1.5 sm:p-2 rounded backdrop-blur z-[100]" >
                {profile} | {gclid?.substring(0, 8) || 'N/A'
                } | {behavior.timeOnPage}s
            </div >
        </div >
    );
}
