'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideChevronLeft, LucideChevronRight, LucideCheckCircle2,
    LucideCalendar, LucideCreditCard, LucideUser, LucideSparkles,
    LucideInfo, LucideAlertCircle, LucideShieldCheck
} from 'lucide-react';
import { DatePicker } from '@mantine/dates';
import { createAppointmentCheckout } from '@/lib/business/payment-gating';
import { BANTQualifier, type BANTData } from '@/components/booking/BANTQualifier';
import {
    validateFullName, validateEmail, validateWhatsApp, validateRUT,
    capitalizeWords, formatWhatsApp, formatRUT
} from '@/lib/utils/validators';

// Demo Services
const SERVICES = [
    { id: 'botox', name: 'Botox - Zonas Múltiples', price: 60000, duration: 30, desc: 'Elimina arrugas de expresión con resultados naturales.' },
    { id: 'filler', name: 'Relleno Ácido Hialurónico', price: 150000, duration: 60, desc: 'Aporta volumen e hidratación profunda.' },
    { id: 'peeling', name: 'Peeling Químico', price: 45000, duration: 45, desc: 'Renovación celular profunda para una piel radiante.' },
    { id: 'rhino', name: 'Rinomodelación', price: 180000, duration: 45, desc: 'Perfilado nasal sin cirugía.' }
];

