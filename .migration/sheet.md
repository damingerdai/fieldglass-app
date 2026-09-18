# sheet

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/sheet.tsx`: `Dialog as SheetPrimitive` from `radix-ui` → `Dialog as SheetPrimitive` from `@base-ui/react/dialog`.
  - `Overlay` → `Backdrop`; `Content` → `Popup` (centered/sliding modal, no `Positioner`).
  - Slide animations rewritten from `data-[state=open]:animate-in … slide-in-from-*` / `data-[state=closed]:animate-out … slide-out-to-*` to transition-based `data-starting-style:opacity-0 data-ending-style:opacity-0` plus per-side `data-[side=…]:data-starting-style:translate-x-full` / `translate-y-full` (Base UI keeps the popup mounted and drives enter/exit with these hooks). Backdrop gets `transition-opacity duration-300`.
  - `data-side={side}` added to the Popup so the per-side classes bind.
  - Dropped the stale `data-[state=open]:bg-secondary` on the close button (nothing emits `data-state` there anymore).
  - Leftover scan clean.
- `components/mobile-aside.tsx`: `<SheetTrigger asChild><button/></SheetTrigger>` → `render`.
- `components/leave-entitlements/edit-amount-sheet.tsx`: `<SheetTrigger asChild><Button/></SheetTrigger>` → `render`.

## Left alone

- Nothing.

## Behavior changes

- Enter/exit animation now uses CSS transitions (`data-starting-style`/`data-ending-style`) instead of keyframe `animate-in/out`; slide distance is 100% of the sheet edge (was 100% slide in radix too). Duration `300ms` (radix used 500/300 in/out).
- `onOpenChange` gained a second `eventDetails` argument; `edit-amount-sheet` uses `onOpenChange={onOpen}` (single-arg) — type-safe.

## Verify by hand

- Open the mobile menu (hamburger) and the "Edit Amount" sheet: backdrop fades in, panel slides from the correct edge, close button (X) closes, Esc and backdrop click close, focus returns to the trigger.