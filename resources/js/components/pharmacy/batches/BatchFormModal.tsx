import { Edit, Plus } from 'lucide-react';

import FormModal from '@/components/shared/FormModal';
import { FormInput } from '@/components/shared/form/FormInput';
import { Button } from '@/components/ui/button';

import type { Batch, BatchFormData } from '@/types';

export default function BatchFormModal({ batch }: { batch?: Batch }) {
    const isEdit = !!batch;

    return (
        <FormModal<BatchFormData>
            key={isEdit ? `edit-batch-${batch!.id}` : 'create-batch'}
            title={isEdit ? `Edit Batch: ${batch!.batch_number}` : 'Add New Batch'}
            url={isEdit ? `/batches/${batch!.id}` : '/batches'}
            method={isEdit ? 'patch' : 'post'}
            initialData={{
                drug_id: batch?.drug_id ?? (0 as any),
                batch_number: batch?.batch_number ?? '',
                quantity: batch?.quantity ?? 0,
                unit_cost: batch?.unit_cost ?? undefined,
                selling_price: batch?.selling_price ?? undefined,
                manufacture_date: batch?.manufacture_date ?? undefined,
                expiry_date: batch?.expiry_date ?? '',
                supplier_id: batch?.supplier_id ?? undefined,
                received_date: batch?.received_date ?? '',
                location: batch?.location ?? undefined,
                notes: batch?.notes ?? undefined,
            }}
            submitLabel={
                isEdit ? (
                    <span className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Update Batch
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Batch
                    </span>
                )
            }
            trigger={
                <Button size="sm" variant={isEdit ? 'secondary' : 'default'}>
                    {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isEdit ? '' : 'Create New Batch'}
                </Button>
            }
        >
            {(form) => (
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="batch_number"
                            label="Batch Number"
                            required
                            placeholder="e.g. BATCH-001"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="drug_id"
                            label="Drug ID"
                            required
                            type="number"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="supplier_id"
                            label="Supplier ID"
                            type="number"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="quantity"
                            label="Quantity"
                            required
                            type="number"
                            min={1}
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="unit_cost"
                            label="Unit Cost"
                            type="number"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="selling_price"
                            label="Selling Price"
                            type="number"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="manufacture_date"
                            label="Manufacture Date"
                            type="date"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="expiry_date"
                            label="Expiry Date"
                            required
                            type="date"
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            name="received_date"
                            label="Received Date"
                            required
                            type="date"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="location"
                            label="Location"
                            placeholder="Warehouse / shelf"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="notes"
                            label="Notes"
                            placeholder="Optional notes"
                        />
                    </div>
                </div>
            )}
        </FormModal>
    );
}

