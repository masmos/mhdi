import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { Truck } from 'lucide-react';

import Heading from '@/components/heading';
import EmptyState from '@/components/shared/EmptyState';

import type { Supplier } from '@/types';
import SupplierFormModal from '@/components/pharmacy/suppliers/SupplierFormModal';
import SupplierDataTable from '@/components/pharmacy/suppliers/SupplierList';

export default function Suppliers() {
    const { suppliers } = usePage<{ suppliers: Supplier[] }>().props;
    const hasSuppliers = useMemo(() => (suppliers ? suppliers.length > 0 : false), [suppliers]);

    return (
        <>
            <Head title="Suppliers" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Suppliers"
                        description="Manage supplier records, contacts, and status."
                    />
                </div>

                {!hasSuppliers ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <EmptyState
                            icon={Truck}
                            title="No suppliers yet"
                            description="You can start adding suppliers under this section."
                            buttonComponent={<SupplierFormModal />}
                        />
                    </div>
                ) : (
                    <div>
                        <SupplierDataTable />
                    </div>
                )}
            </div>
        </>
    );
}

Suppliers.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: '/suppliers',
        },
    ],
};

