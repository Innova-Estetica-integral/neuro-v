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
    ActionIcon,
    TextInput,
    NumberInput,
    Modal,
    Select,
    Stack,
    Grid,
    Card,
    ThemeIcon,
    Alert
} from '@mantine/core';
import {
    LucidePackage,
    LucidePlus,
    LucideArrowDownRight,
    LucideArrowUpRight,
    LucideAlertTriangle,
    LucideHistory,
    LucideEdit,
    LucideSearch
} from 'lucide-react';
import { inventoryManager, InventoryItem, TransactionType } from '@/lib/business/inventory-manager';

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [transactionModal, setTransactionModal] = useState<{ opened: boolean, item?: InventoryItem }>({ opened: false });
    const [transactionData, setTransactionData] = useState<{ type: TransactionType, quantity: number, reason: string }>({
        type: 'out',
        quantity: 1,
        reason: 'Uso en procedimiento'
    });

    const clinicId = 'a0000000-0000-0000-0000-000000000001'; // Default clinic for demo

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        const data = await inventoryManager.getClinicInventory(clinicId);
        setItems(data);
        setLoading(false);
    };

    const handleTransaction = async () => {
        if (!transactionModal.item) return;

        try {
            await inventoryManager.logTransaction({
                clinicId,
                itemId: transactionModal.item.id,
                type: transactionData.type,
                quantity: transactionData.quantity,
                reason: transactionData.reason
            });
            setTransactionModal({ opened: false });
            loadInventory();
        } catch (error) {
            console.error('Error recording transaction:', error);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const stats = {
        total: items.length,
        lowStock: items.filter(i => i.current_stock <= i.min_stock_alert).length,
        outOfStock: items.filter(i => i.current_stock <= 0).length
    };

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} c="white">Control de Inventario</Title>
                    <Text c="dimmed" size="sm">Gestione insumos clínicos y stock crítico proactivamente.</Text>
                </div>
                <Button leftSection={<LucidePlus size={18} />} color="indigo">
                    Nuevo Artículo
                </Button>
            </Group>

            <Grid mb="xl">
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="blue" variant="light">
                                <LucidePackage size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Artículos</Text>
                                <Text size="xl" fw={900} c="white">{stats.total}</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="orange" variant="light">
                                <LucideAlertTriangle size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Stock Crítico</Text>
                                <Text size="xl" fw={900} c="orange">{stats.lowStock}</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="md" className="bg-[#1e293b]/50 border-white/5">
                        <Group>
                            <ThemeIcon size="xl" color="red" variant="light">
                                <LucideAlertTriangle size={24} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Sin Stock</Text>
                                <Text size="xl" fw={900} c="red">{stats.outOfStock}</Text>
                            </div>
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>

            {stats.lowStock > 0 && (
                <Alert icon={<LucideAlertTriangle size={16} />} title="Alerta de Stock Donna" color="orange" mb="xl" variant="light">
                    Donna ha detectado {stats.lowStock} artículos por debajo del nivel mínimo. Considere reabastecer para evitar interrupciones en los procedimientos.
                </Alert>
            )}

            <Paper p="md" withBorder className="bg-[#1e293b]/50 border-white/5 mb-xl">
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    leftSection={<LucideSearch size={16} />}
                    mb="md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    className="max-w-md"
                />

                <Table verticalSpacing="sm" className="text-white">
                    <Table.Thead>
                        <Table.Tr className="border-white/5">
                            <Table.Th>Artículo</Table.Th>
                            <Table.Th>SKU</Table.Th>
                            <Table.Th>Stock Actual</Table.Th>
                            <Table.Th>Estado</Table.Th>
                            <Table.Th>Acciones</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredItems.map((item) => (
                            <Table.Tr key={item.id} className="border-white/5 hover:bg-white/5">
                                <Table.Td>
                                    <Text fw={700} size="sm">{item.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{item.sku || 'N/A'}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Text size="sm">{item.current_stock}</Text>
                                        <Text size="xs" c="dimmed">{item.unit}</Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    {item.current_stock <= 0 ? (
                                        <Badge color="red" variant="dot">Sin Stock</Badge>
                                    ) : item.current_stock <= item.min_stock_alert ? (
                                        <Badge color="orange" variant="dot">Crítico</Badge>
                                    ) : (
                                        <Badge color="green" variant="dot">Óptimo</Badge>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="light"
                                            color="indigo"
                                            title="Movimiento de Stock"
                                            onClick={() => setTransactionModal({ opened: true, item })}
                                        >
                                            <LucideHistory size={16} />
                                        </ActionIcon>
                                        <ActionIcon variant="light" color="gray" title="Editar">
                                            <LucideEdit size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>

            <Modal
                opened={transactionModal.opened}
                onClose={() => setTransactionModal({ opened: false })}
                title={`Movimiento de Stock: ${transactionModal.item?.name}`}
                centered
                className="bg-[#0f172a]"
            >
                <Stack>
                    <Select
                        label="Tipo de Movimiento"
                        data={[
                            { value: 'in', label: 'Entrada (Compra/Reposición)' },
                            { value: 'out', label: 'Salida (Uso/Venta)' },
                            { value: 'adjustment', label: 'Ajuste de Inventario' }
                        ]}
                        value={transactionData.type}
                        onChange={(val) => setTransactionData(p => ({ ...p, type: val as TransactionType }))}
                    />
                    <NumberInput
                        label="Cantidad"
                        min={0.01}
                        value={transactionData.quantity}
                        onChange={(val) => setTransactionData(p => ({ ...p, quantity: Number(val) }))}
                    />
                    <TextInput
                        label="Motivo / Referencia"
                        placeholder="Ej: Orden de compra #123"
                        value={transactionData.reason}
                        onChange={(e) => setTransactionData(p => ({ ...p, reason: e.currentTarget.value }))}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="light" color="gray" onClick={() => setTransactionModal({ opened: false })}>
                            Cancelar
                        </Button>
                        <Button color="indigo" onClick={handleTransaction}>
                            Registrar Movimiento
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
