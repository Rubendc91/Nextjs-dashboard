# Copilot / AI Coding Instructions

Purpose: fast-start guidance for AI coding agents working on this Next.js dashboard.

- **Project type:** Next.js 14 (app directory) + TypeScript, TailwindCSS, server-side SQL via `postgres`.
- **Entrypoints:** UI and pages live under `app/` (uses nested `layout.tsx` and route groups like `(Overview)`).
- **DB access:** direct SQL using the `postgres` package. See `app/lib/actions.ts` and `auth.ts` for examples of tagged-template SQL and `process.env.POSTGRES_URL` usage (SSL `{ ssl: 'require' }`).
- **Auth:** NextAuth credentials provider implemented in `auth.ts` and configured in `auth_config.ts`. `signIn('credentials', formData)` is called from server actions.
- **Path alias:** `@/*` is mapped to project root (see `tsconfig.json`). Use `@/` imports consistently.

Key patterns and conventions
- Use the `app/` folder patterns: nested `layout.tsx` files control shared UI. Route groups (folders in parentheses) are employed (e.g., `dashboard/(Overview)/...`).
- Server actions: add `'use server'` at top of files like `app/lib/actions.ts`. Server actions perform DB writes, call `revalidatePath()` and use `redirect()` for post-action navigation.
- Form validation: `zod` schemas are used server-side (see `app/lib/actions.ts`). When failing, return `{ errors: ..., message: ... }` shapes consumed by UI forms.
- DB operations: raw SQL via template literals (no ORM). Follow existing parameter binding style: `await sql`SELECT ... WHERE id = ${id}``. Keep values typed (e.g., amount stored in cents).
- Authentication flows: credential checks use `bcrypt.compare`. `auth_config.ts` controls redirect/authorization behavior.

Dev workflows & commands
- Start dev server: `pnpm dev` (or `npm run dev`).
- Build: `pnpm build` (or `npm run build`).
- Run the DB seed script: `pnpm run seed` (reads `scripts/seed.js`).
- Formatting/linting: `pnpm run prettier` and `pnpm run lint` are available.

Files to inspect for common changes
- UI components & patterns: `app/ui/` (forms, tables, skeletons).
- Business logic and server actions: `app/lib/actions.ts`, `app/lib/*.ts`.
- Auth: `auth.ts`, `auth_config.ts`, `middleware.ts`.
- Routing and pages: `app/dashboard/`, `app/login/page.tsx`, `app/seed/route.ts`.

Integration notes / gotchas
- Environment: ensure `POSTGRES_URL` is present in environment. The code expects SSL when connecting.
- SQL safety: the code uses the `postgres` template binding; do not inline variables into SQL strings.
- Revalidation: server actions call `revalidatePath('/dashboard/invoices')` after DB writes — keep these when changing cacheable pages.
- Redirects: server actions use `redirect('/dashboard/invoices')` after successful writes; returning from server actions often uses redirects instead of client-side navigation.

When changing behavior
- Update `scripts/seed.js` and run `pnpm run seed` for DB fixtures.
- If altering auth flows, update `auth_config.ts` and `middleware.ts` to keep consistent redirect/authorized behavior.

If unsure, open these files for examples: `app/lib/actions.ts`, `auth.ts`, `auth_config.ts`, `tsconfig.json`, `package.json`.

Questions for the maintainer
- Are there private environment variables beyond `POSTGRES_URL` that should be documented? If yes, please list them here.

— end —
