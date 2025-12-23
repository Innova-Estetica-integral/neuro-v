'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
    LucideUser,
    LucideMail,
    LucideLock,
    LucideSave,
    LucideBell
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Profile {
    id: string;
    email: string;
    name: string;
    phone: string;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveProfile() {
        if (!profile) return;

        setSaving(true);
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { error } = await supabase
                .from('profiles')
                .update({
                    name: profile.name,
                    phone: profile.phone
                })
                .eq('id', profile.id);

            if (error) throw error;

            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error al guardar perfil');
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        if (passwords.new !== passwords.confirm) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (passwords.new.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            alert('Contraseña actualizada correctamente');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            console.error('Error changing password:', error);
            alert(error.message || 'Error al cambiar contraseña');
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando configuración..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Configuración
                    </h1>
                    <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <LucideUser className="w-5 h-5" />
                        Información Personal
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={profile?.name || ''}
                                onChange={(e) => setProfile(profile ? { ...profile, name: e.target.value } : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <LucideMail className="w-4 h-4 inline-block mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                El email no puede ser modificado
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={profile?.phone || ''}
                                onChange={(e) => setProfile(profile ? { ...profile, phone: e.target.value } : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold flex items-center gap-2"
                        >
                            {saving ? <LoadingSpinner size="sm" /> : <LucideSave className="w-4 h-4" />}
                            Guardar Cambios
                        </button>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <LucideLock className="w-5 h-5" />
                        Cambiar Contraseña
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
                        >
                            Actualizar Contraseña
                        </button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <LucideBell className="w-5 h-5" />
                        Preferencias de Notificaciones
                    </h2>

                    <p className="text-sm text-gray-600">
                        Próximamente podrás configurar tus preferencias de notificaciones
                    </p>
                </div>
            </div>
        </div>
    );
}
