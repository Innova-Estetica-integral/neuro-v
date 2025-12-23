'use client';

import { useState, useEffect, useCallback } from 'react';
import { classifyPsychographicProfile, getUIConfig, type PsychProfile, type BehaviorData } from '../ai/psychographic-profiler';

export function usePsychographic() {
    const [profile, setProfile] = useState<PsychProfile>('hesitant');
    const [behavior, setBehavior] = useState<BehaviorData>({
        timeOnPage: 0,
        clicksCount: 0,
        scrollDepth: 0,
        viewedPricing: false,
        viewedTestimonials: false,
        viewedServices: false,
        deviceType: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'desktop',
        exitIntentTriggered: false
    });
    const [classified, setClassified] = useState(false);

    const uiConfig = getUIConfig(profile);

    // Track time on page
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setBehavior(prev => ({ ...prev, timeOnPage: elapsed }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Track scroll depth
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

            setBehavior(prev => ({
                ...prev,
                scrollDepth: Math.max(prev.scrollDepth, scrollPercent)
            }));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track clicks
    useEffect(() => {
        const handleClick = () => {
            setBehavior(prev => ({
                ...prev,
                clicksCount: prev.clicksCount + 1
            }));
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Track exit intent
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                setBehavior(prev => ({
                    ...prev,
                    exitIntentTriggered: true
                }));
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    // Classify after 30 seconds
    useEffect(() => {
        if (behavior.timeOnPage >= 30 && !classified) {
            const detectedProfile = classifyPsychographicProfile(behavior);
            setProfile(detectedProfile);
            setClassified(true);

            console.log('🧠 AI PROFILER:', {
                profile: detectedProfile,
                behavior,
                uiConfig: getUIConfig(detectedProfile)
            });
        }
    }, [behavior.timeOnPage, classified, behavior]);

    // Manual tracking function
    const trackBehavior = useCallback((updates: Partial<BehaviorData>) => {
        setBehavior(prev => ({ ...prev, ...updates }));
    }, []);

    // Manual classification trigger
    const forceClassify = useCallback(() => {
        const detectedProfile = classifyPsychographicProfile(behavior);
        setProfile(detectedProfile);
        setClassified(true);
        return detectedProfile;
    }, [behavior]);

    return {
        profile,
        behavior,
        uiConfig,
        classified,
        trackBehavior,
        forceClassify
    };
}
