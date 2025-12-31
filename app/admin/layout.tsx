'use client';

import { AppShell, Burger, Group, NavLink, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LucideLayoutDashboard, LucideUsers, LucideCalendar, LucideTrendingUp, LucideSettings, LucideZap, LucideActivity, LucidePackage, LucideGift, LucideCamera } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();

    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 260,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            className="bg-[#0f172a]"
        >
            <AppShell.Header className="bg-[#1e293b]/50 backdrop-blur-md border-white/5 px-md">
                <Group h="100%" px="md" justify="space-between">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group gap="xs">
                        <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'purple' }} size="lg">
                            <LucideActivity size={20} />
                        </ThemeIcon>
                        <Text size="xl" fw={900}>NEURO<Text span c="indigo.4">V</Text></Text>
                    </Group>

                    <Group gap="sm">
                        <div className="text-right hidden md:block">
                            <Text size="xs" fw={700} c="dimmed">CLÍNICA ALPHA (DEMO)</Text>
                            <Text size="xs" c="green.5">Status: Online</Text>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">A</div>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" className="bg-[#1e293b]/30 border-white/5 space-y-1">
                <Text size="xs" fw={700} c="dimmed" mb="xs" px="md">PRINCIPAL</Text>
                <NavLink
                    component={Link}
                    href="/admin/dashboard"
                    label="Dashboard"
                    leftSection={<LucideLayoutDashboard size={18} />}
                    active={pathname === '/admin/dashboard'}
                    variant="filled"
                    color="indigo"
                    className="rounded-lg mb-1"
                />
                <NavLink
                    component={Link}
                    href="/admin/agenda"
                    label="Agenda & Gaps"
                    leftSection={<LucideCalendar size={18} />}
                    active={pathname === '/admin/agenda'}
                    className="rounded-lg mb-1"
                />
                <NavLink
                    component={Link}
                    href="/admin/leads"
                    label="Leads & Pacientes"
                    leftSection={<LucideUsers size={18} />}
                    active={pathname === '/admin/leads'}
                    className="rounded-lg mb-1"
                />

                <Text size="xs" fw={700} c="dimmed" mt="xl" mb="xs" px="md">CRECIMIENTO</Text>
                <NavLink
                    component={Link}
                    href="/admin/campaigns"
                    label="Flash Offers"
                    leftSection={<LucideZap size={18} />}
                    rightSection={<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    active={pathname === '/admin/campaigns'}
                    className="rounded-lg mb-1"
                />
                <NavLink
                    component={Link}
                    href="/admin/roi"
                    label="ROI & Google Ads"
                    leftSection={<LucideTrendingUp size={18} />}
                    active={pathname === '/admin/roi'}
                    className="rounded-lg mb-1"
                />

                <NavLink
                    component={Link}
                    href="/admin/inventory"
                    label="Inventario & Stock"
                    leftSection={<LucidePackage size={18} />}
                    active={pathname === '/admin/inventory'}
                    className="rounded-lg mb-1"
                />
                <NavLink
                    component={Link}
                    href="/admin/referrals"
                    label="Referidos & Recompensas"
                    leftSection={<LucideGift size={18} />}
                    active={pathname === '/admin/referrals'}
                    className="rounded-lg mb-1"
                />
                <NavLink
                    component={Link}
                    href="/admin/evolution"
                    label="Evolución Visual"
                    leftSection={<LucideCamera size={18} />}
                    active={pathname === '/admin/evolution'}
                    className="rounded-lg mb-1"
                />

                <AppShell.Section grow />

                <NavLink
                    label="Configuración"
                    leftSection={<LucideSettings size={18} />}
                    className="rounded-lg"
                />
            </AppShell.Navbar>

            <AppShell.Main className="bg-[#0f172a]">
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
