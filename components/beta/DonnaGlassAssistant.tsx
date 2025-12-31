'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    X,
    ArrowRight,
    Send,
    ChevronRight
} from 'lucide-react';

export function DonnaGlassAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'donna', content: "Hola, soy Donna. Felicidades por dar el paso de simplificar tu consulta. Me voy a encargar de configurar tu NeuroV. ¿Empezamos?" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const speak = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            const bestVoice = voices.find(v =>
                (v.name.includes('Google') || v.name.includes('Natural')) &&
                (v.lang.startsWith('es')) &&
                (v.name.toLowerCase().includes('female') || v.name.includes('Helena'))
            ) || voices.find(v => v.lang.startsWith('es'));

            if (bestVoice) utterance.voice = bestVoice;
            utterance.lang = 'es-CL';
            utterance.rate = 1.0;
            utterance.pitch = 1.05;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    useEffect(() => {
        if (isOpen && messages.length === 1) {
            speak(messages[0].content);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const [input, setInput] = useState('');

    const handleSend = (presetMsg?: string) => {
        const userMsg = presetMsg || input;
        if (!userMsg.trim()) return;
        setInput('');

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        setTimeout(() => {
            setIsThinking(false);
            let response = '';
            if (userMsg === 'SÍ, EMPEZAR') {
                response = '¡Excelente! Primero, ¿cuál es la especialidad de tu clínica? (Estética, Dental, Salud Mental...)';
            } else {
                response = 'Entendido. Estoy procesando tu perfil para personalizar el Ecosistema NeuroV...';
            }
            setMessages(prev => [...prev, { role: 'donna', content: response }]);
            speak(response);
        }, 1500);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-2xl flex items-center justify-center z-[200] group border border-indigo-50 overflow-hidden"
            >
                <div className="relative z-10">
                    <BrainCircuit className="text-[#00f2ff] w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_12px_rgba(0,242,255,0.8)]" />
                    {isSpeaking && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </div>
                <motion.div
                    animate={{ x: [-200, 250] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-[30deg]"
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 m-auto z-[201] h-[640px] bg-white/20 backdrop-blur-md rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden flex flex-col pt-10 px-8"
                        style={{ width: '340px', minWidth: '340px', maxWidth: '340px' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-[500px] flex items-center justify-center pointer-events-none opacity-40">
                            <div className="w-[300px] h-[400px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent blur-[80px] rounded-full" />
                        </div>

                        <div className="relative z-10 flex justify-center mb-6">
                            <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-[0.5em]">Executive AI // NeuroV BETA</span>
                        </div>

                        <div className="flex items-center gap-3 relative shrink-0 z-10 px-1">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-white/50 p-0.5 relative z-10 overflow-hidden shadow-sm">
                                    <div className="w-full h-full rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center overflow-hidden">
                                        <BrainCircuit className="text-indigo-600 w-5 h-5 animate-pulse" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-20" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-gray-900 font-black text-sm tracking-tighter leading-tight uppercase">DONNA - ASISTENTE VIRTUAL</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1 h-1 rounded-full bg-indigo-600" />
                                    <p className="text-indigo-600 text-[8px] font-black uppercase tracking-[0.1em] opacity-80">ACTIVA</p>
                                </div>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto pt-8 pb-4 space-y-4 px-1 relative z-10 no-scrollbar">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                                        : 'bg-white/60 backdrop-blur-sm text-gray-800 rounded-bl-none border border-white/80 shadow-sm'
                                        }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl rounded-bl-none border border-white/60">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="py-6 space-y-3 relative z-10">
                            {messages.length === 1 && (
                                <button
                                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    onClick={() => handleSend('SÍ, EMPEZAR')}
                                >
                                    SÍ, EMPEZAR <ArrowRight size={14} />
                                </button>
                            )}
                            {messages.length > 1 && (
                                <div className="relative group flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Escribe tu mensaje..."
                                        className="flex-1 bg-white/40 border border-white/60 rounded-2xl px-5 py-4 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                            className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 transition-colors z-[210]"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
