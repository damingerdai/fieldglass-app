# Database Migrations

This directory contains database migration files for the fieldglass-app.

## Structure

```
db/
├── README.md
└── migrations/
    ├── 20260127224603_create_leave_entitlements.sql
    ├── 20260127224945_create_leave_requests.sql
    └── 20260127225000_create_leave_balances_view.sql
```

## Migrations

### 20260127224603_create_leave_entitlements.sql

Creates the leave entitlements system with:

- **`leave_entitlements` table**: Stores leave allocations for users
  - Supports multiple leave types (annual leave, parental leave, etc.)
  - Tracks effective and expiry dates
  - Supports half-day increments (e.g., 10.5 days)
  
- **Indexes**: Optimized for balance calculations
  - `idx_entitlements_user_type`: Fast lookups by user and leave type
  - `idx_entitlements_dates`: Efficient date range queries

- **Row Level Security (RLS)**:
  - Users can view their own entitlements
  - Only service role can manage entitlements

### 20260127224945_create_leave_requests.sql

Creates the leave requests system with:

- **`leave_requests` table**: Tracks leave applications
  - Supports multiple statuses: pending, approved, rejected, cancelled
  - Tracks approver and approval timestamp
  - Supports half-day requests
  - Auto-updates `updated_at` timestamp via trigger

- **Indexes**: Optimized for queries
  - `idx_leave_requests_user`: Fast user lookups
  - `idx_leave_requests_status`: Filter by status
  - `idx_leave_requests_dates`: Date range queries
  - `idx_leave_requests_user_type`: Combined user and leave type queries

- **Row Level Security (RLS)**:
  - Users can view and create their own requests
  - Users can update their own pending requests
  - Admins can manage all requests

### 20260127225000_create_leave_balances_view.sql

Creates the balance calculation view:

- **`user_leave_balances` view**: Real-time balance calculation
  - Automatically calculates granted, used, and remaining leave
  - Joins entitlements with approved leave requests
  - Respects effective and expiry dates
  - Returns balance per user per leave type

## Usage

Apply migrations in order using your preferred database migration tool (e.g., Supabase CLI, Flyway, or manual execution):

```bash
# Example using psql
psql -d your_database -f db/migrations/20260127224603_create_leave_entitlements.sql
psql -d your_database -f db/migrations/20260127224945_create_leave_requests.sql
psql -d your_database -f db/migrations/20260127225000_create_leave_balances_view.sql
```