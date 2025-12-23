'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideBuilding2, LucideMapPin, LucideMail, LucidePhone,
    LucideCreditCard, LucideUser, LucideCheck, LucideAlertCircle,
    LucideLoader2, LucideArrowRight, LucideArrowLeft, LucideEye, LucideEyeOff
} from 'lucide-react';
import Link from 'next/link';

interface OnboardingData {
    // Step 1
    name: string;
    slug: string;
    address: string;
    phone: string;
    email: string;

    // Step 2
    provider: 'mercadopago' | 'transbank';
    environment: 'sandbox' | 'production';
    mercadopagoAccessToken: string;
    mercadopagoPublicKey: string;
    transbankCommerceCode: string;
    transbankApiKey: string;

    // Step 3
    adminEmail: string;
    adminName: string;
}

export default function NewClinicPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSecrets, setShowSecrets] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);


    const [data, setData] = useState<OnboardingData>({
        name: '',
        slug: '',
        address: '',
        phone: '',
        email: '',
        provider: 'mercadopago',
        environment: 'sandbox',
        mercadopagoAccessToken: '',
        mercadopagoPublicKey: '',
        transbankCommerceCode: '',
        transbankApiKey: '',
        adminEmail: '',
        adminName: ''
    });

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setData(prev => ({
            ...prev,
            name,
            slug: name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 50)
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/clinics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al crear clínica');
            }

            // Success
            setStep(5); // Confirmation step
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, title: 'Información Básica' },
        { num: 2, title: 'Pagos' },
        { num: 3, title: 'Administrador' },
        { num: 4, title: 'Confirmación' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/clinics" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
                        ← Volver a clínicas
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900">Nueva Clínica</h1>
                    <p className="text-gray-600">Completa el wizardpara dar de alta una nueva clínica en el sistema</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((s, idx) => (
                            <div key={s.num} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {step > s.num ? <LucideCheck className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className="text-xs mt-2 text-gray-600 text-center">{s.title}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`h-1 flex-1 mx-2 rounded transition-all ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
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

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre de la Clínica *
                                    </label>
                                    <div className="relative">
                                        <LucideBuilding2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Clínica Los Andes"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Slug (URL) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData(prev => ({ ...prev, slug: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                        placeholder="clinica-los-andes"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">URL: {origin || '...'}/{data.slug}</p>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Dirección
                                        </label>
                                        <div className="relative">
                                            <LucideMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={(e) => setData(prev => ({ ...prev, address: e.target.value }))}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Av. Providencia 1234"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="+56 9 1234 5678"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email de Contacto *
                                    </label>
                                    <div className="relative">
                                        <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="contacto@clinica.cl"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!data.name || !data.slug || !data.email}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Continuar
                                    <LucideArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Payment Credentials */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Pasarela de Pago *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(['mercadopago', 'transbank'] as const).map((prov) => (
                                            <button
                                                key={prov}
                                                type="button"
                                                onClick={() => setData(prev => ({ ...prev, provider: prov }))}
                                                className={`p-4 border-2 rounded-lg transition-all ${data.provider === prov
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <LucideCreditCard className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                                                <div className="font-semibold capitalize">{prov}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Entorno *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(['sandbox', 'production'] as const).map((env) => (
                                            <button
                                                key={env}
                                                type="button"
                                                onClick={() => setData(prev => ({ ...prev, environment: env }))}
                                                className={`p-3 border-2 rounded-lg transition-all ${data.environment === env
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-semibold capitalize">{env}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {data.provider === 'mercadopago' && (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Access Token *
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSecrets(!showSecrets)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    {showSecrets ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <input
                                                type={showSecrets ? 'text' : 'password'}
                                                value={data.mercadopagoAccessToken}
                                                onChange={(e) => setData(prev => ({ ...prev, mercadopagoAccessToken: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                placeholder="APP_USR-xxxxxxxxxxxx"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Public Key *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.mercadopagoPublicKey}
                                                onChange={(e) => setData(prev => ({ ...prev, mercadopagoPublicKey: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                placeholder="APP_USR-xxxxxxxxxxxx"
                                            />
                                        </div>
                                    </>
                                )}

                                {data.provider === 'transbank' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Commerce Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.transbankCommerceCode}
                                                onChange={(e) => setData(prev => ({ ...prev, transbankCommerceCode: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                placeholder="597055555532"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    API Key *
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSecrets(!showSecrets)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    {showSecrets ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <input
                                                type={showSecrets ? 'text' : 'password'}
                                                value={data.transbankApiKey}
                                                onChange={(e) => setData(prev => ({ ...prev, transbankApiKey: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                placeholder="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LucideArrowLeft className="w-5 h-5" />
                                        Atrás
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                                    >
                                        Continuar
                                        <LucideArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Admin User */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre del Administrador *
                                    </label>
                                    <div className="relative">
                                        <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.adminName}
                                            onChange={(e) => setData(prev => ({ ...prev, adminName: e.target.value }))}
                                            required
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email del Administrador *
                                    </label>
                                    <div className="relative">
                                        <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={data.adminEmail}
                                            onChange={(e) => setData(prev => ({ ...prev, adminEmail: e.target.value }))}
                                            required
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="admin@clinica.cl"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Se enviará un email de invitación a esta dirección
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LucideArrowLeft className="w-5 h-5" />
                                        Atrás
                                    </button>
                                    <button
                                        onClick={() => setStep(4)}
                                        disabled={!data.adminName || !data.adminEmail}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        Continuar
                                        <LucideArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Confirmation */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-lg">Resumen</h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Clínica:</span>
                                            <span className="font-semibold">{data.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Slug:</span>
                                            <span className="font-mono">{data.slug}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pasarela:</span>
                                            <span className="capitalize">{data.provider} ({data.environment})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Administrador:</span>
                                            <span>{data.adminName} ({data.adminEmail})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                                    <LucideAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div className="text-sm text-yellow-800">
                                        <strong>Importante:</strong> Las credenciales de pago serán encriptadas y almacenadas de forma segura.
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={loading}
                                        className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <LucideArrowLeft className="w-5 h-5" />
                                        Atrás
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <LucideLoader2 className="w-5 h-5 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <LucideCheck className="w-5 h-5" />
                                                Crear Clínica
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Success */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-8"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <LucideCheck className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        ¡Clínica Creada!
                                    </h2>
                                    <p className="text-gray-600">
                                        Se ha enviado un email de invitación a <strong>{data.adminEmail}</strong>
                                    </p>
                                </div>
                                <Link
                                    href="/admin/clinics"
                                    className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                                >
                                    Ver Clínicas
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