function BookingWizardContent() {
    const searchParams = useSearchParams();
    const profile = searchParams.get('profile') || 'hesitant';
    const gclid = searchParams.get('gclid');

    const [step, setStep] = useState(0); // Empezar en paso 0 (BANT)
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        rut: '',
        whatsappOptIn: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

    // Auto-select service if passed in url? No, let them choose.

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // Validar formulario antes de avanzar desde paso 3
    const validateStep3 = (): boolean => {
        const newErrors: Record<string, string> = {};

        const nameValidation = validateFullName(userData.name);
        if (!nameValidation.isValid) newErrors.name = nameValidation.error!;

        const emailValidation = validateEmail(userData.email);
        if (!emailValidation.isValid) newErrors.email = emailValidation.error!;

        const phoneValidation = validateWhatsApp(userData.phone);
        if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error!;

        const rutValidation = validateRUT(userData.rut);
        if (!rutValidation.isValid) newErrors.rut = rutValidation.error!;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStep3Submit = () => {
        if (validateStep3()) {
            handleNext();
        }
    };

    const handleFinalize = async () => {
        setLoading(true);
        try {
            // In a real app, we'd save the patient and appointment (proposed) first
            // For demo, we trigger checkout directly using Clínica Alpha ID
            const clinicId = 'a1111111-1111-1111-1111-111111111111'; // Clínica Alpha

            const response = await fetch('/api/booking/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clinicId,
                    serviceId: selectedService.id,
                    serviceName: selectedService.name,
                    price: selectedService.price,
                    userData: {
                        ...userData,
                        profile,
                        gclid
                    },
                    appointmentDate: selectedDate?.toISOString()
                })
            });

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                alert('Error al generar el pago. Por favor intente nuevamente.');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex flex-col items-center">
            {/* Progress Header */}
            <div className="w-full max-w-4xl mb-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
                            {step === 0 ? <LucideUser className="w-4 h-4" /> : step}
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            {step === 0 ? 'Evaluación Inicial' : 'Reserva tu Transformación'}
                        </h1>
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-black">
                        {step === 0 ? 'Paso 1 de 5' : `Paso ${step + 1} de 5`}
                    </div>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / 5) * 100}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-4xl relative">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-[40px] p-8 max-w-2xl mx-auto space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto">
                                    <LucideUser className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black">Bienvenido/a</h3>
                                <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                                    Para brindarle una atención personalizada, por favor responda estas <span className="font-bold text-white">3 breves preguntas</span> sobre su objetivo de tratamiento.
                                </p>
                            </div>

                            <BANTQualifier
                                profile={profile}
                                onQualified={(data) => {
                                    console.log('BANT Qualified:', data);
                                    handleNext();
                                }}
                                onDisqualified={(reason) => {
                                    alert('Lamentablemente, nuestros tratamientos premium requieren un presupuesto mínimo de $30.000 CLP. Le invitamos a revisar nuestras opciones de financiamiento.');
                                    window.location.href = '/';
                                }}
                            />
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            {SERVICES.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => { setSelectedService(service); handleNext(); }}
                                    className={`p-6 rounded-3xl border text-left transition-all hover:scale-[1.02] ${selectedService?.id === service.id
                                        ? 'bg-indigo-600/20 border-indigo-400 shadow-xl'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <LucideSparkles className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <span className="text-xl font-black">${service.price.toLocaleString('es-CL')}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                                    <p className="text-sm text-gray-400">{service.desc}</p>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-[40px] p-8 flex flex-col md:flex-row gap-8 items-start"
                        >
                            <div className="flex-1 w-full flex justify-center">
                                <DatePicker
                                    value={selectedDate}
                                    onChange={(value) => {
                                        if (value) {
                                            // Asegurar que la fecha se mantiene en la zona horaria local
                                            const localDate = typeof value === 'string'
                                                ? new Date(value + 'T00:00:00')
                                                : value;
                                            setSelectedDate(localDate);
                                        } else {
                                            setSelectedDate(null);
                                        }
                                    }}
                                    minDate={new Date()}
                                    size="lg"
                                    className="mx-auto"
                                />
                            </div>
                            <div className="w-full md:w-72 space-y-6">
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                                        <LucideAlertCircle className="w-4 h-4" /> PRIORIDAD ALTA
                                    </div>
                                    <p className="text-sm">Gaps disponibles en menos de 24h. Reserva ahora para asegurar el mejor horario.</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Horarios Disponibles</p>
                                    {['09:00', '11:30', '15:00', '17:30'].map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`w-full py-4 rounded-2xl border transition-all font-bold ${selectedTime === time
                                                ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/30'
                                                : 'bg-white/5 border-white/10 hover:bg-indigo-600/50 hover:border-indigo-400/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={handleNext}
                                    className="w-full py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-30 hover:bg-indigo-700 transition-all"
                                >
                                    Continuar
                                </button>
                                {selectedDate && !selectedTime && (
                                    <p className="text-xs text-yellow-400 text-center">⚠️ Selecciona un horario para continuar</p>
                                )}
                                <button onClick={handleBack} className="w-full text-center text-gray-500 text-sm py-2">Volver</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-[40px] p-8 space-y-8"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm text-gray-500 font-bold uppercase tracking-widest">Nombre Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. María García"
                                        value={userData.name}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setUserData({ ...userData, name: val });
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                        onBlur={e => setUserData({ ...userData, name: capitalizeWords(e.target.value) })}
                                        className={`w-full bg-white/5 border rounded-2xl p-4 outline-none transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-indigo-500'}`}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errors.name}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm text-gray-500 font-bold uppercase tracking-widest">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        placeholder="maria@correo.com"
                                        value={userData.email}
                                        onChange={e => {
                                            setUserData({ ...userData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: '' });
                                        }}
                                        className={`w-full bg-white/5 border rounded-2xl p-4 outline-none transition-all ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-indigo-500'}`}
                                    />
                                    {errors.email && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errors.email}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm text-gray-500 font-bold uppercase tracking-widest">WhatsApp / Teléfono</label>
                                    <input
                                        type="tel"
                                        placeholder="+569 1234 5678"
                                        value={userData.phone}
                                        onChange={e => {
                                            setUserData({ ...userData, phone: e.target.value });
                                            if (errors.phone) setErrors({ ...errors, phone: '' });
                                        }}
                                        onBlur={e => setUserData({ ...userData, phone: formatWhatsApp(e.target.value) })}
                                        className={`w-full bg-white/5 border rounded-2xl p-4 outline-none transition-all ${errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-indigo-500'}`}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errors.phone}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm text-gray-500 font-bold uppercase tracking-widest">RUT / DNI</label>
                                    <input
                                        type="text"
                                        placeholder="12.345.678-9"
                                        value={userData.rut}
                                        onChange={e => {
                                            setUserData({ ...userData, rut: e.target.value });
                                            if (errors.rut) setErrors({ ...errors, rut: '' });
                                        }}
                                        onBlur={e => setUserData({ ...userData, rut: formatRUT(e.target.value) })}
                                        className={`w-full bg-white/5 border rounded-2xl p-4 outline-none transition-all ${errors.rut ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-indigo-500'}`}
                                    />
                                    {errors.rut && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errors.rut}</p>}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                    <LucideInfo className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Privacidad y Seguridad (FHIR R4)</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Tus datos están protegidos por cifrado de grado clínico bajo la Ley 21.668. Este registro es vinculante para la reserva.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={userData.whatsappOptIn}
                                    onChange={e => setUserData({ ...userData, whatsappOptIn: e.target.checked })}
                                    className="w-5 h-5 accent-indigo-600 rounded"
                                />
                                <span className="text-sm text-gray-400">Acepto recibir recordatorios y ofertas exclusivas vía WhatsApp.</span>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleBack} className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold">Volver</button>
                                <button
                                    disabled={!userData.name || !userData.email || !userData.phone}
                                    onClick={handleStep3Submit}
                                    className="flex-[2] py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-30"
                                >
                                    Ver Resumen de Pago
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card rounded-[40px] p-8 max-w-xl mx-auto space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LucideCreditCard className="w-10 h-10 text-indigo-400" />
                                </div>
                                <h3 className="text-3xl font-black">Resumen de Pago</h3>
                                <p className="text-gray-500">Confirmación obligatoria para asegurar cupo</p>
                            </div>

                            <div className="space-y-4 py-6 border-y border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-medium">Servicio</span>
                                    <span className="font-bold">{selectedService?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-medium">Fecha y Hora</span>
                                    <span className="font-bold">
                                        {selectedDate && selectedTime
                                            ? `${new Date(selectedDate).toLocaleDateString('es-CL')} - ${selectedTime}`
                                            : 'No seleccionada'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-medium">Paciente</span>
                                    <span className="font-bold">{userData.name}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 text-2xl">
                                    <span className="font-black">Total</span>
                                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                                        ${selectedService?.price.toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleFinalize}
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl font-black text-xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? 'Procesando...' : 'Pagar Ahora con Transbank/MP'}
                                    <LucideChevronRight className="w-6 h-6" />
                                </button>
                                <div className="flex justify-center gap-6 opacity-30 grayscale">
                                    {/* Logos would go here */}
                                    <span className="text-[10px] font-bold">WEBPAY PLUS</span>
                                    <span className="text-[10px] font-bold">MERCADO PAGO</span>
                                    <span className="text-[10px] font-bold">MASTERCARD</span>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                                    * Al pagar confirmas tu asistencia. No se realizan devoluciones por inasistencia sin aviso de 24h previo.
                                    Política de No-Show activa (Eliminación del 100% de inasistencias).
                                </p>
                            </div>

                            <button onClick={handleBack} disabled={loading} className="w-full text-center text-gray-500 text-sm">Volver a mis datos</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Trust elements */}
            <div className="mt-12 flex gap-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <LucideShieldCheck className="w-4 h-4" /> Pago 100% Seguro
                </div>
                <div className="flex items-center gap-2">
                    <LucideSparkles className="w-4 h-4" /> Calidad Certificada
                </div>
            </div>
        </div>
    );
}

export default function BookingWizard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingWizardContent />
        </Suspense>
    );
}
