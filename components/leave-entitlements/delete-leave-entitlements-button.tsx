"use client";

import * as React from "react";
import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteLeaveEntitlement } from "./actions";

interface DeleteLeaveEntitlementsButtonProps {
    id: string;
}

export function DeleteLeaveEntitlementsButton({ id }: DeleteLeaveEntitlementsButtonProps) {
    const [isPending, startTransition] = useTransition();

    const onDelete = () => {
        startTransition(async () => {
            const result = await deleteLeaveEntitlement(id);

            if (result.success) {
                toast.success("Entitlement deleted", {
                    description: "The record has been moved to trash.",
                });
            } else {
                toast.error("Failed to delete", {
                    description: result.error,
                });
            }
        });
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the leave entitlement as deleted. You can contact an
                        administrator if you need to restore it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
