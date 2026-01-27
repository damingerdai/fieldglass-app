-- Migration: Create User Leave Balances View
-- Description: Creates a view to calculate real-time leave balances
-- Date: 2026-01-27
-- Dependencies: leave_entitlements, leave_requests tables

-- Create a View to calculate "Real-time Balance"
-- This view sums entitlements and subtracts approved requests
-- SECURITY INVOKER ensures the view respects RLS policies
CREATE OR REPLACE VIEW user_leave_balances
WITH (security_invoker = true) AS
WITH total_entitlements AS (
    SELECT 
        user_id, 
        leave_type, 
        SUM(amount_days) as total_granted
    FROM leave_entitlements
    WHERE CURRENT_DATE >= effective_date 
      AND (expiry_date IS NULL OR CURRENT_DATE <= expiry_date)
    GROUP BY user_id, leave_type
),
total_used AS (
    SELECT 
        user_id, 
        leave_type, 
        SUM(days) as total_consumed
    FROM leave_requests
    WHERE status = 'approved'
    GROUP BY user_id, leave_type
)
SELECT 
    u.id as user_id,
    te.leave_type,
    COALESCE(te.total_granted, 0) as granted,
    COALESCE(tu.total_consumed, 0) as used,
    (COALESCE(te.total_granted, 0) - COALESCE(tu.total_consumed, 0)) as remaining_balance
FROM auth.users u
JOIN total_entitlements te ON u.id = te.user_id
LEFT JOIN total_used tu ON te.user_id = tu.user_id AND te.leave_type = tu.leave_type;
