'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideUser, LucidePhone, LucideCheck, LucideAlertCircle, LucideLoader2, LucideArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signUp } from '@/lib/auth/supabase-auth';
import { validatePassword, getPasswordStrengthColor } from '@/lib/auth/password-validator';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordStrength = validatePassword(password);

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (passwordStrength.score < 2) {
            setError('Contraseña muy débil. ' + passwordStrength.feedback.join(', '));
            return;
        }

        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: authError } = await signUp(email, password, name);

            if (authError) throw authError;

            // Success - show verification message
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Error al crear cuenta');
            setStep(1); // Back to step 1 on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B8FB9] via-[#7986CB] to-[#9575CD]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">
                            Crear Cuenta
                        </h1>
                        <p className="text-white/70">
                            Completa el formulario para comenzar
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-cyan-400 text-gray-900' : 'bg-white/10 text-white/50'
                                    }`}>
                                    {s}
                                </div>
                                {s < 2 && (
                                    <div className={`w-12 h-1 rounded transition-all ${step > s ? 'bg-cyan-400' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3"
                        >
                            <LucideAlertCircle className="w-5 h-5 text-red-300 mt-0.5" />
                            <p className="text-sm text-red-100">{error}</p>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* Step 1: Email & Password */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleStep1Submit}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                        >
                                            {showPassword ? <LucideEyeOff className="w-5 h-5" /> : <LucideEye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength */}
                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-white/70">Seguridad:</span>
                                                <span className="text-xs text-white/90">{passwordStrength.label}</span>
                                            </div>
                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900 flex items-center justify-center gap-2"
                                >
                                    Continuar
                                    <LucideArrowRight className="w-5 h-5" />
                                </button>
                            </motion.form>
                        )}

                        {/* Step 2: Personal Info */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleFinalSubmit}
                                className="space-y-4"
                            >
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Nombre Completo
                                    </label>
                                    <div className="relative">
                                        <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Teléfono (Opcional)
                                    </label>
                                    <div className="relative">
                                        <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            placeholder="+56 9 1234 5678"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-bold text-white"
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <LucideLoader2 className="w-5 h-5 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <LucideCheck className="w-5 h-5" />
                                                Crear Cuenta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* Step 3: Success Message */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <LucideCheck className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        ¡Cuenta Creada!
                                    </h2>
                                    <p className="text-white/70">
                                        Te hemos enviado un email de verificación a <strong>{email}</strong>
                                    </p>
                                </div>
                                <Link
                                    href="/auth/login"
                                    className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900"
                                >
                                    Ir a Login
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Link */}
                    {step < 3 && (
                        <div className="mt-6 text-center">
                            <p className="text-white/70 text-sm">
                                ¿Ya tienes cuenta?{' '}
                                <Link
                                    href="/auth/login"
                                    className="text-cyan-300 hover:text-cyan-200 font-semibold"
                                >
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link
                        href="/"
                        className="text-white/70 hover:text-white text-sm"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
