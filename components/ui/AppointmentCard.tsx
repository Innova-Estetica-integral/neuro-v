import React from 'react';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface AppointmentCardProps {
    id: string;
    patientName: string;
    serviceType: string;
    dateTime: string;
    practitionerName?: string;
    status: AppointmentStatus;
    price?: number;
    notes?: string;
    compact?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onCancel?: (id: string) => void;
}

const statusConfig: Record<AppointmentStatus, { label: string; color: string; bgColor: string }> = {
    pending: { label: 'Pendiente', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20 border-yellow-500/30' },
    confirmed: { label: 'Confirmada', color: 'text-green-400', bgColor: 'bg-green-500/20 border-green-500/30' },
    completed: { label: 'Completada', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/30' },
    cancelled: { label: 'Cancelada', color: 'text-red-400', bgColor: 'bg-red-500/20 border-red-500/30' },
};

export function AppointmentCard({
    id,
    patientName,
    serviceType,
    dateTime,
    practitionerName,
    status,
    price,
    notes,
    compact = false,
    onView,
    onEdit,
    onCancel,
}: AppointmentCardProps) {
    const config = statusConfig[status];
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (compact) {
        return (
            <div className={`glass rounded-lg border p-4 transition hover:scale-[1.02] ${config.bgColor}`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{patientName}</h3>
                            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">{serviceType}</p>
                        <p className="mt-1 text-xs text-gray-400">
                            {formattedDate} • {formattedTime}
                        </p>
                    </div>
                    {(onView || onEdit || onCancel) && (
                        <div className="flex gap-2">
                            {onView && (
                                <button
                                    onClick={() => onView(id)}
                                    className="text-gray-400 transition hover:text-blue-400"
                                    title="Ver detalles"
                                >
                                    👁️
                                </button>
                            )}
                            {onEdit && status !== 'cancelled' && status !== 'completed' && (
                                <button
                                    onClick={() => onEdit(id)}
                                    className="text-gray-400 transition hover:text-green-400"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                            )}
                            {onCancel && status !== 'cancelled' && status !== 'completed' && (
                                <button
                                    onClick={() => onCancel(id)}
                                    className="text-gray-400 transition hover:text-red-400"
                                    title="Cancelar"
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`glass rounded-xl border p-6 transition hover:scale-[1.02] ${config.bgColor}`}>
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{patientName}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.color} ${config.bgColor}`}>
                            {config.label}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-300">{serviceType}</p>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                    <span>📅</span>
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <span>🕐</span>
                    <span>{formattedTime}</span>
                </div>
                {practitionerName && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <span>👨‍⚕️</span>
                        <span>{practitionerName}</span>
                    </div>
                )}
                {price && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <span>💰</span>
                        <span>${price.toLocaleString('es-CL')} CLP</span>
                    </div>
                )}
            </div>

            {notes && (
                <div className="mt-4 rounded-lg bg-black/20 p-3">
                    <p className="text-sm text-gray-300">{notes}</p>
                </div>
            )}

            {(onView || onEdit || onCancel) && (
                <div className="mt-4 flex gap-2">
                    {onView && (
                        <button
                            onClick={() => onView(id)}
                            className="flex-1 rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600/30"
                        >
                            Ver Detalles
                        </button>
                    )}
                    {onEdit && status !== 'cancelled' && status !== 'completed' && (
                        <button
                            onClick={() => onEdit(id)}
                            className="flex-1 rounded-lg bg-green-600/20 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-600/30"
                        >
                            Editar
                        </button>
                    )}
                    {onCancel && status !== 'cancelled' && status !== 'completed' && (
                        <button
                            onClick={() => onCancel(id)}
                            className="flex-1 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600/30"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
