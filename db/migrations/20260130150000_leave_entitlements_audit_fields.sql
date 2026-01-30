-- Migration: Add Audit Fields to Leave Entitlements
-- Description: Adds updated_at and deleted_at columns for audit and soft delete support
-- Date: 2026-01-30

ALTER TABLE leave_entitlements 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
