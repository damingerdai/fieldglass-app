# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project. Route code lives under `app/`, with route groups such as `app/(auth)/` and `app/(protected)/`. Shared UI and feature logic is split across `components/`, `hooks/`, `lib/`, `utils/`, and `types/`. Static assets live in `public/`. Database-related notes and helpers are under `db/`, and email templates or flows live in `email/`. Keep new code close to the feature it supports, and prefer the `@/*` import alias from `tsconfig.json` for internal paths.

## Architecture

A Next.js 16 App Router leave-management app backed by Supabase (auth + Postgres) and deployed on Vercel.

**Auth**: Supabase Auth with cookie-based sessions. `proxy.ts` (not `middleware.ts`) calls `updateSession` to refresh tokens on every request. The matcher skips `/register`, `/forgot-password`, `/update-password`, and `/api/cron`. Unauthenticated users are redirected to `/login`.

**Route structure**: Two route groups — `(auth)/` for public auth pages and `(protected)/` for guarded pages (dashboard, leave-entitlements, leave-requests, premium-upgrade).

**Data layer**: All mutations go through Next.js Server Actions (`'use server'` files in `components/<feature>/actions.ts`). Always call `revalidatePath` after writes. Supabase clients are created per-context: `utils/supabase/client.ts` (browser), `utils/supabase/server.ts` (Server Components/Actions), `utils/supabase/middleware.ts` (middleware only).

**Database**: Migrations live in `db/migrations/`. Key tables are `leave_entitlements` (soft-deleted via `deleted_at`) and `leave_requests` (cancelled by status update). The `user_leave_balances` view computes granted/used/remaining in real time. Row-Level Security enforces per-user access — all queries run as the authenticated user, not the service role.

**Cron**: `/api/cron` (secured by `CRON_SECRET` header) calls Supabase RPC `handle_auto_approve` daily at midnight. A Helm chart in `charts/fieldglass-cron/` provides a Kubernetes alternative.

**Email**: Transactional email with `react-email` + Resend. Templates in `email/`. Supabase auth emails use Go template syntax (`{{ .ConfirmationURL }}`).

## Build, Test, and Development Commands

Use the package scripts from `package.json`:

- `bun run dev` or `npm run dev`: start the local dev server with Turbopack.
- `bun run build` or `npm run build`: create a production build.
- `bun run start` or `npm run start`: run the built app locally.
- `bun run lint` or `npm run lint`: run Biome lint checks.
- `bun run type-check` or `npm run type-check`: run TypeScript without emitting files.
- `bun run format` / `bun run format:fix`: check or rewrite formatting.

## Coding Style & Naming Conventions

Formatting is controlled by Biome: 2-space indentation, single quotes, semicolons, no trailing commas, and LF line endings. TypeScript is strict, so prefer explicit types when inference is unclear. Follow existing React and Next.js naming patterns: `PascalCase` for components, `camelCase` for functions and variables, and route folders that match URL intent. Keep route files named `page.tsx`, `layout.tsx`, `loading.tsx`, and `route.ts` as Next.js expects.

## Key Conventions

- **Forms**: `react-hook-form` + `zod` v4 + `@hookform/resolvers`. Schemas co-located with their feature components.
- **UI components**: shadcn/ui (New York style, `cssVariables: true`, `lucide-react` icons). Add new components with `bunx shadcn@latest add <component>`.
- **Tailwind v4**: No `tailwind.config.ts`. Design tokens and theme overrides go in `app/globals.css`.
- **Leave types**: `annual`, `sick`, `unpaid` — defined in `types/leave-type.ts` and `components/leave-requests/schema.ts`.

## Testing Guidelines

There is no dedicated test framework configured yet. Before opening a PR, at minimum run `bun run type-check`, `bun run lint`, and `bun run format`. If you add tests, use `bun test` (Jest-compatible); run a single file with `bun test path/to/file.test.ts`. Colocate tests with the feature or use a clear `tests/` directory, and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

Git history uses Conventional Commits, such as `feat: ...`, `fix: ...`, and `chore(deps): ...`. Keep commit subjects short and scoped. For pull requests, include a concise summary, linked issue or ticket if available, and screenshots for UI changes. Call out any schema, environment, or migration impact explicitly.

## Security & Configuration Tips

Do not commit secrets or local environment values. Review changes under `db/`, `email/`, and `scripts/` carefully, since they often touch runtime configuration or external services.

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — used only in trusted server contexts
- `CRON_SECRET` — Bearer token checked by `/api/cron`
- `NEXT_PUBLIC_SITE_URL` — base URL for redirects and email links
- Resend API key for transactional email
