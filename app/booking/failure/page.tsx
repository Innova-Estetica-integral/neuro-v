'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideXCircle, LucideRefreshCw, LucideHome, LucideAlertCircle, LucidePhone } from 'lucide-react';
import Link from 'next/link';

function FailureContent() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointment_id');
    const paymentId = searchParams.get('payment_id');
    const isMock = searchParams.get('mock') === 'true';

    const [retrying, setRetrying] = useState(false);

    const handleRetry = () => {
        setRetrying(true);
        // Redirect back to booking with appointment data
        setTimeout(() => {
            window.location.href = `/booking?appointment_id=${appointmentId}&retry=true`;
        }, 500);
    };

    return (
        <div className="min-h-screen relative text-white overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900/30 to-gray-900" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 border border-red-500/20 shadow-2xl space-y-6"
                >
                    {/* Error Icon */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/50"
                        >
                            <LucideXCircle className="w-12 h-12 text-white" />
                        </motion.div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2">
                                Pago Rechazado
                            </h1>
                            <p className="text-lg opacity-90">
                                No se pudo procesar tu pago
                            </p>
                        </div>

                        {isMock && (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-sm">
                                <span className="font-bold">MODO PRUEBA:</span> Pago simulado fallido
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="backdrop-blur-xl bg-red-500/10 rounded-2xl p-6 border border-red-500/20 space-y-3">
                        <div className="flex items-start gap-3">
                            <LucideAlertCircle className="w-5 h-5 text-red-300 mt-0.5" />
                            <div>
                                <div className="font-semibold mb-1">Posibles causas:</div>
                                <ul className="text-sm opacity-80 space-y-1">
                                    <li>• Fondos insuficientes</li>
                                    <li>• Tarjeta bloqueada o expirada</li>
                                    <li>• Datos incorrectos</li>
                                    <li>• Límite de compra excedido</li>
                                </ul>
                            </div>
                        </div>

                        {paymentId && (
                            <div className="pt-3 border-t border-red-500/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-80">ID Transacción</span>
                                    <span className="font-mono text-sm">{paymentId}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 space-y-2">
                        <h3 className="font-bold">¿Qué puedes hacer?</h3>
                        <ul className="text-sm space-y-2 opacity-90">
                            <li>✓ Verifica los datos de tu tarjeta</li>
                            <li>✓ Contacta a tu banco para autorizar el pago</li>
                            <li>✓ Intenta con otra tarjeta o método de pago</li>
                            <li>✓ Espera unos minutos e intenta nuevamente</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={handleRetry}
                            disabled={retrying}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl transition-all font-bold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {retrying ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                    Redirigiendo...
                                </>
                            ) : (
                                <>
                                    <LucideRefreshCw className="w-5 h-5" />
                                    Reintentar Pago
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-semibold"
                        >
                            <LucideHome className="w-5 h-5" />
                            Volver al Inicio
                        </Link>

                        <a
                            href="https://wa.me/56912345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition-all font-semibold"
                        >
                            <LucidePhone className="w-5 h-5" />
                            Soporte WhatsApp
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function FailurePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400"></div>
            </div>
        }>
            <FailureContent />
        </Suspense>
    );
}
