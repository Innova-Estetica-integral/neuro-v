'use client';

import { usePsychographic } from '@/lib/hooks/use-psychographic';
import React from 'react';

export function ProfileWrapper({ children }: { children: React.ReactNode }) {
    const { profile } = usePsychographic();

    return (
        <div data-profile={profile} className="min-h-screen transition-colors duration-1000">
            {children}
        </div>
    );
}
