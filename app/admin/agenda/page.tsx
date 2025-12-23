'use client';

import { useState, useEffect } from 'react';
import { Calendar as MantineCalendar } from '@mantine/dates';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LucideCalendar, LucideFilter } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Appointment {
    id: string;
    start: string;
    status: string;
    service_type_display: string;
    patient: {
        name_text: string;
    };
}

export default function AgendaPage() {
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    async function fetchAppointments() {
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('appointment')
                .select(`
          *,
          patient:participant_patient_id (
            name_text
          )
        `)
                .gte('start', startOfDay.toISOString())
                .lte('start', endOfDay.toISOString())
                .order('start', { ascending: true });

            if (error) throw error;

            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Agenda</h1>
                    <p className="text-gray-600">Gestiona las citas del calendario</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <LucideCalendar className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold">Calendario</h2>
                            </div>
                            <MantineCalendar
                                getDayProps={(date) => {
                                    const dateObj = (typeof date === 'string' ? new Date(date) : date) as Date;
                                    return {
                                        selected: dateObj?.toDateString() === selectedDate.toDateString(),
                                        onClick: () => setSelectedDate(dateObj),
                                    };
                                }}
                                firstDayOfWeek={1}
                            />
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Citas del {selectedDate.toLocaleDateString('es-CL', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {appointments.length} {appointments.length === 1 ? 'cita' : 'citas'}
                                    </p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <LucideFilter className="w-4 h-4" />
                                    Filtrar
                                </button>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <LoadingSpinner text="Cargando citas..." />
                                ) : appointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <LucideCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No hay citas programadas para este día</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {appointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-bold text-gray-900">
                                                                {new Date(appointment.start).toLocaleTimeString('es-CL', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${appointment.status === 'booked' ? 'bg-green-100 text-green-700' :
                                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {appointment.status}
                                                            </span>
                                                        </div>
                                                        <p className="font-semibold text-gray-900 mb-1">
                                                            {appointment.patient?.name_text || 'Sin paciente'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {appointment.service_type_display}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
