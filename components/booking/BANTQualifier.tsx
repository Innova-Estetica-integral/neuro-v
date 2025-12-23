'use client';

import { useState } from 'react';

/**
 * BANT Qualification Component
 * Business Rule: Filter leads with budget < $30.000 CLP
 */

export interface BANTData {
    budget: number;
    authority: boolean;
    need: number; // 0-100
    timeline: number; // days
}

interface BANTFormProps {
    onQualified: (data: BANTData) => void;
    onDisqualified: (reason: string) => void;
    profile: string;
}

export function BANTQualifier({ onQualified, onDisqualified, profile }: BANTFormProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BANTData>({
        budget: 60000, // Valor inicial en rango medio
        authority: true,
        need: 50,
        timeline: 7
    });

    const handleNext = () => {
        if (step === 1 && data.budget < 30000) {
            onDisqualified('PRESUPUESTO_INSUFICIENTE');
            return;
        }
        if (step < 4) setStep(step + 1);
        else onQualified(data);
    };

    return (
        <div className="space-y-6">
            {step === 1 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-200">¿Cuál es tu presupuesto estimado para este tratamiento?</label>
                    <input
                        type="range"
                        min="30000"
                        max="300000"
                        step="10000"
                        value={data.budget}
                        onChange={(e) => setData({ ...data, budget: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>$30.000</span>
                        <span className="text-purple-400 font-bold text-lg">${data.budget.toLocaleString('es-CL')}</span>
                        <span>$300.000+</span>
                    </div>
                    <p className="text-gray-500 text-xs italic">
                        * Precio inicial desde $30.000 CLP según tratamiento
                    </p>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-200">¿Eres tú la persona que tomará la decisión final?</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setData({ ...data, authority: true })}
                            className={`flex-1 py-3 rounded-xl border ${data.authority ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-700'}`}
                        >
                            Sí, yo decido
                        </button>
                        <button
                            onClick={() => setData({ ...data, authority: false })}
                            className={`flex-1 py-3 rounded-xl border ${!data.authority ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-700'}`}
                        >
                            Consultaré con alguien
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-200">¿Qué tan urgente consideras tu necesidad?</label>
                    <div className="grid grid-cols-5 gap-2">
                        {[20, 40, 60, 80, 100].map(val => (
                            <button
                                key={val}
                                onClick={() => setData({ ...data, need: val })}
                                className={`py-2 rounded-lg border ${data.need === val ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-700'}`}
                            >
                                {val / 20}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-tighter">
                        <span>Deseo casual</span>
                        <span>Urgencia extrema</span>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-200">¿En qué plazo planeas realizarte el tratamiento?</label>
                    <div className="space-y-2">
                        {[
                            { label: 'Lo antes posible (1-3 días)', val: 3 },
                            { label: 'Próxima semana', val: 7 },
                            { label: 'Este mes', val: 30 },
                            { label: 'Solo estoy cotizando', val: 90 }
                        ].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => setData({ ...data, timeline: opt.val })}
                                className={`w-full text-left px-4 py-3 rounded-xl border ${data.timeline === opt.val ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-700'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-xl hover:opacity-90 transition-opacity"
            >
                {step === 4 ? 'Ver Disponibilidad' : 'Siguiente'}
            </button>

            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 w-8 rounded-full ${s <= step ? 'bg-purple-500' : 'bg-gray-700'}`} />
                ))}
            </div>
        </div>
    );
}
