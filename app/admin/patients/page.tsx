'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LucideSearch, LucideUsers, LucideMail, LucidePhone, LucideEdit } from 'lucide-react';

interface Patient {
    id: string;
    name_text: string;
    telecom_email: string;
    telecom_phone: string;
    gender: string;
    birthdate: string;
    metadata_created: string;
}

export default function AdminPatientsPage() {
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (search) {
            const filtered = patients.filter(p =>
                p.name_text?.toLowerCase().includes(search.toLowerCase()) ||
                p.telecom_email?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients);
        }
    }, [search, patients]);

    async function fetchPatients() {
        try {
            const res = await fetch('/api/admin/patients');
            const data = await res.json();
            setPatients(data.patients || []);
            setFilteredPatients(data.patients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando pacientes..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Pacientes</h1>
                    <p className="text-gray-600">
                        Gestiona la base de datos de pacientes
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                        {filteredPatients.length} pacientes
                    </div>
                </div>

                {/* Patients List */}
                {filteredPatients.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <LucideUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {search ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Paciente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Género
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Registrado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {patient.name_text || 'Sin nombre'}
                                                </p>
                                                {patient.birthdate && (
                                                    <p className="text-sm text-gray-600">
                                                        {new Date().getFullYear() - new Date(patient.birthdate).getFullYear()} años
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <LucideMail className="w-4 h-4" />
                                                    {patient.telecom_email || '-'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <LucidePhone className="w-4 h-4" />
                                                    {patient.telecom_phone || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patient.gender || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(patient.metadata_created).toLocaleDateString('es-CL')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <LucideEdit className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
