'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DonnaBrain, DonnaInsight } from '@/components/DonnaBrain';
import {
    LucideCalendar,
    LucideDollarSign,
    LucideUsers,
    LucideTrendingUp,
    LucideActivity
} from 'lucide-react';

interface DashboardStats {
    totalAppointments: number;
    totalRevenue: number;
    newPatients: number;
    conversionRate: string;
}

interface ChartDataPoint {
    date: string;
    count: number;
}

interface Appointment {
    id: string;
    start: string;
    status: string;
    service_type_display: string;
    final_price_clp: number;
    patient: {
        name_text: string;
        telecom_email: string;
    };
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
    const [donnaInsights, setDonnaInsights] = useState<DonnaInsight[]>([]);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const res = await fetch('/api/admin/dashboard');
                const data = await res.json();

                setStats(data.stats);
                setChartData(data.chartData);
                setRecentAppointments(data.recentAppointments);
                setDonnaInsights(data.donnaInsights);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Resumen de métricas y actividad
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Modo Ejecutivo</p>
                            <p className="text-xs text-gray-500">Donna actúa por su cuenta</p>
                        </div>
                        <button
                            onClick={() => alert('Activando Modo Ejecutivo...')}
                            className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 focus:outline-none"
                        >
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                    </div>
                </div>

                {/* Donna Engine */}
                <DonnaBrain insights={donnaInsights} />

                {/* KPI Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Citas Este Mes"
                            value={stats.totalAppointments}
                            icon={LucideCalendar}
                            iconColor="text-blue-600"
                        />

                        <StatsCard
                            title="Revenue Total"
                            value={`$${stats.totalRevenue.toLocaleString('es-CL')}`}
                            icon={LucideDollarSign}
                            iconColor="text-green-600"
                            change="+12%"
                            changeType="positive"
                        />

                        <StatsCard
                            title="Pacientes Nuevos"
                            value={stats.newPatients}
                            icon={LucideUsers}
                            iconColor="text-purple-600"
                        />

                        <StatsCard
                            title="Tasa de Conversión"
                            value={stats.conversionRate}
                            icon={LucideTrendingUp}
                            iconColor="text-cyan-600"
                            change="+5%"
                            changeType="positive"
                        />
                    </div>
                )}

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Citas por Día
                        </h2>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {chartData.map((point, index) => {
                                const maxCount = Math.max(...chartData.map(p => p.count));
                                const height = (point.count / maxCount) * 100;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors cursor-pointer"
                                            style={{ height: `${height}%` }}
                                            title={`${point.count} citas`}
                                        />
                                        <span className="text-xs text-gray-600">
                                            {new Date(point.date).getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Appointments Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Últimas Citas
                        </h2>
                    </div>

                    {recentAppointments.length === 0 ? (
                        <div className="p-12 text-center">
                            <LucideActivity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No hay citas registradas aún</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Fecha
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(appointment.start).toLocaleDateString('es-CL', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {appointment.patient?.name_text || 'Sin nombre'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {appointment.service_type_display}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'booked' ? 'bg-green-100 text-green-700' :
                                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                ${appointment.final_price_clp?.toLocaleString('es-CL') || '0'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
