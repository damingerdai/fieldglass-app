# popover

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/popover.tsx`: `@radix-ui/react-popover` → `Popover as PopoverPrimitive` from `@base-ui/react/popover`. Content restructured `Portal > Positioner > Popup`; `side`/`sideOffset`/`align`/`alignOffset` moved to `Positioner` (picked + destructured + forwarded — declare/destructure/forward discipline). Positioner gets `className="isolate z-50"` (no `data-slot`, per registry convention). Popup keeps `data-slot="popover-content"`.
- Animation classes → `data-open:animate-in … / data-closed:animate-out …`; `origin-(--radix-popover-content-transform-origin)` → `origin-(--transform-origin)`.
- `PopoverAnchor` has **no Base UI equivalent**; kept as an inert passthrough `<div data-slot="popover-anchor">` so existing imports don't break. FLAGGED: it anchors nothing.
- Leftover scan clean.
- Consumer sweep: two date-picker popovers in `components/leave-requests/create-leave-request-form.tsx` and `components/leave-entitlements/create-leave-entitlements-form.tsx` had `<PopoverTrigger asChild><FormControl><Button>…</Button></FormControl></PopoverTrigger>`. Restructured to `<FormControl><PopoverTrigger render={<Button/>}>…</PopoverTrigger></FormControl>` so the form ids/aria still land on the button and the trigger ref stays attached (Base UI `render` merge keeps the render element's own children, so the trigger label was moved onto the button).

## Left alone

- Nothing.

## Behavior changes

- `onOpenChange` signature gained a second `eventDetails` argument; the app passes single-arg handlers only (e.g. `setOpen`), which stays type-safe.
- Outside-press/escape dismissal now surfaces through `onOpenChange` reasons instead of `onPointerDownOutside`/`onEscapeKeyDown`; unused here.

## Verify by hand

- Open the date picker on `/leave-requests/create` and `/leave-entitlements/create`: popup aligns under the trigger, label click focuses the trigger, click-outside/Esc closes.
- Pick a date — the trigger text updates and the popup closes.
