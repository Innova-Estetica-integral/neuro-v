'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/supabase-auth';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Supabase will handle the callback automatically
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session) {
                    // Redirect to dashboard
                    router.push('/admin/dashboard');
                } else {
                    // No session, redirect to login
                    router.push('/auth/login');
                }
            } catch (err: any) {
                setError(err.message);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            }
        };

        handleAuthCallback();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <p className="text-gray-600">Redirigiendo al login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );
}
