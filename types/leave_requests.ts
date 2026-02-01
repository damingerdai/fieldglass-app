import { LeaveTypeKey } from "./leave-type";

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
    id: string;
    user_id: string;
    leave_type: LeaveTypeKey;
    start_date: string;
    end_date: string;
    days: number;
    status: LeaveRequestStatus;
    reason: string;
    approver_id: string;
    approved_at: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export type LeaveRequests = LeaveRequest[];

