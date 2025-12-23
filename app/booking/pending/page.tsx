'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideClock, LucideHome, LucideRefreshCw, LucideAlertCircle } from 'lucide-react';
import Link from 'next/link';

function PendingContent() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointment_id');
    const paymentId = searchParams.get('payment_id');
    const isMock = searchParams.get('mock') === 'true';

    const [checking, setChecking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCheckStatus = async () => {
        setChecking(true);
        try {
            // TODO: Call actual API to check payment status
            // const res = await fetch(`/api/payments/${paymentId}/status`);
            // const data = await res.json();

            // Mock: simulate checking
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock: Redirect based on random outcome
            const outcome = Math.random();
            if (outcome > 0.5) {
                window.location.href = `/booking/success?appointment_id=${appointmentId}&payment_id=${paymentId}`;
            } else {
                alert('El pago aún está pendiente. Te notificaremos por email cuando se confirme.');
            }
        } catch (error) {
            console.error('Error checking payment:', error);
            alert('Error al verificar el pago. Intenta más tarde.');
        } finally {
            setChecking(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen relative text-white overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B8FB9] via-[#7986CB] to-[#9575CD]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 border border-yellow-500/20 shadow-2xl space-y-6"
                >
                    {/* Pending Icon */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{
                                scale: { type: "spring", delay: 0.2 },
                                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                            }}
                            className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/50"
                        >
                            <LucideClock className="w-12 h-12 text-white" />
                        </motion.div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2">
                                Pago en Proceso
                            </h1>
                            <p className="text-lg opacity-90">
                                Tu pago está siendo verificado
                            </p>
                        </div>

                        {isMock && (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-sm">
                                <span className="font-bold">MODO PRUEBA:</span> Pago simulado pendiente
                            </div>
                        )}
                    </div>

                    {/* Timer */}
                    <div className="backdrop-blur-xl bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 text-center">
                        <div className="text-5xl font-mono font-black text-yellow-300 mb-2">
                            {formatTime(elapsedTime)}
                        </div>
                        <div className="text-sm opacity-80">Tiempo transcurrido</div>
                    </div>

                    {/* Payment Info */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
                        {paymentId && (
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-sm opacity-80">ID Transacción</span>
                                <span className="font-mono text-sm">{paymentId}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <LucideAlertCircle className="w-5 h-5 text-yellow-300 mt-0.5" />
                            <div>
                                <div className="font-semibold mb-2">¿Por qué puede estar pendiente?</div>
                                <ul className="text-sm opacity-80 space-y-1">
                                    <li>• Verificación bancaria en curso</li>
                                    <li>• Pago con transferencia (1-3 días hábiles)</li>
                                    <li>• Validación de seguridad</li>
                                    <li>• Pago con Khipu o ServiPag</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 space-y-2">
                        <h3 className="font-bold">¿Qué sucede ahora?</h3>
                        <ul className="text-sm space-y-2 opacity-90">
                            <li>✓ Te notificaremos por email cuando se confirme</li>
                            <li>✓ Recibirás un mensaje de WhatsApp con los detalles</li>
                            <li>✓ La confirmación puede tardar hasta 48 horas</li>
                            <li>✓ Tu cita está pre-reservada mientras tanto</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleCheckStatus}
                            disabled={checking}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl transition-all font-bold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {checking ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    <LucideRefreshCw className="w-5 h-5" />
                                    Verificar Estado Ahora
                                </>
                            )}
                        </button>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-semibold"
                        >
                            <LucideHome className="w-5 h-5" />
                            Volver al Inicio
                        </Link>
                    </div>

                    {/* Auto-refresh notice */}
                    <div className="text-center text-sm opacity-60">
                        Esta página se actualizará automáticamente cada 30 segundos
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function PendingPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
            </div>
        }>
            <PendingContent />
        </Suspense>
    );
}
