import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { Batch, PaginatedResponse } from '@/types';

import { DataTable } from '@/components/shared/DataTable';
import BatchFormModal from './BatchFormModal';
import BatchColumns from './BatchColumns';

export default function BatchList() {
    const { props } = usePage<{ batches: Batch[] | PaginatedResponse<Batch> }>();

    const batchData = useMemo(() => {
        if (!props.batches) return [];
        return Array.isArray(props.batches) ? props.batches : (props.batches.data ?? []);
    }, [props.batches]);

    const columns = useMemo(() => BatchColumns(), [batchData]);

    return (
        <DataTable
            columns={columns}
            data={batchData}
            showFilter
            filterPlaceholder="Search batch or drug..."
            filterableColumns={[
                { id: 'batch_number', label: 'Batch Number' },
                { id: 'drug', label: 'Drug' },
                { id: 'supplier', label: 'Supplier' },
            ]}
            actions={<BatchFormModal />}
        />
    );
}