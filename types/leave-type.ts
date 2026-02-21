export const LEAVE_TYPE_KEYS = [
  'annual_leave',
  'sick_leave',
  'personal_leave',
  'parental_leave',
  'marriage_leave',
  'unpaid_leave',
  'bereavement_leave'
] as const;

export type LeaveTypeKey = (typeof LEAVE_TYPE_KEYS)[number];

export interface LeaveOption {
  value: LeaveTypeKey; // Must be one of the literal strings defined in LeaveTypeKey
  label: string; // The user-friendly name displayed in the UI
}

export const LEAVE_OPTIONS: LeaveOption[] = [
  { value: 'annual_leave', label: 'Annual Leave' },
  { value: 'sick_leave', label: 'Sick Leave' },
  { value: 'personal_leave', label: 'Personal Leave' },
  { value: 'parental_leave', label: 'Parental Leave' },
  { value: 'marriage_leave', label: 'Marriage Leave' },
  { value: 'unpaid_leave', label: 'Unpaid Leave' },
  { value: 'bereavement_leave', label: 'Bereavement Leave' }
];

/**
 * Helper function to find the user-friendly label given a database key.
 */
export const getLeaveLabel = (key: LeaveTypeKey): string => {
  const option = LEAVE_OPTIONS.find(opt => opt.value === key);
  return option ? option.label : 'Unknown Leave Type';
};
