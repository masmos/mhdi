import { FormInput } from '@/components/shared/form/FormInput';
import { FormTextarea } from '@/components/shared/form/FormTextarea';
import FormModal from '@/components/shared/FormModal';
import { Button } from '@/components/ui/button';
import { Edit, Pen, Pencil, Plus, SquarePen } from 'lucide-react';

export default function DrugFormModal({ drug }: any) {
    const isEdit = !! drug;
    return (
        <FormModal
            key={isEdit ? `edit-drug-${drug.id}-${drug.updated_at ?? drug.name}` : 'create-drug'}
            title={isEdit ? `Edit Drug: ${drug.name}` : 'Add New Drug'}
            url={
                isEdit
                    ? `/drugs/${drug.id}`
                    : '/drugs'
            }
            method={isEdit ? 'patch' : 'post'}
            initialData={{
                name: drug?.name ?? '',
                code: drug?.code ?? '',
                description: drug?.description ?? '',
                active: drug ? !!drug.active : true,
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
                        label= "Drug Name"
                        required
                        placeholder="e.g. "
                    />

                    <FormTextarea
                        form={form}
                        name="description"
                        label="Description"
                        placeholder="Brief description of the department"
                    />
                </>
            )}
        </FormModal>
    );
}