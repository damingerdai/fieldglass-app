import { LeaveTypeKey } from "./leave-type";

export interface Vacation {
  id: string;
  leave_type: LeaveTypeKey;
  start_date: Date;
  end_date: Date;
  days: number;
  notes: string | null;
  user_id: string;
  created_at: Date;
}

export type Vacations = Vacation[]