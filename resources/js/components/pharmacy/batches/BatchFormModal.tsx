import { Plus, Trash2, Package, Edit, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core'; // Added PageProps import

import FormModal from '@/components/shared/FormModal';
import { FormInput } from '@/components/shared/form/FormInput';
import { FormSelect } from '@/components/shared/form/FormSelect';
import { FormTextarea } from '@/components/shared/form/FormTextarea';
import { Button } from '@/components/ui/button';

import type { Batch, Supplier, Drug } from '@/types';

interface BatchItemInput {
    drug_id: number | '';
    batch_number: string;
    expiry_date: string;
    quantity: number | '';
    unit_cost?: number;
}

interface BatchFormValues {
    reference: string;
    supplier_id: number | '';
    received_date: string;
    notes: string;
    items: BatchItemInput[];
}

interface BatchFormModalProps {
    batch?: Batch;
    onSuccess?: () => void;
}

const createEmptyItem = (): BatchItemInput => ({
    drug_id: '',
    batch_number: '',
    expiry_date: '',
    quantity: '',
    unit_cost: undefined,
});

const generateReference = (): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(1000 + Math.random() * 9000));
    return `GRN-${year}${month}${day}-${random}`;
};

export default function BatchFormModal({ batch, onSuccess }: BatchFormModalProps) {
    const isEdit = !!batch;

    // CORRECTED: Pass an intersected type to the usePage generic
    // This tells TS: "Expect the base PageProps AND my custom arrays"
    const { suppliers, drugs } = usePage<PageProps & {
        suppliers: Supplier[];
        drugs: Drug[];
    }>().props;

    const initialItems = isEdit
        ? [{
            drug_id: batch.drug_id,
            batch_number: batch.batch_number,
            expiry_date: batch.expiry_date,
            quantity: batch.quantity,
            unit_cost: batch.unit_cost ?? undefined,
        }]
        : [createEmptyItem(), createEmptyItem()];

    const form = useForm<BatchFormValues>({
        reference: isEdit ? `GRN-${String(batch.id).padStart(6, '0')}` : generateReference(),
        supplier_id: batch?.supplier_id ?? '',
        received_date: batch?.received_date ?? new Date().toISOString().split('T')[0],
        notes: batch?.notes ?? '',
        items: initialItems,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(isEdit ? `/batches/${batch.id}` : '/batches', {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        });
    };

    const validationRules = {
        supplier_id: { required: 'Supplier is required' },
        received_date: { required: 'Received date is required' },
        items: {
            required: 'At least one item is required',
            validate: (items: BatchItemInput[]) => {
                if (!items || items.length === 0) return 'At least one item is required';
                for (const item of items) {
                    if (!item.drug_id) return 'Drug is required for all items';
                    if (!item.batch_number) return 'Batch number is required for all items';
                    if (!item.expiry_date) return 'Expiry date is required for all items';
                    if (!item.quantity || item.quantity <= 0) return 'Quantity must be at least 1';
                }
                return true;
            },
        },
    };

    return (
        <FormModal
            bodyClassName="max-h-[70vh] overflow-y-auto"
            size='full'
            key={isEdit ? `edit-batch-${batch.id}` : 'create-batch'}
            title={isEdit ? `Edit Batch: ${batch.batch_number}` : 'Receive Stock'}
            url={isEdit ? `/batches/${batch.id}` : '/batches'}
            method={isEdit ? 'patch' : 'post'}

            initialData={form.data}
            trigger={
                <Button size="sm" variant={isEdit ? 'secondary' : 'default'}>
                    {isEdit ? <Edit className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Create New Batch</>}
                </Button>
            }
            submitLabel={
                <span className="flex items-center gap-2">
                    {form.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {isEdit ? 'Update Batch' : 'Receive Stock'}
                </span>
            }
        >
            {/* Wrapped inside a render function to fix the assignment error */}
            {(modalForm) => {
                const itemsList: BatchItemInput[] =
                    (((modalForm as any)?.items ?? (form.data as any)?.items) ?? []) as BatchItemInput[];

                const addItemLine = () => {
                    const next = [...itemsList, createEmptyItem()];
                    (form as any).setData('items', next);
                };

                const removeItemLine = (index: number) => {
                    if (itemsList.length <= 1) return;
                    const next = itemsList.filter((_: BatchItemInput, i: number) => i !== index);
                    (form as any).setData('items', next);
                };

                // Inline calculation matching the layout context
                const totalCalculatedValue = itemsList.reduce((acc: number, curr: BatchItemInput) => {
                    const qty = Number(curr?.quantity) || 0;
                    const cost = Number(curr?.unit_cost) || 0;
                    return acc + qty * cost;
                }, 0);

                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 items-start">
                        {/* LEFT COLUMN: Delivery Details */}
                        <div className="md:col-span-1 border rounded-xl p-4 bg-slate-50/50 space-y-4">
                            <h3 className="font-semibold text-slate-900 text-base">Delivery details</h3>

                            <FormInput
                                form={modalForm}
                                name="reference"
                                label="Reference"
                                required
                                placeholder="e.g. GRN-962012"
                                disabled
                            />

                            <FormSelect
                                form={modalForm}
                                name="supplier_id"
                                label="Supplier"
                                required
                                placeholder="Select supplier"
                                // Added safety fallback ?? []
                                options={(suppliers ?? []).map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                            />

                            <FormInput
                                form={modalForm}
                                name="received_date"
                                label="Received date"
                                required
                                type="date"
                            />

                            <FormTextarea
                                form={modalForm}
                                name="notes"
                                label="Notes"
                                placeholder="Enter additional intake notes..."
                            //   rows={3}
                            />

                            <div className="flex items-center justify-between border rounded-lg p-3 bg-slate-100/80">
                                <span className="text-sm font-medium text-slate-600">Total value</span>
                                <span className="font-bold text-slate-900">
                                    USh {new Intl.NumberFormat('en-UG').format(totalCalculatedValue)}
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Items */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 text-base">Items</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addItemLine}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add line
                                </Button>
                            </div>

                            {itemsList.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No items added yet</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-2"
                                        onClick={addItemLine}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add First Item
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                    {(itemsList as BatchItemInput[]).map((item: BatchItemInput, index: number) => (
                                        <div key={index} className="border rounded-xl p-4 bg-white shadow-sm space-y-4 relative group">
                                            <FormSelect
                                                form={modalForm}
                                                name={`items.${index}.drug_id`}
                                                label="Drug *"
                                                placeholder="Select drug"
                                                required
                                                // Added safety fallback ?? []
                                                options={(drugs ?? []).map((d) => ({
                                                    value: d.id,
                                                    label: `${d.name} ${d.strength ? `(${d.strength})` : ''}`,
                                                }))}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInput
                                                    form={modalForm}
                                                    name={`items.${index}.batch_number`}
                                                    label="Batch number *"
                                                    placeholder="e.g. 8022588"
                                                    required
                                                />
                                                <FormInput
                                                    form={modalForm}
                                                    name={`items.${index}.expiry_date`}
                                                    label="Expiry date *"
                                                    type="date"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInput
                                                    form={modalForm}
                                                    name={`items.${index}.quantity`}
                                                    label="Quantity *"
                                                    type="number"
                                                    min={0}
                                                    required
                                                />
                                                <FormInput
                                                    form={modalForm}
                                                    name={`items.${index}.unit_cost`}
                                                    label="Unit cost"
                                                    type="number"
                                                    min={0}
                                                />
                                            </div>

                                            {itemsList.length > 1 && (
                                                <div className="flex justify-end pt-1 border-t border-dashed">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 gap-1.5 px-3"
                                                        onClick={() => removeItemLine(index)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
        </FormModal>
    );
}