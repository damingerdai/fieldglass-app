# progress

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/progress.tsx`: `@radix-ui/react-progress` → `Progress as ProgressPrimitive` from `@base-ui/react/progress`. Anatomy restructured to `Root > Track > Indicator` (new `Track` part). The radix manual fill `style={{ transform: translateX(-(100 - value)%) }}` was **deleted** — Base UI's primitive computes the fill width itself. The wrapper's visual classes are preserved (`bg-primary/20 h-2 w-full overflow-hidden rounded-full` on Root, `bg-primary h-full w-full flex-1 transition-all` on Indicator). Leftover scan clean.

## Left alone

- No consumers besides the dashboard card; no prop changes.

## Behavior changes

- The indeterminate (`value={null}`) case previously rendered an empty bar via translateX; Base UI exposes `data-indeterminate` for a shimmer/indeterminate treatment that the wrapper does not style. The dashboard always passes a concrete value, so no visible change.

## Verify by hand

- Open `/dashboard`; the "Available Balance" progress bars must fill to their percentage values and animate on value change.