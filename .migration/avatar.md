# avatar

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/avatar.tsx`: `@radix-ui/react-avatar` → `Avatar as AvatarPrimitive` from `@base-ui/react/avatar`. Same anatomy (`Root`/`Image`/`Fallback`), types now `AvatarPrimitive.{Root,Image,Fallback}.Props`. `data-slot` and classes unchanged. Leftover scan clean.

## Left alone

- No consumers pass `delayMs` (radix name) or `delay`; the wrapper renders the fallback with default delay.

## Behavior changes

- `Avatar.Fallback.delayMs` → `delay` (renamed) is a wrapper-level prop that was never exercised here.

## Verify by hand

- The user avatar in the header (and mobile menu) must load the image and fall back to initials if the image fails.