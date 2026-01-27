-- Migration: Create Leave Requests Table
-- Description: Adds leave requests table for tracking leave applications
-- Date: 2026-01-27

-- 1. Create the Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL, -- Must match leave_entitlements.leave_type
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days DECIMAL(5, 2) NOT NULL, -- Total days requested (supports half-days)
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    reason TEXT,
    approver_id UUID REFERENCES auth.users(id), -- Who approved/rejected
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT valid_days CHECK (days > 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'))
);

-- 2. Add Indexes for performance
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_user_type ON leave_requests(user_id, leave_type);

-- 3. Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Add trigger to auto-update updated_at
CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- 6. Policy: Users can view their own requests
CREATE POLICY "Users can view own requests" 
ON leave_requests FOR SELECT 
USING (auth.uid() = user_id);

-- 7. Policy: Users can create their own requests
CREATE POLICY "Users can create own requests" 
ON leave_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 8. Policy: Users can update their own pending requests
CREATE POLICY "Users can update own pending requests" 
ON leave_requests FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- 9. Policy: Admins can manage all requests
CREATE POLICY "Admins can manage all requests" 
ON leave_requests FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');
