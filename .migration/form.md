# form

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/form.tsx` (react-hook-form glue wrapper):
  - `LabelPrimitive` (`@radix-ui/react-label`) import removed; `FormLabel` types against `React.ComponentProps<'label'>` (native `Label` now).
  - `Slot` (`@radix-ui/react-slot`) removed from `FormControl`. Rebuilt with `useRender` + `mergeProps`: it now clones its single child and merges `id`, `aria-describedby`, `aria-invalid`, `className` onto it (preserving the radix Slot behavior), emitting `data-slot="form-control"` via `state`.
  - Leftover scan clean.
- Consumer sweep (see project.md): `FormControl` call sites unchanged in shape (`<FormControl><Input/></FormControl>`); the two date-picker popovers restructured to `<FormControl><PopoverTrigger render={<Button/>}>…</PopoverTrigger></FormControl>` so the form id/aria still land on the trigger button (Base UI `render` keeps the render element's children, so the label text moved onto the button).

## Left alone

- The react-hook-form `Form` (`FormProvider`), `FormField`, `FormItem`, `FormDescription`, `FormMessage` glue is untouched — it was never radix.

## Behavior changes

- `FormControl` renders its child by cloning instead of `Slot`'s single-child merge; behavior is equivalent for the `<FormControl><SingleChild/></FormControl>` pattern used throughout the app.

## Verify by hand

- Submit `/login` and `/register` with an empty required field: the message appears, `aria-invalid` is set, and clicking the label focuses the input.
- Submit each of `/leave-requests/create`, `/leave-entitlements/create`, `/update-password`, `/forgot-password`: validation errors render inline.