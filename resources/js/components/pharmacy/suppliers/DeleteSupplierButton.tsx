import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/shared/DeleteConfirmationDialog';
import type { Supplier } from '@/types';

export function DeleteSupplierButton({ supplier }: { supplier: Supplier }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(`/suppliers/${supplier.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as { success?: string };
                toast.success(flash?.success || `Supplier '${supplier.name}' deleted successfully`);
            },
            onError: (errors) => {
                const errorMessage = typeof errors === 'string'
                    ? errors
                    : (errors as any)?.message || 'Failed to delete supplier.';
                toast.error(errorMessage);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <DeleteConfirmationDialog
            trigger={
                <Button variant="destructive" size="sm" className="px-2">
                    <Trash2 className="h-4 w-4" />
                </Button>
            }
            title={`Delete "${supplier.name}"?`}
            description="This action cannot be undone. This will permanently delete the supplier and all associated data."
            onConfirm={handleDelete}
            isDeleting={isDeleting}
        />
    );
}

