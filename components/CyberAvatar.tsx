'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CyberAvatarProps {
    size?: number;
    isActive?: boolean;
}

export function CyberAvatar({ size = 64, isActive = false }: CyberAvatarProps) {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Glow effect when active */}
            {isActive && (
                <>
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-xl opacity-60"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 blur-2xl opacity-40"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                </>
            )}

            {/* Main avatar container */}
            <div className="relative rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                {/* Image */}
                <Image
                    src="/cyber-assistant.jpg.png"
                    alt="Asistente Virtual NeuroV"
                    width={size}
                    height={size}
                    className="object-cover"
                    priority
                />

                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10 mix-blend-overlay" />

                {/* Scan lines effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="h-full w-full" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.1) 2px, rgba(34, 211, 238, 0.1) 4px)'
                    }} />
                </div>

                {/* Animated scan line */}
                {isActive && (
                    <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                )}

                {/* Corner tech elements */}
                <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400/60" />
                <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-pink-400/60" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-purple-400/60" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400/60" />
            </div>

            {/* Outer ring animation when active */}
            {isActive && (
                <>
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border border-pink-400/50"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />
                </>
            )}

            {/* Status indicator */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'
                } shadow-lg`}>
                {isActive && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                )}
            </div>
        </div>
    );
}
