import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "@mantine/charts/styles.css";
import "./globals.css";
import { ToastProvider } from '@/hooks/use-toast';

const theme = createTheme({
    primaryColor: 'indigo',
    fontFamily: 'Inter, sans-serif',
    defaultRadius: 'md',
});

export const metadata: Metadata = {
    title: "Neuro-Ventas V6 | SaaS para Clínicas Estéticas",
    description: "Plataforma de conversión optimizada con perfilado psicográfico para clínicas de estética",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body className="antialiased bg-[#0f172a]">
                <MantineProvider theme={theme} defaultColorScheme="dark">
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
