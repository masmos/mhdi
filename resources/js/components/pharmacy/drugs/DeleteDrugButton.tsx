"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { Drug } from "@/types";

export function DeleteDrugButton({ drug }: { drug: Drug }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(`/drugs/${drug.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as { success?: string };
                const message = flash?.success || "Drug deleted successfully";
                toast.success(message);
            },
            onError: (errors) => {
                const errorMessage = typeof errors === 'string'
                    ? errors
                    : (errors as any)?.message || "Failed to delete drug.";
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
            title={`Delete "${drug.name}"?`}
            description="This action cannot be undone. This will permanently delete the drug and all associated data."
            onConfirm={handleDelete}
            isDeleting={isDeleting}
        />
    );
}