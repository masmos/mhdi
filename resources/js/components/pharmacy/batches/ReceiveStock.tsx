import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function ReceiveStock() {
    return <>
        <Link href="/batches/create">
            <Button>
                <Plus className="h-4 w-4 mr-2" />
                Receive Stock
            </Button>
        </Link>
    </>;
}