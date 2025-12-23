'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LucideUser, LucideMail, LucidePhone, LucideSave, LucideFileText } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface PatientProfile {
    id: string;
    name_text: string;
    telecom_email: string;
    telecom_phone: string;
    gender: string;
    birthdate: string;
}

export default function PatientProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<PatientProfile | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('patient')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!profile) return;

        setSaving(true);
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { error } = await supabase
                .from('patient')
                .update({
                    name_text: profile.name_text,
                    telecom_email: profile.telecom_email,
                    telecom_phone: profile.telecom_phone,
                    gender: profile.gender,
                    birthdate: profile.birthdate
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

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando perfil..." />;
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">No se encontró el perfil</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Mi Perfil</h1>
                    <p className="text-gray-600">Administra tu información personal</p>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <LucideUser className="w-4 h-4 inline-block mr-2" />
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={profile.name_text || ''}
                                onChange={(e) => setProfile({ ...profile, name_text: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <LucideMail className="w-4 h-4 inline-block mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.telecom_email || ''}
                                onChange={(e) => setProfile({ ...profile, telecom_email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <LucidePhone className="w-4 h-4 inline-block mr-2" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={profile.telecom_phone || ''}
                                onChange={(e) => setProfile({ ...profile, telecom_phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Género
                            </label>
                            <select
                                value={profile.gender || ''}
                                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        {/* Birthdate */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                value={profile.birthdate || ''}
                                onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    <LucideSave className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Consents Section */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LucideFileText className="w-5 h-5" />
                        Consentimientos Firmados
                    </h2>
                    <p className="text-sm text-gray-600">
                        Próximamente podrás ver y descargar tus consentimientos legales
                    </p>
                </div>
            </div>
        </div>
    );
}
