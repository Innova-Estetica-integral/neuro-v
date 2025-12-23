'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoSimulator() {
    const router = useRouter();

    useEffect(() => {
        // 1. Simulate coming from a Google Ad
        const demoGclid = 'DEMO_GCLID_' + Math.random().toString(36).substring(7).toUpperCase();
        const utms = 'utm_source=google&utm_medium=cpc&utm_campaign=demo_alpha';

        // 2. Redirect to landing page with these params
        // We add a brief delay to show the simulation start
        const timer = setTimeout(() => {
            router.push(`/?gclid=${demoGclid}&${utms}`);
        }, 1500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-center items-center justify-center p-8">
            <div className="max-w-md w-full glass-card p-12 rounded-[40px] text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <h1 className="text-3xl font-black">Simulando Click de Google Ads...</h1>
                <p className="text-gray-500">
                    Iniciando flujo multi-tenant para <span className="text-white">Clínica Alpha</span>.
                    Detectando comportamiento psicográfico...
                </p>
                <div className="pt-8 flex justify-center gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-indigo-500" />
                    <div className="h-1.5 w-8 rounded-full bg-gray-800" />
                    <div className="h-1.5 w-8 rounded-full bg-gray-800" />
                </div>
            </div>
        </div>
    );
}
