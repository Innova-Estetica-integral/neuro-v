'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LucideCalendar, LucideMapPin, LucideClock, LucideX } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Appointment {
    id: string;
    start: string;
    status: string;
    service_type_display: string;
    final_price_clp: number;
    location_text: string;
}

export default function PatientAppointmentsPage() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        fetchAppointments();
    }, []);

    async function fetchAppointments() {
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { data, error } = await supabase
                .from('appointment')
                .select('*')
                .order('start', { ascending: false });

            if (error) throw error;

            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    }

    const now = new Date();
    const upcomingAppointments = appointments.filter(apt => new Date(apt.start) >= now);
    const pastAppointments = appointments.filter(apt => new Date(apt.start) < now);

    const displayedAppointments = view === 'upcoming' ? upcomingAppointments : pastAppointments;

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando tus citas..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Mis Citas</h1>
                    <p className="text-gray-600">Gestiona tus citas médicas</p>
                </div>

                {/* Toggle View */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setView('upcoming')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'upcoming'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Próximas ({upcomingAppointments.length})
                    </button>
                    <button
                        onClick={() => setView('past')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'past'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Historial ({pastAppointments.length})
                    </button>
                </div>

                {/* Appointments List */}
                {displayedAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <LucideCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {view === 'upcoming' ? 'No tienes citas programadas' : 'No hay citas en tu historial'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {appointment.service_type_display}
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <LucideClock className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {new Date(appointment.start).toLocaleString('es-CL', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {appointment.location_text && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <LucideMapPin className="w-4 h-4" />
                                                    <span className="text-sm">{appointment.location_text}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${appointment.status === 'booked' ? 'bg-green-100 text-green-700' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    appointment.status === 'fulfilled' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                        <p className="text-lg font-bold text-gray-900 mt-2">
                                            ${appointment.final_price_clp?.toLocaleString('es-CL') || '0'}
                                        </p>
                                    </div>
                                </div>

                                {view === 'upcoming' && appointment.status === 'booked' && (
                                    <div className="pt-4 border-t border-gray-200 flex gap-3">
                                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">
                                            Ver Detalles
                                        </button>
                                        <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-semibold flex items-center gap-2">
                                            <LucideX className="w-4 h-4" />
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
