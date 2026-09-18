# separator

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/separator.tsx`: `@radix-ui/react-separator` namespace import → `Separator as SeparatorPrimitive` from `@base-ui/react/separator` (callable single part, no `.Root`). `decorative` prop dropped (Base UI separator is always `role="separator"`; the registry drops the prop too). `data-slot`, `orientation` classes (`data-[orientation=…]`) unchanged — Base UI still emits `data-orientation`. Leftover scan clean.
- `components/ui/sidebar.tsx`: `SidebarSeparator` composes the public `Separator` — no prop changes needed.

## Left alone

- No consumer passes `decorative` (verified by grep over `app/` + `components/`).

## Behavior changes

- None for current usage.

## Verify by hand

- Render the sidebar separator and dropdown separators; they must draw a 1px rule and stay out of the accessibility tree.