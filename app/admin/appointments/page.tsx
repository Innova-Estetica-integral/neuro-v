'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
    LucideCalendar,
    LucideFilter,
    LucidePlus,
    LucideCheck,
    LucideX
} from 'lucide-react';

interface Appointment {
    id: string;
    start: string;
    end: string;
    status: string;
    service_type_display: string;
    final_price_clp: number;
    patient: {
        name_text: string;
        telecom_email: string;
        telecom_phone: string;
    };
}

export default function AppointmentsManagementPage() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

    async function fetchAppointments() {
        try {
            const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const res = await fetch(`/api/admin/appointments${params}`);
            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateAppointmentStatus(appointmentId: string, newStatus: string) {
        try {
            const res = await fetch('/api/admin/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, status: newStatus })
            });

            if (res.ok) {
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando citas..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">
                            Gestión de Citas
                        </h1>
                        <p className="text-gray-600">
                            Administra las citas de la clínica
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2">
                        <LucidePlus className="w-4 h-4" />
                        Nueva Cita
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-6 flex items-center gap-4">
                    <LucideFilter className="w-5 h-5 text-gray-400" />
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'Todas' },
                            { value: 'booked', label: 'Confirmadas' },
                            { value: 'pending', label: 'Pendientes' },
                            { value: 'cancelled', label: 'Canceladas' }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setStatusFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === filter.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments Table */}
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <LucideCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No hay citas para mostrar</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Fecha & Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Paciente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Servicio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(appointment.start).toLocaleDateString('es-CL')}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(appointment.start).toLocaleTimeString('es-CL', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {appointment.patient?.name_text || 'Sin nombre'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.patient?.telecom_phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {appointment.service_type_display}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'booked' ? 'bg-green-100 text-green-700' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    appointment.status === 'fulfilled' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ${appointment.final_price_clp?.toLocaleString('es-CL') || '0'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {appointment.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'booked')}
                                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Confirmar"
                                                    >
                                                        <LucideCheck className="w-4 h-4 text-green-600" />
                                                    </button>
                                                )}
                                                {appointment.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Cancelar"
                                                    >
                                                        <LucideX className="w-4 h-4 text-red-600" />
                                                    </button>
                                                )}
                                            </div>
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
