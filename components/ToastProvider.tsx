'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LucideCheck, LucideX, LucideInfo, LucideAlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast = { id, type, message };

        setToasts((prev) => [...prev, toast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
                                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                                    toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' :
                                        'bg-blue-50 border-blue-200 text-blue-900'
                            }`}
                    >
                        {toast.type === 'success' && <LucideCheck className="w-5 h-5" />}
                        {toast.type === 'error' && <LucideX className="w-5 h-5" />}
                        {toast.type === 'warning' && <LucideAlertCircle className="w-5 h-5" />}
                        {toast.type === 'info' && <LucideInfo className="w-5 h-5" />}

                        <span className="font-semibold">{toast.message}</span>
                    </div>
                ))}
            </div>
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
