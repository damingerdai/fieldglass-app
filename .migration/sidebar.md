# sidebar

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/sidebar.tsx`:
  - `Slot` (`@radix-ui/react-slot`) removed. `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuAction`, `SidebarMenuSubButton` and `SidebarMenuButton` converted from the `asChild ? Slot : tag` idiom to `useRender` + `mergeProps`; `data-slot`/`data-sidebar`/`data-size`/`data-active` are emitted via `state` (Base UI converts state keys to `data-*` attributes, booleans to presence attributes).
  - `data-[active=true]:` selectors → `data-active:` and `peer-data-[active=true]/menu-button:` → `peer-data-active/menu-button:` (state now emits a presence attribute, not `="true"`). `data-[state=open]:hover:…` → `data-open:hover:…`.
  - `SidebarMenuButton` tooltip path: `<TooltipTrigger asChild>{button}</TooltipTrigger>` → `render: !tooltip ? render : <TooltipTrigger render={render} />` composed inside `<Tooltip>`.
  - `TooltipProvider delayDuration={0}` → `delay={0}`.
  - Leftover scan clean (the remaining `data-[state=collapsed]` selector refers to the sidebar wrapper's own `data-state` attribute, not radix).
- `components/app-sidebar-button.tsx` (app-local duplicate of `SidebarMenuButton`): same Slot→useRender treatment, `data-[active=true]`→`data-active`, `TooltipTrigger asChild`→`render` path.

## Left alone

- `data-state={state}` on the desktop sidebar wrapper (`'expanded' | 'collapsed'`) is the component's own mechanism, kept as-is.

## Behavior changes

- `asChild` → `render` at call sites (`components/aside.tsx` `SidebarMenuButton asChild` → `render={<Link/>}`).
- Base UI `useRender` emits `data-active` (presence) instead of `data-active="true"` — selectors updated to match.

## Verify by hand

- Collapse/expand the sidebar (Cmd/Ctrl+B): icon rail toggles, active item keeps its purple highlight, menu actions show on hover.
- In collapsed icon mode, hover a menu button: tooltip appears on the right; sub-menu buttons still navigate.
- On mobile widths, the hamburger opens the sheet menu.