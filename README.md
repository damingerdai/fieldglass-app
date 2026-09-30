# Fieldglass

同一仓库维护 Next.js 网站和 Flutter iOS/Android 客户端，共用 Supabase 后端。

## Repository layout

```text
app/, components/, ...  # Next.js Web（仓库根目录）
apps/mobile/           # Flutter iOS / Android
db/                   # 共用数据库 migrations
```

Web 保留根目录结构及现有 Vercel 配置。Flutter 使用自己的 `pubspec.yaml` 和
`pubspec.lock` 管理依赖，通过根目录 scripts 统一启动；无需为 Dart 引入 Bun
workspace、Turborepo 或 Melos。Biome 和 TypeScript 排除 Flutter 目录，移动端使用
Dart formatter、Flutter analyzer 和 Flutter tests。

### Mobile quick start

```bash
bun run mobile:setup
cp apps/mobile/.env.example apps/mobile/.env
# 填入 Supabase URL 和公开 key 后启动
bun run mobile:dev
```

连接真实账号、平台环境和构建步骤见 [移动端说明](apps/mobile/README.md)。


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA updates

Run `bun run build` or `npm run build` to generate `public/sw.js` from the
tracked template `pwa/sw.js` before Next.js builds. The version uses
`VERCEL_GIT_COMMIT_SHA` when available, then `GITHUB_SHA`, falling back to a fresh
UUID when neither variable has a value. Rebuilding the same commit with the same
worker template keeps the worker unchanged, including when only environment
variables change. No manual version bump is needed.
Edit worker logic in `pwa/sw.js`; the generated
`public/sw.js` is ignored by Git. Use the package build script, not `next build`
directly. `vercel.json` sets `bun run build` as the Vercel build command.
The worker URL stays `/sw.js`. PWA registration only runs in production.

The app checks for updates on startup, when returning to the foreground, when
connectivity returns, and hourly while visible. An installed update shows an
“Update now” / “Later” toast. Save any unfinished forms before updating.
“Later” dismisses the prompt until the next check. Only the tab that accepts
the update reloads automatically; other open tabs get a refresh prompt.
With all old tabs closed, the waiting worker can activate normally.

For the first rollout of this prompt, already-open pages still run the old
registration code. Close all tabs and the installed PWA, then reopen it to
activate the new worker and load the prompt implementation.

To verify locally, use a production build on localhost. Load and reload the
app once so it is controlled, rebuild and restart, then return
to the original tab. Verify “Later” preserves a partially filled form and
“Update now” reloads with the new version. Also check an already-waiting update,
two open tabs, and reconnecting after being offline.

## Code quality

[Biome](https://biomejs.dev/) replaces ESLint and Prettier. Its pinned version and
configuration live in `package.json` and `biome.json`.

- `bun run lint` / `bun run lint:fix`: lint or apply safe lint fixes.
- `bun run format` / `bun run format:fix`: check or write formatting.
- `bun run check` / `bun run check:fix`: run both checks or apply safe fixes.
- `bun run ci`: run read-only Biome checks in CI.
- `bun run type-check`: run TypeScript separately.

Formatting retains the previous two-space indentation, single quotes, semicolons,
LF endings, omitted arrow parentheses where possible, and no trailing commas.
Import organization is disabled to preserve the existing import order.
Tailwind v4 directives are supported.

Biome uses the recommended rules plus the React and Next.js domains. It is not
an exact replacement for every rule in `eslint-config-next`. Existing violations
of additional Biome rules are retained as warnings through file-specific
`overrides`; remove each override as the corresponding issue is addressed.
Other files retain the default rule severity.

Git-ignored outputs, static assets in `public/`, Helm charts, and local agent and
migration tooling are excluded. Markdown, YAML, and SQL are not formatted by this
setup. Use the Biome editor extension for format-on-save support.

No CI workflow is currently checked in. A CI job can run `bun install --frozen-lockfile`,
`bun run type-check`, and `bun run ci`.
