# radio-group

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/radio-group.tsx`: radix `@radix-ui/react-radio-group` (single namespace) → Base UI split into `RadioGroup` (`@base-ui/react/radio-group`, callable single part) + `Radio` (`@base-ui/react/radio`, `Radio.Root` + `Radio.Indicator`).
  - `RadioGroupItem` now renders `RadioPrimitive.Root`; `data-slot="radio-group-item"` and visual classes kept.
  - `RadioGroupPrimitive.Indicator` → `RadioPrimitive.Indicator`.
  - `disabled:cursor-not-allowed disabled:opacity-50` → `data-disabled:cursor-not-allowed data-disabled:opacity-50` — Base UI `Radio.Root` renders a `<span>` (plus hidden input), so the `:disabled` pseudo-class is dead and the `data-disabled` presence attribute is used instead.
  - Leftover scan clean.

## Left alone

- No app-code consumers (grep over `app/` + `components/`).

## Behavior changes

- `orientation`/`loop`/`dir` radix props dropped (Base UI handles arrow-key navigation on both axes; no RTL prop).
- Element change button → span means the old `disabled:` Tailwind variants no longer apply; replaced with `data-disabled:`.

## Verify by hand

- N/A (no in-app usage). If used later: arrow keys move between options, Space selects, `data-checked` marks the selected option.