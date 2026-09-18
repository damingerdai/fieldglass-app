# tooltip

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/tooltip.tsx`: `@radix-ui/react-tooltip` → `Tooltip as TooltipPrimitive` from `@base-ui/react/tooltip`. Content restructured `Portal > Positioner > Popup > Arrow`; positioning props (`side`/`sideOffset`/`align`/`alignOffset`) moved to `Positioner` (picked from `TooltipPrimitive.Positioner.Props` and forwarded — declare/destructure/forward all four). Popup keeps `data-slot="tooltip-content"` and the class list.
- `delayDuration` → `delay` on `TooltipProvider` (wrapper default `0` preserved).
- Animation classes rewritten from `data-[state=open]:animate-in …` to `data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out …` (matching the base-nova registry idiom; `tw-animate-css` already present).
- Radix `origin-(--radix-tooltip-content-transform-origin)` → `origin-(--transform-origin)`.
- Arrow rewritten to the base registry shape (per-side `data-[side=…]` offsets + no rotation dependency); keeps `bg-foreground fill-foreground size-2.5 rounded-[2px]`.
- `sideOffset` default `0` → `4` (registry idiom).
- Leftover scan clean.
- `components/ui/sidebar.tsx`: `TooltipProvider delayDuration={0}` → `delay={0}`.

## Left alone

- No app-code tooltip usage with `delayDuration`/`skipDelayDuration`/`disableHoverableContent` (verified by grep).

## Behavior changes

- Default open delay: radix `700ms` → Base UI `600ms` default. The app passes `delay={0}` through `TooltipProvider` (sidebar) so in practice tooltips are instant there.
- Radix `skipDelayDuration` concept is gone; Base UI `timeout` on Provider (default 400) replaces it. Not used here.

## Verify by hand

- Hover the header user avatar and sidebar collapsed menu buttons: tooltip appears immediately (delay 0), arrow points at the trigger, no layout shift.
- Hover a tooltip, move the pointer across the gap: the popup must stay open (hoverable popup default).
