import { Head, usePage } from '@inertiajs/react';
import type { Drug } from '@/types';
import Heading from '@/components/heading';
import { Pill } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import DrugFormModal from '@/components/pharmacy/drugs/DrugFormModal';

export default function Drugs() {
    const { drugs } = usePage<{ drugs: Drug[] }>().props;
    const hasDrugs = drugs && drugs.length > 0;

    return (
        <>
            <Head title="Drugs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading title="Drugs" description="Manage the hospital drug catalogue." />
                    {hasDrugs && <DrugFormModal />}
                </div>

                {!hasDrugs ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <EmptyState
                            icon={Pill}
                            title="No drugs yet"
                            description="You can start adding drugs under this section"
                            buttonComponent={<DrugFormModal />}
                        />
                    </div>
                ) : (
                    <div>
                      {/*   <DrugList /> */}
                    </div>
                )}
            </div>
        </>
    );
}

Drugs.layout = {
    breadcrumbs: [
        {
            title: 'Drugs',
            href: '/drugs',
        },
    ],
};
