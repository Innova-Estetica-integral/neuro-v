import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    iconColor?: string;
}

export function StatsCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    iconColor = 'text-blue-600'
}: StatsCardProps) {
    const changeColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {change && (
                    <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
                        {change}
                    </span>
                )}
            </div>

            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}
