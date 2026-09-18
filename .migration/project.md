# project

2026-09-18, whole-project migration, legacy `new-york` style → Base UI (transformation engine; no base golden pair for new-york). All 16 radix-touching wrappers migrated; radix deps removed; build green.

## Dependency swap

- Added `@base-ui/react@1.8.0` (kept alongside radix during migration, per plan).
- Removed: `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `radix-ui` (unified).
- `components.json` style flipped `new-york` → `base-nova` (per user request). `bun x shadcn@latest info` now reports `style: base-nova`, `base: base`. Future `shadcn add` will deliver base-nova variants.
- Leftover scan: `grep -rn "radix" app components hooks lib db email types utils` → 0 matches. **0 wrappers remain on Radix.**

## App-code sweep (consumer-props.md)

- `asChild` → `render` across: `components/aside.tsx`, `components/mobile-aside.tsx`, `components/user-nav.tsx`, `components/app-breadcrumb.tsx`, `components/leave-requests/*`, `components/leave-entitlements/*`, `app/(protected)/not-found.tsx`, `app/(protected)/dashboard/page.tsx`, `app/(protected)/leave-requests/**`, `app/(protected)/leave-entitlements/**`.
- `forceMount` on `DropdownMenuContent` (user-nav) removed — Base UI keeps popups mounted through exit animations natively.
- `components/app-sidebar-button.tsx` and `components/app-sinner.tsx` (direct `@radix-ui/react-slot` users) converted to `useRender` + `mergeProps`.
- Date-picker popovers restructured to `<FormControl><PopoverTrigger render={<Button/>}>…</PopoverTrigger></FormControl>` to keep form id/aria on the trigger button and preserve the anchor ref (Base UI `render` keeps the render element's own children).

## Intentionally untouched (non-radix, per hard rule)

- `calendar.tsx` (react-day-picker), `sonner.tsx` (sonner), `input.tsx`, `textarea.tsx`, `card.tsx`, `skeleton.tsx`, `spinner.tsx`.

## Flagged behavior deltas (not silently patched)

- `select.tsx`: default position flips `popper` → `alignItemWithTrigger` (item-aligned, Base UI registry default). Pass `alignItemWithTrigger={false}` to restore popper.
- `alert-dialog.tsx`: Base UI focuses the first tabbable element on open (radix focused Cancel). Use `initialFocus` to restore.
- `tooltip.tsx`: default delay 700ms → 600ms (app passes `delay={0}` via provider in practice).
- `dropdown-menu.tsx`: Base UI `CheckboxItem`/`RadioItem` default `closeOnClick={false}`; keyboard `loop` defaults on. No current call sites affected.
- `popover.tsx`: `PopoverAnchor` kept as inert passthrough (no Base UI equivalent).

## Pre-existing failures (NOT caused by this migration)

- `bun run lint` (`next lint`) — invalid in Next 16 (`next lint` removed from CLI).
- Direct `eslint` — `typescript-eslint does not support TS 7.0` (project pins typescript ^7.0.0).
- `bun run prettier` — flags pre-existing files not touched here (`app/(protected)/settings/page.tsx` (untracked, created outside this session), `components/login-form/form.tsx`, `components/register-form/form.tsx`, `next.config.ts`, `types/*.ts`, `CLAUDE.md`, `.agents/skills/*`). All files changed by this migration pass `prettier --check`.

## Final build

- `bun run type-check` ✓ · `bun run build` ✓ (18 routes, static + dynamic) · Prettier clean on all touched files. Baseline build (before migration) was also green.
