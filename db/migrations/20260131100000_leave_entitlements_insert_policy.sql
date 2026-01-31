-- Migration: Allow Users to Manage Own Entitlements
-- Description: Adds INSERT and UPDATE policies for leave_entitlements
-- Date: 2026-01-31

-- Allow users to insert their own entitlements
CREATE POLICY "Users can create own entitlements" 
ON leave_entitlements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own entitlements
CREATE POLICY "Users can update own entitlements" 
ON leave_entitlements FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own entitlements
CREATE POLICY "Users can delete own entitlements" 
ON leave_entitlements FOR DELETE 
USING (auth.uid() = user_id);
