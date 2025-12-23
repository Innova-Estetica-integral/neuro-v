'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev.slice(-2), toast]); // Keep max 3 toasts

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="pointer-events-none fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const config = {
        success: {
            bg: 'bg-green-600/90',
            icon: '✓',
            border: 'border-green-500',
        },
        error: {
            bg: 'bg-red-600/90',
            icon: '✕',
            border: 'border-red-500',
        },
        warning: {
            bg: 'bg-yellow-600/90',
            icon: '⚠',
            border: 'border-yellow-500',
        },
        info: {
            bg: 'bg-blue-600/90',
            icon: 'ℹ',
            border: 'border-blue-500',
        },
    }[toast.type];

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border ${config.border} ${config.bg} px-4 py-3 text-white shadow-lg backdrop-blur-sm animate-slide-in-right`}
            role="alert"
        >
            <span className="text-xl">{config.icon}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-white/70 transition hover:text-white"
                aria-label="Cerrar"
            >
                ✕
            </button>
        </div>
    );
}
