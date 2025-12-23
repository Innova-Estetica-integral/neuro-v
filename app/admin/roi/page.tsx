'use client';

import { Paper, Text, Title, Group, NumberInput, Button, Stack, RingProgress } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { LucideTrendingUp, LucideCalculator, LucideDollarSign, LucideTarget } from 'lucide-react';
import { useState } from 'react';

const CAMPAIGN_DATA = [
    { date: '15 Dic', adSpend: 150000, revenue: 680000 },
    { date: '16 Dic', adSpend: 180000, revenue: 850000 },
    { date: '17 Dic', adSpend: 200000, revenue: 940000 },
    { date: '18 Dic', adSpend: 220000, revenue: 1200000 },
    { date: '19 Dic', adSpend: 240000, revenue: 1350000 },
    { date: '20 Dic', adSpend: 260000, revenue: 1450000 },
    { date: '21 Dic', adSpend: 280000, revenue: 1680000 },
];

export default function ROIPage() {
    const [adSpend, setAdSpend] = useState(2850000);
    const [revenue, setRevenue] = useState(13680000);
    const roi = (revenue / adSpend).toFixed(2);

    return (
        <div className="space-y-8">
            <Group justify="space-between">
                <div>
                    <Title order={1} fw={900}>ROI & Google Ads Analytics</Title>
                    <Text c="dimmed" size="sm">Calculadora de retorno sobre inversión publicitaria</Text>
                </div>
            </Group>

            {/* ROI Calculator */}
            <div className="grid md:grid-cols-3 gap-6">
                <Paper p="xl" radius="lg" className="bg-white/5 border-white/5 md:col-span-2">
                    <Group mb="lg">
                        <LucideCalculator className="w-6 h-6 text-indigo-400" />
                        <Title order={3}>Calculadora de ROI</Title>
                    </Group>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Stack>
                            <NumberInput
                                label="Gasto en Publicidad (CLP)"
                                placeholder="Ingresa el gasto total"
                                value={adSpend}
                                onChange={(val) => setAdSpend(Number(val))}
                                prefix="$"
                                thousandSeparator="."
                                decimalSeparator=","
                                size="lg"
                                leftSection={<LucideDollarSign size={18} />}
                            />
                            <Text size="xs" c="dimmed">Google Ads + Meta Ads + Otras plataformas</Text>
                        </Stack>

                        <Stack>
                            <NumberInput
                                label="Ingresos Generados (CLP)"
                                placeholder="Ingresos atribuidos"
                                value={revenue}
                                onChange={(val) => setRevenue(Number(val))}
                                prefix="$"
                                thousandSeparator="."
                                decimalSeparator=","
                                size="lg"
                                leftSection={<LucideTarget size={18} />}
                            />
                            <Text size="xs" c="dimmed">De ventas confirmadas en Supabase</Text>
                        </Stack>
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        mt="xl"
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'purple' }}
                        leftSection={<LucideTrendingUp size={18} />}
                    >
                        Exportar Reporte PDF
                    </Button>
                </Paper>

                <Paper p="xl" radius="lg" className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <Title order={3} mb="lg" ta="center">ROI Actual</Title>
                    <div className="flex justify-center mb-6">
                        <RingProgress
                            size={180}
                            thickness={16}
                            roundCaps
                            sections={[{ value: Math.min((parseFloat(roi) / 10) * 100, 100), color: 'indigo' }]}
                            label={
                                <div className="text-center">
                                    <Text size="3xl" fw={900} className="text-gradient">{roi}x</Text>
                                    <Text size="xs" c="dimmed" mt="xs">Retorno sobre inversión</Text>
                                </div>
                            }
                        />
                    </div>

                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Ad Spend:</Text>
                            <Text size="sm" fw={600} c="red">${(adSpend / 1000).toFixed(0)}k</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Revenue:</Text>
                            <Text size="sm" fw={600} c="green">${(revenue / 1000).toFixed(0)}k</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Profit:</Text>
                            <Text size="sm" fw={600} c="indigo">${((revenue - adSpend) / 1000).toFixed(0)}k</Text>
                        </Group>
                    </Stack>
                </Paper>
            </div>

            {/* Campaign Performance Chart */}
            <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                <Group mb="xl" justify="space-between">
                    <div>
                        <Title order={3}>Performance de Campañas</Title>
                        <Text size="sm" c="dimmed">Comparación de gasto vs. ingresos (últimos 7 días)</Text>
                    </div>
                </Group>

                <AreaChart
                    h={300}
                    data={CAMPAIGN_DATA}
                    dataKey="date"
                    series={[
                        { name: 'revenue', color: 'green.6', label: 'Revenue' },
                        { name: 'adSpend', color: 'red.6', label: 'Ad Spend' }
                    ]}
                    curveType="monotone"
                    gridAxis="xy"
                    strokeWidth={2}
                    fillOpacity={0.1}
                />
            </Paper>
        </div>
    );
}
