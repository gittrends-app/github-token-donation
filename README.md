# Git Token Donation

[![CI](https://github.com/gittrends-app/github-token-donation/actions/workflows/ci.yml/badge.svg)](https://github.com/gittrends-app/github-token-donation/actions/workflows/ci.yml)

A small [Next.js](https://nextjs.org/) app for collecting GitHub OAuth access tokens donated by people who want to support
research projects that mine GitHub data. Donors authorize a GitHub OAuth App; the resulting token is stored in MongoDB and
listed in a password-protected admin area.

## How it works

1. The donor clicks **Donate** and is sent to `/api/github/authorize`, which redirects to GitHub with the scopes from
   `NEXT_PUBLIC_GH_SCOPES` and a random `state` (CSRF protection).
2. GitHub redirects back to `/api/github`, which exchanges the code for a token, validates it against the GitHub API
   (also recording the granted scopes), stores it and optionally emails the admins.
3. Admins sign in at `/login` and manage tokens at `/admin` (search, copy one or all tokens).

Donors can revoke access at any time in their GitHub settings; the home page links there directly.

## Getting started

Requirements: Node.js 24 (see `.nvmrc`), Yarn 1 and Docker (for local MongoDB and Mailpit).

```bash
cp .env.example .env.local   # fill in the values
docker compose up -d         # MongoDB on :27017, Mailpit on :1025 (UI on :8025)
yarn install
yarn dev
```

Then open <http://localhost:3000>.

### GitHub OAuth App

Create an OAuth App at <https://github.com/settings/developers> and set the **Authorization callback URL** to
`<NEXTAUTH_URL>/api/github` (e.g. `http://localhost:3000/api/github`). Copy its client id and secret to `GH_CLIENT_ID`,
`GH_CLIENT_SECRET` and `NEXT_PUBLIC_GH_CLIENT_ID`.

### Environment variables

See [`.env.example`](.env.example). Every `NEXT_PUBLIC_*` text is optional and falls back to the defaults in
[`lib/messages.ts`](lib/messages.ts). They are inlined at build time, so rebuild after changing them.

## Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `yarn dev`       | Start the development server       |
| `yarn build`     | Production build                   |
| `yarn start`     | Serve the production build         |
| `yarn lint`      | Lint and format check with Biome   |
| `yarn typecheck` | Generate route types and run `tsc` |
| `yarn format`    | Apply Biome formatting and fixes   |
| `yarn np`        | Bump the version, tag and release  |

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint via Husky and
in CI). Bumping the version makes previous donors able to donate again (useful when the requested scopes change).

## Continuous integration

- **CI** (`.github/workflows/ci.yml`): Biome lint/format, typecheck and build on every push and pull request.
- **Commitlint** (`.github/workflows/commitlint.yml`): validates the commit messages of pull requests.
- **Dependabot** (`.github/dependabot.yml`): weekly, grouped updates for npm packages and GitHub Actions.

## License

[MIT](LICENSE)
