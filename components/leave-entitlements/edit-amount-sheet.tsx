"use client";

import { useTransition, useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { updateLeaveAmount } from "./actions";
import { useDisclosure } from "@/hooks/use-disclosure";

interface EditAmountSheetProps {
    id: string;
    currentAmount: number;
    leaveType: string;
}

export function EditAmountSheet({ id, currentAmount, leaveType }: EditAmountSheetProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amount, setAmount] = useState(currentAmount);
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateLeaveAmount(id, amount);
            if (result.success) {
                toast.success("Amount updated successfully");
                onClose();
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Edit Amount</SheetTitle>
                    <SheetDescription>
                        Update the entitlement days for <span className="font-semibold text-foreground capitalize">{leaveType}</span>.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 px-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Entitlement Days</label>
                        <Input
                            type="number"
                            step="0.5"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            disabled={isPending}
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}