import { LeaveTypeKey } from "./leave-type";

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Vacation {
  id: string;
  leave_type: LeaveTypeKey;
  start_date: Date;
  end_date: Date;
  days: number;
  status: LeaveRequestStatus;
  reason: string | null;
  notes: string | null;
  approver_id: string | null;
  approved_at: Date | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export type Vacations = Vacation[]