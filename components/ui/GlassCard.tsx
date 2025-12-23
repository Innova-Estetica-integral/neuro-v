'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverIntensity?: 'none' | 'low' | 'high';
    delay?: number;
}

export function GlassCard({ children, className = '', hoverIntensity = 'low', delay = 0 }: GlassCardProps) {
    const hoverStyles = {
        none: {},
        low: { y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.2)' },
        high: { scale: 1.02, y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.3)' }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={hoverStyles[hoverIntensity]}
            className={`glass-card p-8 group relative overflow-hidden ${className}`}
        >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Card Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
