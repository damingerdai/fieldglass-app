# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # start dev server with Turbopack
bun run build        # production build
bun run lint         # ESLint via next lint
bun run type-check   # tsc --noEmit
bun run prettier     # check formatting
bun run prettier:fix # auto-fix formatting
```

There is no test suite. If tests are added, use `bun test` (Jest-compatible). A single file: `bun test path/to/file.test.ts`.

## Architecture

A Next.js 16 App Router leave-management app backed by Supabase (auth + Postgres) and deployed on Vercel.

**Auth**: Supabase Auth with cookie-based sessions. `proxy.ts` (not `middleware.ts`) calls `updateSession` to refresh tokens on every request. The matcher skips `/register`, `/forgot-password`, `/update-password`, and `/api/cron`. Unauthenticated users are redirected to `/login`.

**Route structure**: Two route groups — `(auth)/` for public auth pages and `(protected)/` for guarded pages (dashboard, leave-entitlements, leave-requests, premium-upgrade).

**Data layer**: All mutations go through Next.js Server Actions (`'use server'` files in `components/<feature>/actions.ts`). Always call `revalidatePath` after writes. Supabase clients are created per-context: `utils/supabase/client.ts` (browser), `utils/supabase/server.ts` (Server Components/Actions), `utils/supabase/middleware.ts` (middleware only).

**Database**: Migrations live in `db/migrations/`. Key tables are `leave_entitlements` (soft-deleted via `deleted_at`) and `leave_requests` (cancelled by status update). The `user_leave_balances` view computes granted/used/remaining in real time. Row-Level Security enforces per-user access — all queries run as the authenticated user, not the service role.

**Cron**: `/api/cron` (secured by `CRON_SECRET` header) calls Supabase RPC `handle_auto_approve` daily at midnight. A Helm chart in `charts/fieldglass-cron/` provides a Kubernetes alternative.

**Email**: Transactional email with `react-email` + Resend. Templates in `email/`. Supabase auth emails use Go template syntax (`{{ .ConfirmationURL }}`).

## Key conventions

- **Forms**: `react-hook-form` + `zod` v4 + `@hookform/resolvers`. Schemas co-located with their feature components.
- **UI components**: shadcn/ui (New York style, `cssVariables: true`, `lucide-react` icons). Add new components with `bunx shadcn@latest add <component>`.
- **Tailwind v4**: No `tailwind.config.ts`. Design tokens and theme overrides go in `app/globals.css`.
- **Leave types**: `annual`, `sick`, `unpaid` — defined in `types/leave-type.ts` and `components/leave-requests/schema.ts`.
- **Path alias**: `@/*` maps to the project root.
- **Prettier**: single quotes, 2-space indent, semicolons on, no trailing commas, LF line endings.

## Environment variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — used only in trusted server contexts
- `CRON_SECRET` — Bearer token checked by `/api/cron`
- `NEXT_PUBLIC_SITE_URL` — base URL for redirects and email links
- Resend API key for transactional email
