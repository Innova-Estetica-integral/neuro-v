'use client';

import { useState } from 'react';
import {
    Container,
    Title,
    Text,
    Paper,
    Group,
    Button,
    Grid,
    Card,
    ThemeIcon,
    SimpleGrid,
    Image,
    Badge,
    ActionIcon,
    Tooltip,
    Select,
    Stack
} from '@mantine/core';
import {
    LucideCamera,
    LucideColumns,
    LucidePlus,
    LucideImages,
    LucideTrash2,
    LucideDownload,
    LucideMaximize2
} from 'lucide-react';

export default function EvolutionPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');

    const sampleMedia = [
        { id: '1', patient: 'Ana Silva', procedure: 'Hidrolipoclasia', type: 'pre_op', date: '2025-12-01', url: 'https://images.unsplash.com/photo-1512675845772-b93099bc35ee?q=80&w=400' },
        { id: '2', patient: 'Ana Silva', procedure: 'Hidrolipoclasia', type: 'post_op', date: '2025-12-28', url: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=400' },
    ];

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} c="white">Evolución Visual</Title>
                    <Text c="dimmed" size="sm">Registro clínico fotográfico y comparativas de resultados.</Text>
                </div>
                <Group>
                    <Select
                        placeholder="Filtrar por Paciente"
                        data={['Ana Silva', 'María García', 'Roberto Soto']}
                        className="w-64"
                    />
                    <Button leftSection={<LucidePlus size={18} />} color="indigo">
                        Subir Imágenes
                    </Button>
                </Group>
            </Group>

            <Grid mb="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper p="md" withBorder className="bg-[#1e293b]/50 border-white/5">
                        <Group justify="space-between" mb="lg">
                            <Group>
                                <LucideImages className="text-indigo-400" size={20} />
                                <Text fw={700} c="white">Galería de Procedimientos</Text>
                            </Group>
                            <Button.Group>
                                <Button
                                    variant={viewMode === 'grid' ? 'filled' : 'light'}
                                    color="indigo"
                                    size="xs"
                                    onClick={() => setViewMode('grid')}
                                    leftSection={<LucideImages size={14} />}
                                >
                                    Grilla
                                </Button>
                                <Button
                                    variant={viewMode === 'compare' ? 'filled' : 'light'}
                                    color="indigo"
                                    size="xs"
                                    onClick={() => setViewMode('compare')}
                                    leftSection={<LucideColumns size={14} />}
                                >
                                    Comparar
                                </Button>
                            </Button.Group>
                        </Group>

                        {viewMode === 'grid' ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                                {sampleMedia.map((img) => (
                                    <Card key={img.id} p="xs" withBorder className="bg-white/5 border-white/10 group">
                                        <Card.Section className="relative overflow-hidden">
                                            <Image src={img.url} height={200} alt={img.type} />
                                            <Badge
                                                className="absolute top-2 left-2"
                                                color={img.type === 'pre_op' ? 'orange' : 'teal'}
                                            >
                                                {img.type === 'pre_op' ? 'Antes' : 'Después'}
                                            </Badge>
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <ActionIcon variant="light" color="white"><LucideMaximize2 size={16} /></ActionIcon>
                                                <ActionIcon variant="light" color="white"><LucideDownload size={16} /></ActionIcon>
                                            </div>
                                        </Card.Section>
                                        <Stack gap={2} mt="xs">
                                            <Text size="xs" fw={900} c="indigo.4">{img.patient}</Text>
                                            <Text size="xs" c="dimmed">{img.procedure} - {img.date}</Text>
                                        </Stack>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Grid grow>
                                <Grid.Col span={6}>
                                    <Stack align="center" gap="xs">
                                        <Badge variant="light" color="orange" size="lg">ANTES</Badge>
                                        <Paper withBorder p={4} className="bg-white/5 border-white/10 w-full overflow-hidden">
                                            <Image src={sampleMedia[0].url} radius="sm" alt="Antes" />
                                        </Paper>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Stack align="center" gap="xs">
                                        <Badge variant="light" color="teal" size="lg">DESPUÉS</Badge>
                                        <Paper withBorder p={4} className="bg-white/5 border-white/10 w-full overflow-hidden">
                                            <Image src={sampleMedia[1].url} radius="sm" alt="Después" />
                                        </Paper>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        )}
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack>
                        <Card withBorder className="bg-[#1e293b]/50 border-white/5">
                            <ThemeIcon size="xl" color="indigo" variant="light" mb="md">
                                <LucideCamera size={24} />
                            </ThemeIcon>
                            <Text fw={900} c="white" mb="xs">Evidencia Clínica</Text>
                            <Text size="sm" c="dimmed">
                                Los registros fotográficos aumentan la confianza del paciente en un 85%. Donna puede enviar este comparativo automáticamente al finalizar el tratamiento.
                            </Text>
                        </Card>

                        <Paper p="md" withBorder className="bg-[#1e293b]/50 border-white/5">
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md">Actividad Reciente</Text>
                            <Stack gap="xs">
                                <Group wrap="nowrap" gap="sm">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <Text size="xs" c="white">Nueva foto subida para **Ana Silva**</Text>
                                </Group>
                                <Group wrap="nowrap" gap="sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <Text size="xs" c="white">Comparativa generada: **Tratamiento Acné**</Text>
                                </Group>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
