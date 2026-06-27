import { Head, usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';

import Heading from '@/components/heading';
import EmptyState from '@/components/shared/EmptyState';
import type { PaginatedResponse, Batch } from '@/types';
import BatchList from '@/components/pharmacy/batches/BatchList';
import ReceiveStock from '@/components/pharmacy/batches/ReceiveStock';

export default function BatchesIndex() {
    const { batches } = usePage<{ batches: Batch[] | PaginatedResponse<Batch> }>().props;

    const batchData = Array.isArray(batches) ? batches : (batches?.data ?? []);
    const hasBatches = batchData.length > 0;

    return (
        <>
            <Head title="Batches" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Batches"
                        description="Batch-level stock tracking with expiry dates."
                    />
                </div>

                {!hasBatches ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <EmptyState
                            icon={Package}
                            title="No batches yet"
                            description="Create your first batch to start tracking inventory."
                            buttonComponent={<ReceiveStock />}
                        />
                    </div>
                ) : (
                    <div>
                        <BatchList />
                    </div>
                )}
            </div>
        </>
    );
}

BatchesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Batches',
            href: '/batches',
        },
    ],
};