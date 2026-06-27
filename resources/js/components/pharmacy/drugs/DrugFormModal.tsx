import { Edit, Plus, Pencil, SquarePen } from 'lucide-react';
import { FormInput } from '@/components/shared/form/FormInput';
import FormModal from '@/components/shared/FormModal';
import { Button } from '@/components/ui/button';
import { FormTextarea } from '@/components/shared/form/FormTextarea';

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
                description: drug?.description ?? '',
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
                <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Row 1: Name (Full Width) */}
                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="name"
                            label="Drug Name"
                            required
                            placeholder="e.g. Amoxicillin"
                        />
                    </div>

                    {/* Row 2: Generic name & Category */}
                    <div>
                        <FormInput
                            form={form}
                            name="generic_name"
                            label="Generic Name"
                            placeholder="e.g. Amoxicillin (if applicable)"
                        />
                    </div>
                    <div>
                        <FormInput
                            form={form}
                            name="category"
                            label="Category"
                            placeholder="e.g. Antibiotic"
                        />
                    </div>

                    {/* Row 3: Unit & Dosage Form */}
                    <div>
                        <FormInput
                            form={form}
                            name="unit"
                            label="Unit"
                            required
                            placeholder="e.g. tablets"
                        />
                    </div>
                    <div>
                        <FormInput
                            form={form}
                            name="dosage_form"
                            label="Dosage Form"
                            placeholder="e.g. capsule, syrup"
                        />
                    </div>

                    {/* Row 4: Manufacturer (Full Width) */}
                    <div className="col-span-2">
                        <FormInput
                            form={form}
                            name="manufacturer"
                            label="Manufacturer"
                            placeholder="e.g. Pharma Inc."
                        />
                    </div>

                    {/* Row 5: Strength & Reorder level */}
                    <div>
                        <FormInput
                            form={form}
                            name="strength"
                            label="Strength"
                            placeholder="e.g. 500mg"
                        />
                    </div>
                    <div>
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
                    </div>

                    {/* Row 6: Description (Full Width) */}
                    <div className="col-span-2">
                        <FormTextarea
                            form={form}
                            name="description"
                            label="Description"
                            placeholder="Enter the drug description..."
                        />
                    </div>
                </div>
            )}
        </FormModal>
    );
}