import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import { DataTable } from '@/components/shared/DataTable';
import type { Supplier } from '@/types';
import SupplierColumns from './SupplierColumns';
import SupplierFormModal from './SupplierFormModal';

export default function SupplierDataTable() {
    const { props } = usePage<{ suppliers: Supplier[] }>();
    const suppliers = useMemo(() => props.suppliers ?? [], [props.suppliers]);
    const columns = useMemo(() => SupplierColumns(), [suppliers]);

    return (
        <DataTable
            columns={columns}
            data={suppliers}
            showFilter
            filterPlaceholder="Search all columns..."
            filterableColumns={[
                { id: 'name', label: 'Supplier Name' },
                { id: 'contact_person', label: 'Contact Person' },
                { id: 'email', label: 'Email' },
                { id: 'phone', label: 'Phone' },
            ]}
            actions={<SupplierFormModal />}
        />
    );
}

