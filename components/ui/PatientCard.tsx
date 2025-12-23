import React from 'react';

type PsychProfile = 'impulsive' | 'analytic' | 'price_sensitive' | 'hesitant';

interface PatientCardProps {
    id: string;
    name: string;
    email: string;
    phone?: string;
    psychProfile?: PsychProfile;
    bantScore?: number;
    appointmentCount?: number;
    lastVisit?: string;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
}

const profileConfig: Record<PsychProfile, { label: string; emoji: string; color: string }> = {
    impulsive: { label: 'Impulsivo', emoji: '⚡', color: 'text-orange-400' },
    analytic: { label: 'Analítico', emoji: '🧠', color: 'text-blue-400' },
    price_sensitive: { label: 'Consciente del Precio', emoji: '💰', color: 'text-green-400' },
    hesitant: { label: 'Indeciso', emoji: '🤔', color: 'text-gray-400' },
};

const getBantScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400 bg-green-500/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
};

export function PatientCard({
    id,
    name,
    email,
    phone,
    psychProfile,
    bantScore,
    appointmentCount = 0,
    lastVisit,
    onView,
    onEdit,
}: PatientCardProps) {
    const profile = psychProfile ? profileConfig[psychProfile] : null;

    return (
        <div className="glass rounded-xl border border-white/10 p-5 transition hover:scale-[1.02] hover:border-white/20">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-2xl">
                        {profile?.emoji || '👤'}
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{name}</h3>
                        {profile && (
                            <p className={`text-xs ${profile.color}`}>{profile.label}</p>
                        )}
                    </div>
                </div>
                {bantScore !== undefined && (
                    <div className={`rounded-full px-3 py-1 text-xs font-bold ${getBantScoreColor(bantScore)}`}>
                        {bantScore}
                    </div>
                )}
            </div>

            <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">📧</span>
                    <span className="truncate">{email}</span>
                </div>
                {phone && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">📱</span>
                        <span>{phone}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">📅</span>
                    <span>{appointmentCount} cita{appointmentCount !== 1 ? 's' : ''}</span>
                </div>
                {lastVisit && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">🕐</span>
                        <span className="text-xs">
                            Última visita: {new Date(lastVisit).toLocaleDateString('es-CL')}
                        </span>
                    </div>
                )}
            </div>

            {(onView || onEdit) && (
                <div className="mt-4 flex gap-2">
                    {onView && (
                        <button
                            onClick={() => onView(id)}
                            className="flex-1 rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600/30"
                        >
                            Ver
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(id)}
                            className="flex-1 rounded-lg bg-green-600/20 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-600/30"
                        >
                            Editar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
