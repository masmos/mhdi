"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { Batch } from "@/types";

export function DeleteBatchButton({ batch }: { batch: Batch }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(`/batches/${batch.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as { success?: string };
                const message = flash?.success || "Batch deleted successfully";
                toast.success(message);
            },
            onError: (errors) => {
                const errorMessage = typeof errors === 'string'
                    ? errors
                    : (errors as any)?.message || "Failed to delete batch.";
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
            title={`Delete "${batch.batch_number}"?`}
            description="This action cannot be undone. This will permanently delete the batch and all associated data."
            onConfirm={handleDelete}
            isDeleting={isDeleting}
        />
    );
}