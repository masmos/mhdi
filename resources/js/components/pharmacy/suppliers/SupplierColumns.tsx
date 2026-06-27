'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

import type { Supplier } from '@/types';
import SupplierFormModal from './SupplierFormModal';
import { DeleteSupplierButton } from './DeleteSupplierButton';

export default function SupplierColumns(): ColumnDef<Supplier>[] {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Supplier Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'contact_person',
            header: 'Contact',
            cell: (info) => (info.getValue() ? (info.getValue() as string) : '—'),
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: (info) => (info.getValue() ? (info.getValue() as string) : '—'),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: (info) => (info.getValue() ? (info.getValue() as string) : '—'),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: (info) => ((info.getValue() as boolean) ? 'Active' : 'Inactive'),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <SupplierFormModal supplier={row.original} />
                    <DeleteSupplierButton supplier={row.original} />
                </div>
            ),
        },
    ];
}

