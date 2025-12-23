'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideCheck, LucideAlertCircle, LucideLoader2, LucideX } from 'lucide-react';

function ConsentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patient_id');
    const clinicId = searchParams.get('clinic_id');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [consents, setConsents] = useState({
        law_21668: false,  // Datos de salud
        law_19628: false,  // Datos personales
        law_20584: false,  // Derechos paciente
        marketing: false,
        whatsapp: false
    });

    const canProceed = consents.law_21668 && consents.law_19628 && consents.law_20584 && hasSignature;

    // Canvas drawing handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            setIsDrawing(true);
            setHasSignature(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
        }
    };

    const handleSubmit = async () => {
        if (!canProceed) {
            setError('Debes aceptar todos los consentimientos obligatorios y firmar');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Get signature as data URL
            const canvas = canvasRef.current;
            const signatureData = canvas?.toDataURL('image/png') || '';

            const response = await fetch('/api/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    clinicId,
                    consents,
                    signatureData,
                    ipAddress: '', // would be filled server-side
                    userAgent: navigator.userAgent
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al guardar consentimiento');
            }

            // Success - redirect to booking
            router.push('/booking?consent_id=' + result.consentId);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 py-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Consentimiento y Autorización
                    </h1>
                    <p className="text-gray-600">
                        Por favor lee y acepta los términos para continuar con tu reserva
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                    >
                        <LucideAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                    {/* Consent Checkboxes */}
                    <div className="space-y-6">
                        {/* Law 21.668 - Datos de Salud */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={consents.law_21668}
                                onChange={(e) => setConsents(prev => ({ ...prev, law_21668: e.target.checked }))}
                                className="mt-1 w-5 h-5 text-blue-600 rounded"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Datos de Salud Digital (Ley 21.668) *
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Autorizo el tratamiento de mis datos de salud para evaluación médica, diagnóstico, registro de historial clínico electrónico, almacenamiento en servidores seguros y comunicaciones relacionadas con mi salud.
                                </p>
                            </div>
                        </label>

                        {/* Law 19.628 - Datos Personales */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={consents.law_19628}
                                onChange={(e) => setConsents(prev => ({ ...prev, law_19628: e.target.checked }))}
                                className="mt-1 w-5 h-5 text-blue-600 rounded"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Protección de Datos Personales (Ley 19.628) *
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Autorizo el tratamiento de mis datos personales (nombre, RUT, dirección, teléfono, email) con fines de identificación y contacto, almacenamiento en base de datos segura. Conozco mi derecho a rectificación y eliminación.
                                </p>
                            </div>
                        </label>

                        {/* Law 20.584 - Derechos del Paciente */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={consents.law_20584}
                                onChange={(e) => setConsents(prev => ({ ...prev, law_20584: e.target.checked }))}
                                className="mt-1 w-5 h-5 text-blue-600 rounded"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Derechos y Deberes del Paciente (Ley 20.584) *
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    He sido informado de mis derechos como paciente: derecho a información clara, confidencialidad, aceptar o rechazar tratamiento, y segunda opinión médica.
                                </p>
                            </div>
                        </label>

                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <p className="text-sm font-semibold text-gray-700">Opcionales:</p>

                            {/* Marketing */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consents.marketing}
                                    onChange={(e) => setConsents(prev => ({ ...prev, marketing: e.target.checked }))}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        Comunicaciones de Marketing
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Acepto recibir ofertas, promociones y novedades de servicios
                                    </p>
                                </div>
                            </label>

                            {/* WhatsApp */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consents.whatsapp}
                                    onChange={(e) => setConsents(prev => ({ ...prev, whatsapp: e.target.checked }))}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        Notificaciones por WhatsApp
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Acepto recibir recordatorios y confirmaciones via WhatsApp
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Signature Pad */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Firma Digital *
                        </label>
                        <div className="border-2 border-gray-300 rounded-lg relative bg-white">
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={200}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className="w-full cursor-crosshair touch-none"
                            />
                            {!hasSignature && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
                                    Firma aquí
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={clearSignature}
                                className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <LucideX className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={!canProceed || loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LucideLoader2 className="w-5 h-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <LucideCheck className="w-5 h-5" />
                                    Aceptar y Continuar
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-3">
                            * Campos obligatorios para continuar
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function ConsentPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <LucideLoader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <ConsentContent />
        </Suspense>
    );
}

