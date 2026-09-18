# button

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/button.tsx`: swapped `Slot` (`radix-ui`) for the real `@base-ui/react/button` `ButtonPrimitive`. `asChild` removed; `render` is now provided by the primitive. Type changed to `ButtonPrimitive.Props & VariantProps`. The cva variants, `data-slot`, `data-variant`, `data-size` are unchanged. Leftover scan clean (`grep -rn "radix" components/ui/button.tsx` → no matches).
- Follow-up (dev console warning on `/leave-requests`): Base UI's `Button` defaults `nativeButton=true` and warns when the rendered DOM element is not a native `<button>` (every `Button render={<Link/>}` renders an `<a>`). The wrapper now auto-detects: `render` with a non-`'button'` element type → `nativeButton={false}`; consumers can still override via an explicit `nativeButton` prop.
- Consumer sweep (see project.md): every `<Button asChild>` call site converted to `render={<Link … />}` / `render={<Button … />}`.

## Left alone

- Nothing.

## Behavior changes

- Base UI Button renders a native `<button>` by default (same as radix). Base UI adds `nativeButton`/`focusableWhenDisabled` options that radix did not expose; unused.
- Disabled state: Base UI sets the `disabled` attribute (radix did too) — no delta.

## Verify by hand

- Click every `Button`-as-link in `app/(protected)/leave-requests`, `leave-entitlements`, `dashboard`, `not-found` pages; confirm navigation works and hover/focus rings render.
- Confirm the avatar/user-nav trigger still opens the dropdown.