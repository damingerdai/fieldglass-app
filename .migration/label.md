# label

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/label.tsx`: `@radix-ui/react-label` `LabelPrimitive.Root` replaced with a native `<label>` (`React.ComponentProps<'label'>`). Radix Label has no Base UI counterpart; the shadcn base registry also uses a native `<label>`. `data-slot` and class string unchanged. Leftover scan clean.
- `components/ui/form.tsx`: `FormLabel` prop type changed from `React.ComponentProps<typeof LabelPrimitive.Root>` to `React.ComponentProps<'label'>`; still passes `htmlFor`.

## Left alone

- Radix-only behavior (preventing text selection on double click) was already handled by the existing `select-none` class on the wrapper — no CSS change needed.

## Behavior changes

- None. Native `<label>` behaves identically for `htmlFor` association.

## Verify by hand

- Click a `FormLabel` on `/login`, `/register`, `/leave-requests/create`, `/leave-entitlements/create` — focus must move to the corresponding control.
- Double-click the label text — no text selection should occur.