# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Next.js (App Router) app that collects GitHub OAuth access tokens donated by trusted people for research data
mining. Donors authorize a GitHub OAuth App, the token is validated against the GitHub API and stored in SQLite,
and admins list the tokens behind a credentials login. Treat donated tokens as secrets in every change.

Stack: Next.js 16, React 19, TypeScript, MUI 9 (Emotion), next-auth v4 (credentials + JWT), `node:sqlite`,
emailjs, SWR, Biome.

## Commands

Use **Yarn 1** (`yarn.lock`) on **Node 24** (`.nvmrc`). Never use npm/pnpm or commit another lockfile.

| Task                    | Command                                 |
| ----------------------- | --------------------------------------- |
| Dev server              | `yarn dev`                              |
| Lint + format check     | `yarn lint` (`biome check .`)           |
| Auto-fix + format       | `yarn format` (`biome check --write .`) |
| Typecheck               | `yarn typecheck`                        |
| Production build        | `yarn build`                            |
| Local Mailpit (emails)  | `docker compose up -d`                  |

Before finishing a change, run `yarn lint && yarn typecheck && yarn build` — this mirrors CI
(`.github/workflows/ci.yml`). Running the app needs `NEXTAUTH_SECRET` (any value works locally).

## Layout

```
app/
  page.tsx                  Public donation page (server component)
  login/page.tsx            Admin login (client)
  (admin)/                  Admin area; layout.tsx redirects to /login without a session
  api/github/authorize/     Starts OAuth: sets `state` cookie, redirects to GitHub
  api/github/               OAuth callback: exchange code, validate, store, email, set donation cookie
  api/admin/                Lists tokens (session required)
  api/auth/[...nextauth]/   next-auth handler
auth.ts                     next-auth options (credentials from ADMIN_* env vars)
proxy.ts                    Next 16 "middleware": guards /admin and /api/admin
components/                 SideDrawer (nav), Alerta (status alerts), ThemeRegistry (MUI theme)
context/ClientProvider.tsx  next-auth SessionProvider wrapper
helpers/github.ts           GitHub API calls
lib/                        Shared server/client modules (see below)
```

`lib/` is the home for shared code:

- `lib/messages.ts` — all user-facing texts (`NEXT_PUBLIC_*` with defaults), scopes and error-code mapping.
- `lib/db.ts` — the only module touching the database (Node's built-in `node:sqlite`, file at `DB_PATH`).
  Routes call its functions (`saveToken`, `listTokens`); never open `DatabaseSync` elsewhere.
- `lib/cookies.ts` — cookie names and the donation cookie shape.
- `lib/types.ts` — `GitHubUser`, `GitHubToken`.

## Code conventions

- **Formatting/linting is Biome only** (`biome.json`): 2 spaces, 100 columns, double quotes, trailing commas,
  semicolons, organized imports. Don't add Prettier or ESLint configs or `eslint-disable` comments; use
  `// biome-ignore <rule>: <reason>` only when unavoidable.
- **Imports**: use the `@/` alias for project modules. Use `import type` for type-only imports.
- **MUI**: one default import per component path (`import Box from "@mui/material/Box"`,
  `import GitHubIcon from "@mui/icons-material/GitHub"`). Style with the `sx` prop and theme tokens
  (`primary`, `text.secondary`, …); avoid hard-coded colors outside `ThemeRegistry.tsx` / `SideDrawer.tsx`.
  The theme supports light and dark (`colorSchemes`) — check both when changing UI.
- **Server components by default.** Add `"use client"` only for interactivity (state, effects, SWR,
  next-auth/react). Read cookies and search params on the server (`await cookies()`, `await searchParams`).
- **Route files** (`route.ts[x]`) export only HTTP handlers and Next route config (`dynamic`, …). Put
  shared constants and helpers in `lib/`.
- **Env vars**: server secrets via `process.env.X`; client-visible texts must be `NEXT_PUBLIC_*` referenced
  literally (inlined at build) and go through `lib/messages.ts` with a sensible default. Document new
  variables in `.env.example`.
- **Errors in the donation flow** redirect to `/?error=<code>` (`github`, `database`, `state`, …) and are
  mapped to messages in `lib/messages.ts`; don't return raw JSON to donors.
- **Language**: public pages are driven by `NEXT_PUBLIC_*` texts (English defaults); the admin table UI and
  notification emails are in Portuguese (pt-BR). Keep each area consistent.

## Database

- No ORM or query builder: plain SQL with prepared statements and `?` placeholders — never interpolate values.
- The schema lives in `lib/db.ts` (`CREATE TABLE IF NOT EXISTS … STRICT`). Make schema changes additive and
  idempotent there, since it runs on every start.
- Store dates as ISO-8601 text and lists/objects as JSON text; map rows back to `lib/types.ts` shapes.
- Don't add database dependencies (drivers, knex, ORMs) without discussing it first.
- SQLite requires a persistent disk and a single app instance; don't introduce changes that assume
  serverless or horizontal scaling.

## Security rules (do not regress)

- Donated tokens never reach the donor's browser: no tokens in client-readable cookies, URLs, or logs.
  The only cookie set after donating is the `httpOnly` donation cookie (login/name/version).
- Every admin API must check `getServerSession(authOptions)` itself, in addition to `proxy.ts`.
- Keep the OAuth `state` check in the callback, and validate tokens with GitHub (`response.ok`) before storing.
- Escape any user-provided value inserted into HTML (see `escapeHtml` in `app/api/github/route.tsx`).
- Compare secrets with `timingSafeEqual` (see `auth.ts`).
- The SQLite file (`DB_PATH`, default `data/tokens.db`) contains every token: keep it gitignored, outside
  `public/`, and never serve or log it.

## Dependencies

- `typescript` stays on 6.x: TypeScript 7 has no JS API, which Next.js needs for build-time type checking.
- `next-auth` stays on v4 until v5 is stable; `@types/node` tracks the Node major in `.nvmrc`.
- `@biomejs/biome` is pinned to an exact version.
- Dependabot (`.github/dependabot.yml`) encodes these holds — update it if a constraint changes.

## Git & releases

- Conventional Commits, enforced by commitlint (Husky `commit-msg` hook and the PR workflow). Lowercase type;
  the history writes descriptions in Portuguese, e.g. `fix: corrige nome do parametro (scopes -> scope)`.
- Releases use `yarn np` (bumps `package.json`, creates the `vX.Y.Z` commit and tag; nothing is published).
- The app version is embedded as `APP_VERSION`; bumping it lets previous donors donate again (useful when
  the requested scopes change).
- Agent skills for this repo live in `.agents/skills/` (e.g. `caveman-commit` for commit messages,
  `frontend-design` for UI work).
