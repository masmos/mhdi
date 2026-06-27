"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Drug } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DrugFormModal from "./DrugFormModal"
import { DeleteDrugButton } from "./DeleteDrugButton"

export const getDrugColumns = (): ColumnDef<Drug>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Drug Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'generic_name',
        header: 'Generic Name',
        cell: (info) => (info.getValue() ? (info.getValue() as string) : '—'),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (info.getValue() ? (info.getValue() as string) : '—'),
    },
    {
        accessorKey: 'manufacturer',
        header: 'Manufacturer',
        cell: (info) =>
            info.getValue() ? (info.getValue() as string) : '—',
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
        cell: (info) => info.getValue() as string,
    },
    {
        accessorKey: 'dosage_form',
        header: 'Dosage Form',
        cell: (info) =>
            info.getValue() ? (info.getValue() as string) : '—',
    },
    {
        accessorKey: 'strength',
        header: 'Strength',
        cell: (info) =>
            info.getValue() ? (info.getValue() as string) : '—',
    },
    {
        accessorKey: 'reorder_level',
        header: 'Reorder Level',
        cell: (info) => info.getValue() as number,
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) =>
            (info.getValue() as boolean) ? 'Active' : 'Inactive',
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <DrugFormModal drug={row.original} />
                <DeleteDrugButton drug={row.original} />
            </div>
        ),
    },
]
