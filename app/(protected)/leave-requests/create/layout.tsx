import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/leave-requests" className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back to List
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Apply for Leave</CardTitle>
                    <CardDescription>
                        Apply for leave days to a user. This will define their available balance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>

            </Card>
        </div>
    );
}