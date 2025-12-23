'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideMail, LucideCheck, LucideAlertCircle, LucideLoader2, LucideArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth/supabase-auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: resetError } = await resetPassword(email);

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar email de recuperación');
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
                                    Recuperar Contraseña
                                </h1>
                                <p className="text-white/70">
                                    Te enviaremos un link para restablecer tu contraseña
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
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <LucideLoader2 className="w-5 h-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Link de Recuperación'
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-6 text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <LucideArrowLeft className="w-4 h-4" />
                                    Volver al login
                                </Link>
                            </div>
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
                                    Email Enviado
                                </h2>
                                <p className="text-white/70">
                                    Hemos enviado un link de recuperación a <strong>{email}</strong>
                                </p>
                                <p className="text-white/50 text-sm mt-4">
                                    Revisa tu bandeja de entrada y sigue las instrucciones
                                </p>
                            </div>
                            <Link
                                href="/auth/login"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-xl font-bold text-gray-900"
                            >
                                Volver al Login
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link
                        href="/"
                        className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
