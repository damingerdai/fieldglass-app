# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project. Route code lives under `app/`, with route groups such as `app/(auth)/` and `app/(protected)/`. Shared UI and feature logic is split across `components/`, `hooks/`, `lib/`, `utils/`, and `types/`. Static assets live in `public/`. Database-related notes and helpers are under `db/`, and email templates or flows live in `email/`. Keep new code close to the feature it supports, and prefer the `@/*` import alias from `tsconfig.json` for internal paths.

## Build, Test, and Development Commands

Use the package scripts from `package.json`:

- `bun run dev` or `npm run dev`: start the local dev server with Turbopack.
- `bun run build` or `npm run build`: create a production build.
- `bun run start` or `npm run start`: run the built app locally.
- `bun run lint` or `npm run lint`: run Next.js lint checks.
- `bun run type-check` or `npm run type-check`: run TypeScript without emitting files.
- `bun run prettier` / `bun run prettier:fix`: check or rewrite formatting.

## Coding Style & Naming Conventions

Formatting is controlled by Prettier: 2-space indentation, single quotes, semicolons, no trailing commas, and LF line endings. TypeScript is strict, so prefer explicit types when inference is unclear. Follow existing React and Next.js naming patterns: `PascalCase` for components, `camelCase` for functions and variables, and route folders that match URL intent. Keep route files named `page.tsx`, `layout.tsx`, `loading.tsx`, and `route.ts` as Next.js expects.

## Testing Guidelines

There is no dedicated test framework configured yet. Before opening a PR, at minimum run `bun run type-check`, `bun run lint`, and `bun run prettier`. If you add tests, colocate them with the feature or use a clear `tests/` directory, and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

Git history uses Conventional Commits, such as `feat: ...`, `fix: ...`, and `chore(deps): ...`. Keep commit subjects short and scoped. For pull requests, include a concise summary, linked issue or ticket if available, and screenshots for UI changes. Call out any schema, environment, or migration impact explicitly.

## Security & Configuration Tips

Do not commit secrets or local environment values. Review changes under `db/`, `email/`, and `scripts/` carefully, since they often touch runtime configuration or external services.
