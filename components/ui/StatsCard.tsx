import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: {
        direction: 'up' | 'down';
        percentage: number;
    };
    accentColor?: string;
    loading?: boolean;
}

export function StatsCard({
    icon,
    label,
    value,
    trend,
    accentColor = 'blue',
    loading = false
}: StatsCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
        green: 'from-green-500/20 to-green-700/20 border-green-500/30',
        purple: 'from-purple-500/20 to-purple-700/20 border-purple-500/30',
        orange: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
    };

    const trendColor = trend?.direction === 'up' ? 'text-green-500' : 'text-red-500';
    const trendIcon = trend?.direction === 'up' ? '↑' : '↓';

    if (loading) {
        return (
            <div className="glass rounded-xl border p-6 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-gray-700/50 mb-4"></div>
                <div className="h-4 w-20 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-8 w-24 bg-gray-700/50 rounded"></div>
            </div>
        );
    }

    return (
        <div className={`glass rounded-xl border bg-gradient-to-br p-6 transition hover:scale-105 ${colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.blue}`}>
            <div className="mb-4 flex items-center justify-between">
                <div className="text-2xl">{icon}</div>
                {trend && (
                    <span className={`text-sm font-semibold ${trendColor}`}>
                        {trendIcon} {trend.percentage}%
                    </span>
                )}
            </div>
            <p className="mb-1 text-sm font-medium text-gray-400">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    );
}
