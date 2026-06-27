import { Edit, Plus } from 'lucide-react';

import { FormInput } from '@/components/shared/form/FormInput';
import FormModal from '@/components/shared/FormModal';
import { Button } from '@/components/ui/button';

import type { Supplier, SupplierFormData } from '@/types';
import { FormTextarea } from '@/components/shared/form/FormTextarea';

export default function SupplierFormModal({ supplier }: { supplier?: Supplier }) {
    const isEdit = !!supplier;

    return (
        <FormModal<SupplierFormData>
            key={isEdit ? `edit-supplier-${supplier!.id}` : 'create-supplier'}
            title={isEdit ? `Edit Supplier: ${supplier!.name}` : 'Add New Supplier'}
            url={isEdit ? `/suppliers/${supplier!.id}` : '/suppliers'}
            method={isEdit ? 'patch' : 'post'}
            initialData={{
                name: supplier?.name ?? '',
                contact_person: supplier?.contact_person ?? undefined,
                phone: supplier?.phone ?? undefined,
                email: supplier?.email ?? undefined,
                address: supplier?.address ?? undefined,
                tax_id: supplier?.tax_id ?? undefined,
                bank_name: (supplier as any)?.bank_name ?? undefined,
                bank_account: (supplier as any)?.bank_account ?? undefined,
                notes: supplier?.notes ?? undefined,
                is_active: supplier ? !!supplier.is_active : true,
            }}
            submitLabel={
                isEdit ? (
                    <span className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Update Supplier
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Supplier
                    </span>
                )
            }
            trigger={
                <Button size="sm" variant={isEdit ? 'secondary' : 'default'}>
                    {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isEdit ? '' : 'Create Supplier'}
                </Button>
            }
        >
            {(form) => (
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="name"
                            label="Supplier Name"
                            required
                            placeholder="e.g. MedSupply Ltd"
                        />
                    </div>

                    <FormInput
                        form={form}
                        name="contact_person"
                        label="Contact Person"
                        placeholder="e.g. Jane Doe"
                    />

                    <FormInput
                        form={form}
                        name="phone"
                        label="Phone"
                        placeholder="e.g. +256..."
                    />

                    <FormInput
                        form={form}
                        name="email"
                        label="Email"
                        placeholder="e.g. supplier@example.com"
                    />

                    <FormInput
                        form={form}
                        name="tax_id"
                        label="Tax ID"
                        placeholder="e.g. TIN-123456"
                    />

                    <div className="col-span-2">
                        <FormTextarea
                            form={form}
                            name="address"
                            label="Address"
                            placeholder="Supplier address"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormTextarea
                            form={form}
                            name="notes"
                            label="Notes"
                            placeholder="Optional notes"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={!!form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            Active supplier
                        </label>
                    </div>
                </div>
            )}
        </FormModal>
    );
}

