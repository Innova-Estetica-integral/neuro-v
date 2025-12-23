'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

export function PremiumButton({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    className = '',
    ...props
}: PremiumButtonProps) {
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...safeProps } = props as any;
    const baseStyles = 'btn-premium inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20',
        secondary: 'bg-white text-black hover:bg-indigo-50 shadow-lg shadow-white/10',
        outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5',
        ghost: 'bg-transparent text-white hover:bg-white/5'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-10 py-5 text-lg',
        xl: 'px-12 py-6 text-xl'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...safeProps}
        >
            {icon && iconPosition === 'left' && <span className="mr-3">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="ml-3">{icon}</span>}
        </motion.button>
    );
}
