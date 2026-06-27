import { Edit, Plus, Pencil, SquarePen } from 'lucide-react';
import { FormCheckbox } from '@/components/shared/form/FormCheckbox';
import { FormInput } from '@/components/shared/form/FormInput';
import FormModal from '@/components/shared/FormModal';
import { Button } from '@/components/ui/button';

export default function DrugFormModal({ drug }: any) {
    const isEdit = !!drug;

    return (
        <FormModal
            key={
                isEdit
                    ? `edit-drug-${drug.id}-${drug.updated_at ?? drug.name}`
                    : 'create-drug'
            }
            title={isEdit ? `Edit Drug: ${drug.name}` : 'Add New Drug'}
            url={isEdit ? `/drugs/${drug.id}` : '/drugs'}
            method={isEdit ? 'patch' : 'post'}
            initialData={{
                name: drug?.name ?? '',
                generic_name: drug?.generic_name ?? '',
                category: drug?.category ?? '',
                manufacturer: drug?.manufacturer ?? '',
                unit: drug?.unit ?? '',
                dosage_form: drug?.dosage_form ?? '',
                strength: drug?.strength ?? '',
                reorder_level: drug?.reorder_level ?? 0,
                is_active: drug ? !!drug.is_active : true,
            }}
            submitLabel={
                isEdit ? (
                    <span className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Update Drug
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        Create Drug
                    </span>
                )
            }
            trigger={
                <Button size="sm" variant={isEdit ? 'secondary' : 'default'}>
                    {isEdit ? <SquarePen className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isEdit ? '' : 'Create New Drug'}
                </Button>
            }
        >
            {(form) => (
                <>
                    <FormInput
                        form={form}
                        name="name"
                        label="Drug Name"
                        required
                        placeholder="e.g. Amoxicillin"
                    />

                    <FormInput
                        form={form}
                        name="generic_name"
                        label="Generic Name"
                        placeholder="e.g. Amoxicillin (if applicable)"
                    />

                    <FormInput
                        form={form}
                        name="category"
                        label="Category"
                        placeholder="e.g. Antibiotic"
                    />

                    <FormInput
                        form={form}
                        name="manufacturer"
                        label="Manufacturer"
                        placeholder="e.g. Pharma Inc."
                    />

                    <FormInput
                        form={form}
                        name="unit"
                        label="Unit"
                        required
                        placeholder="e.g. tablets"
                    />

                    <FormInput
                        form={form}
                        name="dosage_form"
                        label="Dosage Form"
                        placeholder="e.g. capsule, syrup"
                    />

                    <FormInput
                        form={form}
                        name="strength"
                        label="Strength"
                        placeholder="e.g. 500mg"
                    />

                    <FormInput
                        form={form}
                        name="reorder_level"
                        label="Reorder Level"
                        required
                        type="number"
                        min={0}
                        transform={(value) => {
                            const n = Number(value);

                            return Number.isFinite(n) ? n : 0;
                        }}
                    />

                    <FormCheckbox
                        form={form}
                        name="is_active"
                        label="Active"
                    />
                </>
            )}
        </FormModal>
    );
}

