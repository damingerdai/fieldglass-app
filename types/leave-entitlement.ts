export interface LeaveEntitlement {
    id: string;
    user_id: string;
    leave_type: string;
    amount_days: number;
    effective_date: Date;
    expiry_date: Date | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export type LeaveEntitlements = LeaveEntitlement[];
