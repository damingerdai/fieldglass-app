# breadcrumb

2026-09-18, transformation engine (legacy `new-york` style, no base golden), migrated.

## Changed

- `components/ui/breadcrumb.tsx`: `BreadcrumbLink` was the only radix consumer (`Slot` from `@radix-ui/react-slot`). Converted to `useRender` + `mergeProps` per the worked Slot example in the skill reference (`defaultTagName: 'a'`, `state: { slot: 'breadcrumb-link' }`). `asChild` prop → `render`. All other breadcrumb parts are plain DOM and untouched. Leftover scan clean.
- `components/app-breadcrumb.tsx:48`: `<BreadcrumbLink asChild><Link …>{label}</Link></BreadcrumbLink>` → `<BreadcrumbLink render={<Link href={…} />}>{label}</BreadcrumbLink>`.

## Left alone

- Nothing.

## Behavior changes

- None. Same `<a>` output; the link still receives hover styling.

## Verify by hand

- Navigate `/leave-requests`, `/leave-requests/create`, `/leave-entitlements/create`; the breadcrumb home/crumb links must navigate and render on one line.
