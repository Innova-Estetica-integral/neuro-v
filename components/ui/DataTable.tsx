'use client';

import React, { useState } from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    loading?: boolean;
    onRowClick?: (item: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyExtractor,
    emptyMessage = 'No hay datos disponibles',
    loading = false,
    onRowClick,
    pagination,
}: DataTableProps<T>) {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            // Toggle direction
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection(null);
                setSortColumn(null);
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    // Sort data
    const sortedData = React.useMemo(() => {
        if (!sortColumn || !sortDirection) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }

            return 0;
        });
    }, [data, sortColumn, sortDirection]);

    if (loading) {
        return (
            <div className="glass rounded-xl border border-white/10 p-8">
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 rounded bg-white/5" />
                    <div className="h-10 rounded bg-white/5" />
                    <div className="h-10 rounded bg-white/5" />
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="glass rounded-xl border border-white/10 p-12 text-center">
                <p className="text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left text-sm font-semibold text-gray-300 ${column.width || ''
                                        }`}
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => handleSort(column.key)}
                                            className="flex items-center gap-2 transition hover:text-white"
                                        >
                                            {column.label}
                                            {sortColumn === column.key && (
                                                <span className="text-blue-400">
                                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedData.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className={`transition ${onRowClick
                                        ? 'cursor-pointer hover:bg-white/5'
                                        : ''
                                    }`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-3 text-sm text-gray-300">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm text-gray-400">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="rounded-lg bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="rounded-lg bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
