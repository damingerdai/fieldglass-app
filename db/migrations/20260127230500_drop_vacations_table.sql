-- Migration: Drop Vacations Table
-- Description: Removes the old vacations table as part of migration to leave_entitlements system
-- Date: 2026-01-27

-- Drop the vacations table
-- All existing vacation data will be deleted
DROP TABLE IF EXISTS vacations CASCADE;
