# dropdown-menu

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/dropdown-menu.tsx`: `@radix-ui/react-dropdown-menu` → `Menu as MenuPrimitive` from `@base-ui/react/menu` (radix DropdownMenu → Base UI Menu, renamed primitive).
  - `Content` → `Portal > Positioner > Popup`; `side`/`sideOffset`/`align`/`alignOffset` moved to `Positioner` (destructured + forwarded). Positioner `className="isolate z-50 outline-none"`, Popup keeps `data-slot` + `outline-none`. `max-h-(--available-height)` / `origin-(--transform-origin)` replace the radix vars.
  - Animations → `data-open:animate-in … / data-closed:animate-out …`.
  - `Label` → `MenuPrimitive.GroupLabel`; `ItemIndicator` → `MenuPrimitive.CheckboxItemIndicator` / `MenuPrimitive.RadioItemIndicator`.
  - `Sub` → `MenuPrimitive.SubmenuRoot`; `SubTrigger` → `MenuPrimitive.SubmenuTrigger`; open styling `data-[state=open]:bg-accent …` → `data-popup-open:bg-accent data-popup-open:text-accent-foreground`.
  - `SubContent` composes the public `DropdownMenuContent` with submenu defaults `align="start" alignOffset={-3} side="right" sideOffset={0}` (load-bearing for parent-menu alignment).
- `components/user-nav.tsx`: `<DropdownMenuTrigger asChild><button/></DropdownMenuTrigger>` → `render`; **`forceMount` removed** from `DropdownMenuContent` (no Base UI equivalent; Base UI keeps the popup mounted through exit animations natively).
- Leftover scan clean.

## Left alone

- Nothing.

## Behavior changes

- **Menu items now close on click by default** — same as radix for `Item`/`SubTrigger`. Base UI's `CheckboxItem`/`RadioItem` default `closeOnClick={false}` (radix closed by default); the app uses only plain `Item`s and `Label`/`Separator`, so no behavior change in practice. If checkbox/radio items are added later, add `closeOnClick` explicitly.
- Keyboard `loop` default flips to on (Base UI) — radix default was off. Not configured by the app.
- `onOpenChange`/`onSelect` → `onClick` semantics: the app's items use `onClick` already; radix `onSelect` is not used.

## Verify by hand

- Header avatar → dropdown opens below-right; Settings navigates; Log out signs out.
- Keyboard: Tab to trigger, Enter opens, arrow keys move highlight, Esc closes, focus returns to trigger.