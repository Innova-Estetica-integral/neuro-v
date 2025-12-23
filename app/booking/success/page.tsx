'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideCheckCircle2, LucideCalendar, LucideMapPin, LucideClock, LucideDownload, LucideHome } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointment_id');
    const paymentId = searchParams.get('payment_id');
    const isMock = searchParams.get('mock') === 'true';

    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch appointment details
        async function fetchAppointment() {
            try {
                // TODO: Replace with real API call
                // const res = await fetch(`/api/appointments/${appointmentId}`);
                // const data = await res.json();

                // Mock data for now
                setAppointment({
                    id: appointmentId,
                    service: 'Botox',
                    date: '2025-12-28',
                    time: '14:00',
                    price: 120000,
                    clinic: 'Clínica Alpha',
                    address: 'Av. Providencia 1234, Santiago',
                    doctor: 'Dra. María González'
                });
            } catch (error) {
                console.error('Error fetching appointment:', error);
            } finally {
                setLoading(false);
            }
        }

        if (appointmentId) {
            fetchAppointment();
        } else {
            setLoading(false);
        }
    }, [appointmentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative text-white overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B8FB9] via-[#7986CB] to-[#9575CD]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6"
                >
                    {/* Success Icon */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/50"
                        >
                            <LucideCheckCircle2 className="w-12 h-12 text-white" />
                        </motion.div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2">
                                ¡Pago Confirmado!
                            </h1>
                            <p className="text-lg opacity-90">
                                Tu cita ha sido agendada exitosamente
                            </p>
                        </div>

                        {isMock && (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-sm">
                                <span className="font-bold">MODO PRUEBA:</span> Pago simulado
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-white/10">
                            <span className="text-sm opacity-80">ID Pago</span>
                            <span className="font-mono text-sm">{paymentId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm opacity-80">Total Pagado</span>
                            <span className="text-2xl font-black text-green-300">
                                ${appointment?.price.toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    {appointment && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold border-b border-white/20 pb-2">
                                Detalles de tu Cita
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <LucideCalendar className="w-5 h-5 text-cyan-300 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">{appointment.service}</div>
                                        <div className="text-sm opacity-80">
                                            {new Date(appointment.date).toLocaleDateString('es-CL', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <LucideClock className="w-5 h-5 text-cyan-300 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Hora</div>
                                        <div className="text-sm opacity-80">{appointment.time} hrs</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <LucideMapPin className="w-5 h-5 text-cyan-300 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">{appointment.clinic}</div>
                                        <div className="text-sm opacity-80">{appointment.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="backdrop-blur-xl bg-cyan-500/10 rounded-2xl p-6 border border-cyan-500/30 space-y-2">
                        <h3 className="font-bold text-cyan-300">Instrucciones Importantes</h3>
                        <ul className="text-sm space-y-2 opacity-90">
                            <li>• Llega 10 minutos antes de tu cita</li>
                            <li>• Trae tu cédula de identidad</li>
                            <li>• Revisa tu email para el comprobante</li>
                            <li>• Recibirás recordatorios 24h y 2h antes</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-semibold"
                        >
                            <LucideDownload className="w-5 h-5" />
                            Descargar Confirmación
                        </button>

                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl transition-all font-bold text-gray-900"
                        >
                            <LucideHome className="w-5 h-5" />
                            Volver al Inicio
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
