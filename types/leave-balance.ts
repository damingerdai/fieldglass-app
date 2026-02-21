export interface LeaveBalance {
  user_id: string;
  leave_type: string;
  granted: number;
  used: number;
  remaining_balance: number;
}

export type LeaveBalances = LeaveBalance[];
