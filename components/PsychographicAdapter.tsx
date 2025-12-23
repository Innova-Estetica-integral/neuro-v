'use client';

import { ReactNode } from 'react';
import { usePsychographic } from '@/lib/hooks/use-psychographic';
import type { PsychProfile } from '@/lib/ai/psychographic-profiler';

interface PsychographicAdapterProps {
    children: ReactNode | ((props: { profile: PsychProfile; config: any }) => ReactNode);
    fallback?: ReactNode;
}

export function PsychographicAdapter({ children, fallback }: PsychographicAdapterProps) {
    const { profile, uiConfig, classified } = usePsychographic();

    if (typeof children === 'function') {
        return <>{children({ profile, config: uiConfig })}</>;
    }

    return <>{children}</>;
}

export function ProfileSection({
    allowedProfiles,
    children
}: {
    allowedProfiles: PsychProfile[];
    children: ReactNode
}) {
    const { profile } = usePsychographic();

    if (!allowedProfiles.includes(profile)) {
        return null;
    }

    return <>{children}</>;
}
