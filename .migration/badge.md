# badge

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/badge.tsx`: `Slot` (`@radix-ui/react-slot`) removed. The `asChild ? Slot : 'span'` idiom became `useRender` + `mergeProps` from `@base-ui/react/use-render` / `@base-ui/react/merge-props` (non-button polymorphic component — the documented replacement). `asChild` prop → `render`. `data-slot`/`data-variant` are now emitted via `state: { slot: 'badge', variant }`. cva variants and all classes unchanged. Leftover scan clean.
- No consumers used `asChild` on `Badge` (verified by grep).

## Left alone

- Nothing.

## Behavior changes

- None: same `<span>` output and attributes as before.

## Verify by hand

- Render status badges on `/leave-requests` and `/dashboard`; colors and shapes must be identical.
