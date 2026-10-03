# Git Token Donation

[![CI](https://github.com/gittrends-app/github-token-donation/actions/workflows/ci.yml/badge.svg)](https://github.com/gittrends-app/github-token-donation/actions/workflows/ci.yml)

A small [Next.js](https://nextjs.org/) app for collecting GitHub OAuth access tokens donated by people who want to support
research projects that mine GitHub data. Donors authorize a GitHub OAuth App; the resulting token is stored in SQLite and
listed in a password-protected admin area.

## How it works

1. The donor clicks **Donate** and is sent to `/api/github/authorize`, which redirects to GitHub with the scopes from
   `GH_SCOPES` and a random `state` (CSRF protection).
2. GitHub redirects back to `/api/github`, which exchanges the code for a token, validates it against the GitHub API
   (also recording the granted scopes), stores it and optionally emails the admins.
3. Admins sign in at `/login` and manage tokens at `/admin` (search, copy one or all tokens).

Donors can revoke access at any time in their GitHub settings; the home page links there directly.

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and Yarn 1. Docker is optional (Mailpit, to see emails locally).

```bash
cp .env.example .env.local   # fill in the values
docker compose up -d         # optional: Mailpit on :1025 (UI on :8025)
yarn install
yarn dev
```

Then open <http://localhost:3000>.

### GitHub OAuth App

Create an OAuth App at <https://github.com/settings/developers> and set the **Authorization callback URL** to
`<NEXTAUTH_URL>/api/github` (e.g. `http://localhost:3000/api/github`). Copy its client id and secret to `GH_CLIENT_ID` and
`GH_CLIENT_SECRET`.

### Database

Tokens are stored with Node's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (no extra
dependency) in the file set by `DB_PATH` (default `data/tokens.db`), created on first use. The app needs a persistent,
writable disk and a single instance, so it does not fit serverless hosts. The file holds every token in plain text:
keep it out of the repository and `public/`, restrict its permissions and back it up regularly, e.g.
`sqlite3 data/tokens.db ".backup backup.db"`.

### Environment variables

See [`.env.example`](.env.example). All variables are read at runtime on the server, so changing them only needs a
restart.

### Languages

The UI is available in English and Brazilian Portuguese. The language comes from the `locale` cookie set by the EN/PT
switcher in the sidebar, falling back to the browser's `Accept-Language` and then English. Texts live in
[`lib/i18n/dictionaries/`](lib/i18n/dictionaries): `en.ts` is the reference and `pt-BR.ts` must provide every key (the
typecheck fails otherwise). Admin notification emails use `ADMIN_LOCALE` (default `pt-BR`).

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
