'use client';

import { Paper, Text, Title, Badge, Table, Group, Progress, Button } from '@mantine/core';
import { LucideZap, LucideSend, LucideCheckCircle2, LucideClock } from 'lucide-react';

const FLASH_OFFERS = [
    { id: 1, patient: 'Ana Rodríguez', service: 'Peeling', discount: 20, gap: '2025-12-24 12:00', status: 'sent', expires: '6h' },
    { id: 2, patient: 'Carlos Pérez', service: 'Botox', discount: 20, gap: '2025-12-23 14:00', status: 'pending', expires: '12h' },
    { id: 3, patient: 'Laura Martínez', service: 'Filler', discount: 20, gap: '2025-12-24 09:00', status: 'accepted', expires: '-' },
];

export default function CampaignsPage() {
    return (
        <div className="space-y-8">
            <Group justify="space-between">
                <div>
                    <Title order={1} fw={900}>Flash Offers & Campañas</Title>
                    <Text c="dimmed" size="sm">Ofertas automáticas para gaps detectados</Text>
                </div>
                <Badge variant="dot" color="red" size="lg" leftSection={<LucideZap size={14} />}>
                    8 Activas
                </Badge>
            </Group>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb="xs">Flash Offers Enviadas</Text>
                    <Text size="2xl" fw={900} mb="xs">24</Text>
                    <Progress value={75} color="indigo" size="sm" />
                    <Text size="xs" c="dimmed" mt="xs">75% tasa de conversión</Text>
                </Paper>

                <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb="xs">Ingresos Generados</Text>
                    <Text size="2xl" fw={900} mb="xs" className="text-gradient">$1.240.000</Text>
                    <Progress value={60} color="green" size="sm" />
                    <Text size="xs" c="dimmed" mt="xs">De gaps convertidos</Text>
                </Paper>

                <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb="xs">Gaps Restantes</Text>
                    <Text size="2xl" fw={900} mb="xs">6</Text>
                    <Progress value={40} color="red" size="sm" />
                    <Text size="xs" c="dimmed" mt="xs">Potencial: $450.000</Text>
                </Paper>
            </div>

            {/* Flash Offers Table */}
            <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                <Group mb="lg" justify="space-between">
                    <Group>
                        <LucideZap className="w-6 h-6 text-red-400" />
                        <Title order={3}>Flash Offers Activas</Title>
                    </Group>
                    <Button leftSection={<LucideSend size={16} />} variant="light" color="indigo">
                        Crear Nueva Oferta
                    </Button>
                </Group>

                <Table highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Paciente</Table.Th>
                            <Table.Th>Servicio</Table.Th>
                            <Table.Th>Descuento</Table.Th>
                            <Table.Th>Gap Objetivo</Table.Th>
                            <Table.Th>Estado</Table.Th>
                            <Table.Th>Expira en</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {FLASH_OFFERS.map(offer => (
                            <Table.Tr key={offer.id}>
                                <Table.Td>
                                    <Text size="sm" fw={600}>{offer.patient}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{offer.service}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color="red" variant="light">{offer.discount}% OFF</Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{offer.gap}</Text>
                                </Table.Td>
                                <Table.Td>
                                    {offer.status === 'accepted' ? (
                                        <Badge color="green" leftSection={<LucideCheckCircle2 size={12} />}>Aceptada</Badge>
                                    ) : offer.status === 'sent' ? (
                                        <Badge color="blue" leftSection={<LucideSend size={12} />}>Enviada</Badge>
                                    ) : (
                                        <Badge color="gray" leftSection={<LucideClock size={12} />}>Pendiente</Badge>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c={offer.expires === '-' ? 'dimmed' : 'red'}>{offer.expires}</Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </div>
    );
}
