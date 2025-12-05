"use client";

import * as React from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Vacation } from "@/types/vacation";
import { VacationMoreMenu } from "./vacation-more-menu";
import { format } from "date-fns";

interface VacationCardProps extends React.ComponentProps<"div"> {
    vacation: Vacation
}

export const VacationCard: React.FC<VacationCardProps> = (props) => {
    const { vacation, className, ...rest } = props;

    return <Card className={className} {...rest}>
        <CardHeader>
            <CardTitle className="capitalize">
                {vacation.leave_type.replace('_', ' ')}
            </CardTitle>
            <CardDescription>
                {vacation.notes}
            </CardDescription>
            <CardAction>
                <VacationMoreMenu vacationId={vacation.id} />
            </CardAction>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
            <p>
                <strong>Duration:</strong> {format(vacation.start_date, "PPP")} to {format(vacation.end_date, "PPP")}
            </p>
            <p>
                <strong>Total Days:</strong> {vacation.days}
            </p>
            <p>
                <strong>Notes:</strong> {vacation.notes || "N/A"}
            </p>
        </CardContent>
    </Card>
}