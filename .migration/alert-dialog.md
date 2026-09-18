# alert-dialog

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/alert-dialog.tsx`: `AlertDialog as AlertDialogPrimitive` from `radix-ui` → `@base-ui/react/alert-dialog`.
  - `Overlay` → `Backdrop`; `Content` → `Popup` (centered modal, no `Positioner`).
  - Animations → `data-open:animate-in … / data-closed:animate-out …` (registry idiom, kept `fade-in/zoom-in` feel).
  - `Cancel` → `AlertDialogPrimitive.Close`; `Action` has **no Base UI primitive** — now a plain styled `Button` with `data-slot="alert-dialog-action"`.
  - Leftover scan clean.
- `components/leave-requests/cancel-request-button.tsx` and `components/leave-entitlements/delete-leave-entitlements-button.tsx`: `<AlertDialogTrigger asChild><Button>…</Button></AlertDialogTrigger>` → `render`.

## Left alone

- `AlertDialogAction` consumers (inside the two confirm dialogs) pass `onClick` handlers for the destructive action — they now run on a plain button that does not auto-close; the dialogs close via the existing controlled state/cancel button.

## Behavior changes

- **Radix focused the `Cancel` button on open; Base UI focuses the first tabbable element.** FLAGGED. Both dialogs render header/title text before buttons; if the first tabbable element is the destructive Action, focus lands there instead of Cancel. To preserve Radix behavior pass `initialFocus={cancelRef}` on `AlertDialogContent`.
- Outside-press dismissal: Base UI AlertDialog never closes on outside press by design (radix had the same modal-only behavior) — no change.

## Verify by hand

- Click "Cancel request" and "Delete" buttons: dialog opens centered, backdrop darkens, title/description read correctly.
- Focus lands on the first button on open; Tab order wraps; Enter triggers the focused action; Esc closes; focus returns to the trigger.
