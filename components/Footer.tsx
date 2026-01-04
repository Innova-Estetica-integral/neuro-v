'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Instagram,
    Mail,
    MessageSquare,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    TrendingUp,
    Globe,
    Phone
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Plataforma',
            links: [
                { name: 'Secretaria IA', href: '#secretaria' },
                { name: 'Gestión Médica', href: '#operacion' },
                { name: 'Marketing Automático', href: '#marketing' },
                { name: 'Seguridad Legal', href: '#seguridad' },
                { name: 'Planes', href: '#precios' },
            ]
        },
        {
            title: 'Recursos',
            links: [
                { name: 'Growth / Escalamiento', href: '/soluciones-marketing' },
                { name: 'Casos de Éxito', href: '#' },
                { name: 'Documentación', href: '#' },
                { name: 'Blog Médico', href: '#' },
            ]
        },
        {
            title: 'NeuroV',
            links: [
                { name: 'Nuestra Visión', href: '#' },
                { name: 'Integraciones (I-Med/SII)', href: '#' },
                { name: 'Contacto', href: '#' },
                { name: 'Unete al Equipo', href: '#' },
            ]
        }
    ];

    const socialLinks = [
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: MessageSquare, href: '#', label: 'WhatsApp' },
        { icon: Globe, href: '#', label: 'Website' },
    ];

    return (
        <footer className="bg-[#0A0B14] pt-24 pb-12 px-6 sm:px-12 relative overflow-hidden border-t border-white/5">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                <TrendingUp className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tightest text-white italic">
                                Neuro<span className="text-indigo-400">V</span>
                            </span>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                            La primera infraestructura de inteligencia operativa diseñada exclusivamente para clínicas de estética y profesionales independientes en Chile.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {footerLinks.map((group, idx) => (
                            <div key={idx} className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{group.title}</h4>
                                <ul className="space-y-4">
                                    {group.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-400 text-sm font-bold hover:text-indigo-400 transition-colors flex items-center gap-1 group/link"
                                            >
                                                {link.name}
                                                <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter / Contact Card */}
                    <div className="lg:col-span-2">
                        <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 space-y-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">¿Necesitas ayuda?</h4>
                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Habla directamente con un consultor de NeuroV.</p>
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                            >
                                <Phone size={12} /> +56 9 XXXX XXXX
                            </Link>
                            <div className="w-full h-[1px] bg-white/5 my-2" />
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
                            >
                                <MessageSquare size={12} /> WhatsApp Directo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        © {currentYear} NeuroV S.A. Todos los derechos reservados.
                    </div>

                    <div className="flex gap-8">
                        <Link href="#" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors">Términos</Link>
                        <Link href="#" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors">Privacidad</Link>
                        <Link href="#" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors">Cookies</Link>
                    </div>

                    {/* Chile Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Chile</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
