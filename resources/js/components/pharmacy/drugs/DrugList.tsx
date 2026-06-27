import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import { DataTable } from '@/components/shared/DataTable';
import { Drug } from '@/types';
import DrugFormModal from './DrugFormModal';
import { getDrugColumns } from './DrugColumns';

export default function DrugsDataTable() {
    const { props } = usePage<{ drugs: Drug[] }>();
    const drugs = useMemo(() => props.drugs ?? [], [props.drugs]);
    const columns = useMemo(() => getDrugColumns(), [drugs]);

    return (
        <DataTable
            columns={columns}
            data={drugs}
            showFilter
            filterPlaceholder="Search all columns..."
            filterableColumns={[
                    { id: 'name', label: 'Drug Name' },
                    { id: 'category', label: 'Category' },
                    { id: 'manufacturer', label: 'Manufacturer' },
                ]}
            actions={<DrugFormModal />}
        />
    );
}
