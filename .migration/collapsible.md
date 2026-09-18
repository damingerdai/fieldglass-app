# collapsible

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/collapsible.tsx`: `@radix-ui/react-collapsible` → `Collapsible as CollapsiblePrimitive` from `@base-ui/react/collapsible`. `Content` part → `Panel` (`CollapsiblePrimitive.Panel`); public export name `CollapsibleContent` kept. `data-slot` names unchanged. Leftover scan clean.

## Left alone

- No consumers found in app code (grep over `app/` + `components/`); kept exported for library parity.

## Behavior changes

- Panel state is now `data-open` / `data-closed` (was `data-[state=open|closed]`); wrapper has no class hooks on the panel so nothing to rewire.

## Verify by hand

- N/A (no in-app usage). If used later, trigger should toggle the panel with `data-panel-open` on the trigger.