-- Migration: Add deleted_at to Leave Requests
-- Description: Adds deleted_at column for soft delete support
-- Date: 2026-01-31

ALTER TABLE leave_requests
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
