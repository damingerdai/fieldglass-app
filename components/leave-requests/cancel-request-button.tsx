"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { cancelLeaveRequest } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export function CancelRequestButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = () => {
        startTransition(async () => {
            const { success, error } = await cancelLeaveRequest(id);
            if (success) {
                toast.success("Request cancelled");
            } else {
                toast.error(error || "Failed to cancel");
            }
        });
    };

    return (
       <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-xl group"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="rounded-2xl border-slate-100 max-w-[400px]">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                        Cancel Request?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 leading-relaxed">
                        This action cannot be undone. This will permanently remove your leave request from the approval queue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel className="rounded-xl border-slate-100 hover:bg-slate-50 text-slate-500">
                        Stay
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleCancel}
                        disabled={isPending}
                        className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 transition-all"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Confirm Cancellation"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}