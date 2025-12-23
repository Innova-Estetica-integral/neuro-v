'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LucideBuilding2, LucidePlus, LucideLoader2 } from 'lucide-react';

interface Clinic {
    id: string;
    name: string;
    slug: string;
    email: string;
    active: boolean;
    created_at: string;
}

export default function ClinicsListPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClinics() {
            try {
                const res = await fetch('/api/admin/clinics');
                const data = await res.json();
                setClinics(data.clinics || []);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchClinics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LucideLoader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Clínicas</h1>
                        <p className="text-gray-600">Gestiona las clínicas del sistema</p>
                    </div>
                    <Link
                        href="/admin/clinics/new"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                        <LucidePlus className="w-5 h-5" />
                        Nueva Clínica
                    </Link>
                </div>

                {/* Clinics Grid */}
                {clinics.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <LucideBuilding2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No hay clínicas creadas
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Crea tu primera clínica para comenzar
                        </p>
                        <Link
                            href="/admin/clinics/new"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        >
                            Crear Primera Clínica
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clinics.map((clinic) => (
                            <Link
                                key={clinic.id}
                                href={`/admin/clinics/${clinic.id}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <LucideBuilding2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${clinic.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {clinic.active ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {clinic.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 font-mono">
                                    /{clinic.slug}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {clinic.email}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
