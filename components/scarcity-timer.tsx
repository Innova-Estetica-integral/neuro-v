'use client';

import { useState, useEffect } from 'react';

interface ScarcityTimerProps {
    endTime: Date;
    onExpire?: () => void;
}

export default function ScarcityTimer({ endTime, onExpire }: ScarcityTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        minutes: number;
        seconds: number;
    }>({ minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = endTime.getTime();
            const difference = end - now;

            if (difference <= 0) {
                setTimeLeft({ minutes: 0, seconds: 0 });
                if (onExpire) onExpire();
                return;
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTime, onExpire]);

    return (
        <div className="glass rounded-2xl p-6 border-2 border-red-500 animate-scarcity-pulse">
            <div className="text-center">
                <p className="text-red-400 text-sm font-semibold mb-2">
                    ⚠️ OFERTA EXPIRA EN:
                </p>
                <div className="flex justify-center items-center space-x-4">
                    <div className="bg-red-500 rounded-lg p-4 min-w-[80px]">
                        <div className="text-4xl font-bold text-white">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-red-100 mt-1">MINUTOS</div>
                    </div>
                    <div className="text-3xl font-bold text-red-500">:</div>
                    <div className="bg-red-500 rounded-lg p-4 min-w-[80px]">
                        <div className="text-4xl font-bold text-white">
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-red-100 mt-1">SEGUNDOS</div>
                    </div>
                </div>
                <p className="text-yellow-300 text-xs mt-4 font-semibold">
                    ¡No pierdas esta oportunidad única!
                </p>
            </div>
        </div>
    );
}
