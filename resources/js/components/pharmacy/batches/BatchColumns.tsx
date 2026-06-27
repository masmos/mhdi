'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Batch } from '@/types';
import { DeleteConfirmationDialog } from '@/components/shared/DeleteConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import { DeleteBatchButton } from './DeleteBatchButton';

export default function BatchColumns(): ColumnDef<Batch>[] {
    return [
        {
            id: 'drug',
            header: 'Drug',
            accessorFn: (row) => row.drug?.name ?? '',
            cell: ({ row }) => {
                const drugName = row.original.drug?.name ?? '—';
                const strength = row.original.drug?.strength ?? '';
                return (
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold text-slate-900">{drugName}</span>
                        {strength && <span className="text-muted-foreground text-xs">{strength}</span>}
                    </div>
                );
            },
        },
        {
            accessorKey: 'batch_number',
            header: 'Batch No.',
            cell: (info) => (info.getValue() ? String(info.getValue()) : '—'),
        },
        {
            id: 'supplier',
            header: 'Supplier',
            accessorFn: (row) => row.supplier?.name ?? '',
            cell: (info) => <span className="text-muted-foreground text-sm">{info.getValue() ? String(info.getValue()) : '—'}</span>,
        },
        {
            id: 'available',
            header: 'Available',
            cell: ({ row }) => {
                const quantity = row.original.quantity ?? 0;
                const initialQuantity = row.original.initial_quantity ?? quantity;
                return (
                    <div className="text-sm text-muted-foreground">
                        <span className="font-bold text-slate-900">{quantity}</span>
                        <span>/{initialQuantity}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'unit_cost',
            header: () => <div className="text-right">Unit Cost (Ugx)</div>,
            cell: (info) => {
                const amount = Number(info.getValue());
                if (isNaN(amount)) return <div className="text-right">—</div>;

                // Formats as standard comma-separated numbers without any currency prefix
                const formattedAmount = new Intl.NumberFormat('en-UG', {
                    maximumFractionDigits: 0,
                }).format(amount);

                return <div className="text-right font-medium text-slate-800">{formattedAmount}</div>;
            },
        },
        {
            accessorKey: 'expiry_date',
            header: 'Expiry',
            cell: (info) => {
                const dateVal = info.getValue() as string;
                if (!dateVal) return '—';

                const expiry = new Date(dateVal);
                const today = new Date(); // Accurate to current 2026 context

                // Calculate difference in calendar days
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    return (
                        <Badge variant="destructive" className="bg-red-600 hover:bg-red-600 text-white font-medium rounded px-2.5 py-0.5">
                            Expired
                        </Badge>
                    );
                }

                if (diffDays === 0) {
                    return (
                        <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-medium rounded px-2.5 py-0.5">
                            0d left
                        </Badge>
                    );
                }

                if (diffDays <= 30) {
                    return (
                        <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-medium rounded px-2.5 py-0.5">
                            {diffDays}d left
                        </Badge>
                    );
                }

                return (
                    <span className="text-sm text-slate-800 font-medium">
                        {expiry.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end">
                     <DeleteBatchButton batch={row.original} />
                </div>
            ),
        },
    ];
}