# select

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/select.tsx`: `@radix-ui/react-select` → `Select as SelectPrimitive` from `@base-ui/react/select`.
  - Bare re-export `const Select = SelectPrimitive.Root` (root is generic; sidesteps the `ComponentProps` pattern).
  - `Content` → `Portal > Positioner > Popup`; `position` prop replaced by `alignItemWithTrigger` (default `true`) + `side`/`sideOffset`/`align`/`alignOffset` all destructured and forwarded to `Positioner`. Positioner `className="isolate z-50"`.
  - `Viewport` → `List`; `ScrollUpButton`/`ScrollDownButton` → `ScrollUpArrow`/`ScrollDownArrow`; `Label` → `GroupLabel`.
  - `Icon asChild` → `Icon render={<ChevronDownIcon …/>}`; `ItemIndicator` → `render={<span …/>}` with the check as children; `ItemText` moved before `ItemIndicator` (registry anatomy).
  - Vars: `--radix-select-content-available-height` → `--available-height`, `--radix-select-content-transform-origin` → `--transform-origin`, `--radix-select-trigger-width/height` → `--anchor-width/height` (the latter only for the `!alignItemWithTrigger` popper classes).
  - Animations → `data-open:animate-in … / data-closed:animate-out …`.
  - Leftover scan clean.

## Left alone

- Only consumer: `components/leave-requests/create-leave-request-form.tsx` (leave-type selector) — no `position`/`align` props passed.

## Behavior changes

- **Default position flips: `position="popper"` (radix wrapper default) → `alignItemWithTrigger` (Base UI registry default, `true` = item-aligned).** FLAGGED. The leave-type select now opens aligned to the selected item rather than the trigger. To restore the old popper look pass `alignItemWithTrigger={false}` on `SelectContent`.
- `onValueChange(value, eventDetails)` gains a second argument; the form's handler is `field.onChange` (single-arg) and stays type-safe.

## Verify by hand

- Open the leave-type select on `/leave-requests/create`: keyboard typeahead filters, arrow keys move highlight, Enter selects, the trigger label updates, Esc closes and focus returns.
- Confirm the popup aligns to the trigger or selected item as expected; if not, set `alignItemWithTrigger={false}`.