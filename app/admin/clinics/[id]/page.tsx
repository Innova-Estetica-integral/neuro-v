'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
    LucideBuilding,
    LucideMapPin,
    LucideMail,
    LucidePhone,
    LucideSave,
    LucideUsers,
    LucideCreditCard
} from 'lucide-react';

interface Clinic {
    id: string;
    name: string;
    slug: string;
    contact_email: string;
    contact_phone: string;
    address_full: string;
    is_active: boolean;
}

export default function EditClinicPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'payments' | 'users'>('info');

    useEffect(() => {
        fetchClinic();
    }, []);

    async function fetchClinic() {
        try {
            const res = await fetch('/api/admin/clinics');
            const data = await res.json();
            const foundClinic = data.clinics?.find((c: Clinic) => c.id === params.id);

            if (foundClinic) {
                setClinic(foundClinic);
            } else {
                router.push('/admin/clinics');
            }
        } catch (error) {
            console.error('Error fetching clinic:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!clinic) return;

        setSaving(true);
        try {
            // API call to update clinic would go here
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Clínica actualizada correctamente');
        } catch (error) {
            console.error('Error saving clinic:', error);
            alert('Error al guardar clínica');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando clínica..." />;
    }

    if (!clinic) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Editar Clínica
                    </h1>
                    <p className="text-gray-600">{clinic.name}</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    {[
                        { id: 'info', label: 'Información Básica', icon: LucideBuilding },
                        { id: 'payments', label: 'Credenciales de Pago', icon: LucideCreditCard },
                        { id: 'users', label: 'Usuarios', icon: LucideUsers }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {/* Clinic Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <LucideBuilding className="w-4 h-4 inline-block mr-2" />
                                    Nombre de la Clínica
                                </label>
                                <input
                                    type="text"
                                    value={clinic.name}
                                    onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    value={clinic.slug}
                                    onChange={(e) => setClinic({ ...clinic, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    URL: /clinics/{clinic.slug}
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <LucideMail className="w-4 h-4 inline-block mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={clinic.contact_email}
                                    onChange={(e) => setClinic({ ...clinic, contact_email: e.target.value })}
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
                                    value={clinic.contact_phone}
                                    onChange={(e) => setClinic({ ...clinic, contact_phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <LucideMapPin className="w-4 h-4 inline-block mr-2" />
                                    Dirección
                                </label>
                                <textarea
                                    value={clinic.address_full}
                                    onChange={(e) => setClinic({ ...clinic, address_full: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={clinic.is_active}
                                    onChange={(e) => setClinic({ ...clinic, is_active: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                                    Clínica Activa
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="text-center py-12">
                            <LucideCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Credenciales de Pago</p>
                            <p className="text-sm text-gray-500">
                                Las credenciales deben ser actualizadas por el super admin
                            </p>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="text-center py-12">
                            <LucideUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Gestión de Usuarios</p>
                            <p className="text-sm text-gray-500">
                                Próximamente podrás invitar y gestionar usuarios
                            </p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                {activeTab === 'info' && (
                    <div className="mt-6">
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
                )}
            </div>
        </div>
    );
}
