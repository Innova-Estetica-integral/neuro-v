'use client';

import { Paper, Text, Title, Badge, Table, Avatar, Group, TextInput, Select } from '@mantine/core';
import { LucideSearch, LucideFilter } from 'lucide-react';

const LEADS = [
    { id: 1, name: 'María García', email: 'maria.garcia@demo.cl', profile: 'impulsive', bant: 'qualified', budget: 60000, phone: '+56987654321' },
    { id: 2, name: 'Juan López', email: 'juan.lopez@demo.cl', profile: 'analytic', bant: 'qualified', budget: 150000, phone: '+56976543210' },
    { id: 3, name: 'Ana Rodríguez', email: 'ana.rodriguez@demo.cl', profile: 'price_sensitive', bant: 'qualified', budget: 35000, phone: '+56965432109' },
];

const PROFILE_COLORS: Record<string, string> = {
    impulsive: 'red',
    analytic: 'blue',
    price_sensitive: 'green',
    hesitant: 'gray'
};

export default function LeadsPage() {
    return (
        <div className="space-y-8">
            <Group justify="space-between">
                <div>
                    <Title order={1} fw={900}>Leads & Pacientes</Title>
                    <Text c="dimmed" size="sm">Base de datos con perfil psicográfico y BANT</Text>
                </div>
                <Badge variant="light" size="lg">452 Total</Badge>
            </Group>

            {/* Filters */}
            <Paper p="md" radius="lg" className="bg-white/5 border-white/5">
                <Group>
                    <TextInput
                        placeholder="Buscar por nombre o email..."
                        leftSection={<LucideSearch size={16} />}
                        style={{ flex: 1 }}
                    />
                    <Select
                        placeholder="Filtrar por perfil"
                        data={[
                            { value: 'all', label: 'Todos los perfiles' },
                            { value: 'impulsive', label: 'Impulsivos' },
                            { value: 'analytic', label: 'Analíticos' },
                            { value: 'price_sensitive', label: 'Sensibles al Precio' },
                            { value: 'hesitant', label: 'Indecisos' }
                        ]}
                        leftSection={<LucideFilter size={16} />}
                        w={250}
                    />
                </Group>
            </Paper>

            {/* Leads Table */}
            <Paper p="xl" radius="lg" className="bg-white/5 border-white/5">
                <Table highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Paciente</Table.Th>
                            <Table.Th>Perfil Psicográfico</Table.Th>
                            <Table.Th>BANT Status</Table.Th>
                            <Table.Th>Presupuesto</Table.Th>
                            <Table.Th>Contacto</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {LEADS.map(lead => (
                            <Table.Tr key={lead.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar color="indigo" radius="xl">{lead.name.charAt(0)}</Avatar>
                                        <div>
                                            <Text size="sm" fw={600}>{lead.name}</Text>
                                            <Text size="xs" c="dimmed">{lead.email}</Text>
                                        </div>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color={PROFILE_COLORS[lead.profile]} variant="light">
                                        {lead.profile.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color="green">Calificado</Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" fw={600}>${lead.budget.toLocaleString('es-CL')}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{lead.phone}</Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </div>
    );
}
