'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideLock, LucideEye, LucideEyeOff, LucideCheck, LucideAlertCircle, LucideLoader2 } from 'lucide-react';
import Link from 'next/link';
import { updatePassword } from '@/lib/auth/supabase-auth';
import { validatePassword, getPasswordStrengthColor } from '@/lib/auth/password-validator';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const passwordStrength = validatePassword(password);

    const handleSubmit = async (e: React.FormEvent) => {
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

        setLoading(true);

        try {
            const { error: resetError } = await updatePassword(password);

            if (resetError) throw resetError;

            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al actualizar contraseña');
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
                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-white mb-2">
                                    Nueva Contraseña
                                </h1>
                                <p className="text-white/70">
                                    Ingresa tu nueva contraseña segura
                                </p>
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

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Nueva Contraseña
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
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <LucideLoader2 className="w-5 h-5 animate-spin" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Contraseña'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success Message */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <LucideCheck className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    ¡Contraseña Actualizada!
                                </h2>
                                <p className="text-white/70">
                                    Tu contraseña ha sido cambiada exitosamente
                                </p>
                                <p className="text-white/50 text-sm mt-4">
                                    Redirigiendo al login...
                                </p>
                            </div>
                        </motion.div>
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
