'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Paper,
    Table,
    Group,
    Button,
    Badge,
    Grid,
    Card,
    ThemeIcon,
    Stack,
    Tabs,
    ActionIcon,
    Progress
} from '@mantine/core';
import {
    LucideUsers,
    LucideGift,
    LucideTrendingUp,
    LucidePlus,
    LucideCopy,
    LucideTrophy,
    LucideShare2,
    LucideCircleCheck
} from 'lucide-react';
import { referralEngine, ReferralProgram } from '@/lib/business/referral-engine';

export default function ReferralsPage() {
    const [programs, setPrograms] = useState<ReferralProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const clinicId = 'a0000000-0000-0000-0000-000000000001';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await referralEngine.getPrograms(clinicId);
        setPrograms(data || []);
        setLoading(false);
    };

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} c="white">Referral Engine</Title>
                    <Text c="dimmed" size="sm">Multiplique su base de pacientes mediante recomendaciones recompensadas.</Text>
                </div>
                <Button leftSection={<LucidePlus size={18} />} color="indigo">
                    Nueva Campaña
                </Button>
            </Group>

            <Grid mb="xl">
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="pink" variant="light">
                                <LucideShare2 size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Códigos Activos</Text>
                                <Text size="xl" fw={900} c="white">128</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="indigo" variant="light">
                                <LucideUsers size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Pacientes Referidos</Text>
                                <Text size="xl" fw={900} c="white">45</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="teal" variant="light">
                                <LucideTrophy size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Tasa de Conversión</Text>
                                <Text size="xl" fw={900} c="white">35%</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>

            <Tabs defaultValue="programs" variant="outline" className="text-white">
                <Tabs.List className="border-white/5 mb-xl">
                    <Tabs.Tab value="programs" leftSection={<LucideGift size={16} />}>Programas de Recompensas</Tabs.Tab>
                    <Tabs.Tab value="conversions" leftSection={<LucideTrendingUp size={16} />}>Conversiones</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="programs">
                    <Stack>
                        {programs.length === 0 ? (
                            <Paper p="xl" withBorder className="bg-[#1e293b]/30 border-white/5 text-center">
                                <LucideGift size={48} className="mx-auto text-indigo-400 opacity-20 mb-4" />
                                <Text fw={700} c="white">No hay programas de referidos activos</Text>
                                <Text size="sm" c="dimmed" mb="lg">Cree su primera campaña para incentivar a sus pacientes actuales.</Text>
                                <Button variant="light" color="indigo">Configurar Programa Default</Button>
                            </Paper>
                        ) : (
                            <Grid>
                                {programs.map((p) => (
                                    <Grid.Col key={p.id} span={{ base: 12, md: 6 }}>
                                        <Card withBorder className="bg-[#1e293b]/50 border-white/5">
                                            <Group justify="space-between" mb="sm">
                                                <Text fw={900} size="lg" c="white">{p.name}</Text>
                                                <Badge color={p.is_active ? 'green' : 'gray'}>{p.is_active ? 'Activo' : 'Pausado'}</Badge>
                                            </Group>
                                            <Text size="sm" c="dimmed" mb="xl">Recompensa: {p.reward_type === 'discount' ? `${p.reward_value}% Descuento` : `${p.reward_value} CLP Crédito`}</Text>
                                            <Group justify="space-between" mt="auto">
                                                <Text size="xs" fw={700}>Uso: 24/100</Text>
                                                <Progress value={24} color="indigo" size="sm" className="flex-1 mx-md" />
                                            </Group>
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="conversions">
                    <Paper p="md" withBorder className="bg-[#1e293b]/50 border-white/5">
                        <Table verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr className="border-white/5">
                                    <Table.Th>Referente</Table.Th>
                                    <Table.Th>Nuevo Paciente</Table.Th>
                                    <Table.Th>Código</Table.Th>
                                    <Table.Th>Estado</Table.Th>
                                    <Table.Th>Fecha</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr className="border-white/5">
                                    <Table.Td><Text size="sm" fw={700}>María González</Text></Table.Td>
                                    <Table.Td><Text size="sm">Roberto Soto</Text></Table.Td>
                                    <Table.Td><Badge variant="outline" color="indigo">NV-X452</Badge></Table.Td>
                                    <Table.Td><Badge color="green" leftSection={<LucideCircleCheck size={12} />}>Convertido</Badge></Table.Td>
                                    <Table.Td><Text size="xs" c="dimmed">28 Dic 2025</Text></Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
