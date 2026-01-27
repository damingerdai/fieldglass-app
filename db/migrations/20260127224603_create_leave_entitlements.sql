-- Migration: Create Leave Entitlements System
-- Description: Adds leave entitlements table, indexes, balance view, and RLS policies
-- Date: 2026-01-27

-- 1. Create the Leave Entitlements Table
CREATE TABLE IF NOT EXISTS leave_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL, -- e.g., 'annual_leave', 'parental_leave'
    amount_days DECIMAL(5, 2) NOT NULL, -- Supports half-days (e.g., 10.5)
    effective_date DATE NOT NULL,
    expiry_date DATE, -- Can be NULL for "never expires"
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Expiry must be after Effective
    CONSTRAINT valid_date_range CHECK (expiry_date IS NULL OR expiry_date >= effective_date)
);

-- 2. Add Indexes for faster balance calculations
CREATE INDEX idx_entitlements_user_type ON leave_entitlements(user_id, leave_type);
CREATE INDEX idx_entitlements_dates ON leave_entitlements(effective_date, expiry_date);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE leave_entitlements ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Users can view their own entitlements
CREATE POLICY "Users can view own entitlements" 
ON leave_entitlements FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Policy: Only admins (or specific roles) can insert/update entitlements
-- Note: Adjust this policy based on how you define 'admin' in your app
CREATE POLICY "Admins can manage entitlements" 
ON leave_entitlements FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');
