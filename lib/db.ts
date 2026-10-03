import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { DonationOutcome, GitHubToken, GitHubUser } from "@/lib/types";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tokens (
    user_id      INTEGER PRIMARY KEY,
    login        TEXT NOT NULL,
    name         TEXT,
    access_token TEXT NOT NULL,
    scopes       TEXT NOT NULL DEFAULT '[]',
    profile      TEXT NOT NULL,
    donated_at   TEXT NOT NULL
  ) STRICT;
  CREATE INDEX IF NOT EXISTS tokens_donated_at ON tokens (donated_at);
`;

interface TokenRow {
  user_id: number;
  access_token: string;
  scopes: string;
  profile: string;
  donated_at: string;
}

const globalForDb = globalThis as unknown as { db?: DatabaseSync };

// Single connection reused across requests (and across hot reloads in dev)
function getDb(): DatabaseSync {
  if (!globalForDb.db) {
    const file = process.env.DB_PATH || "data/tokens.db";
    // The database is runtime data: keep Turbopack from tracing the whole project into the build
    if (file !== ":memory:") {
      mkdirSync(dirname(resolve(/*turbopackIgnore: true*/ file)), { recursive: true });
    }

    const db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    db.exec(SCHEMA);
    globalForDb.db = db;
  }
  return globalForDb.db;
}

// Upserts by GitHub user id: donating again replaces the stored token (e.g. with new scopes)
export function saveToken(token: GitHubToken): DonationOutcome {
  const db = getDb();
  const existed =
    db.prepare("SELECT 1 FROM tokens WHERE user_id = ?").get(token.user.id) !== undefined;

  db.prepare(
    `INSERT INTO tokens (user_id, login, name, access_token, scopes, profile, donated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET
         login = excluded.login,
         name = excluded.name,
         access_token = excluded.access_token,
         scopes = excluded.scopes,
         profile = excluded.profile,
         donated_at = excluded.donated_at`,
  ).run(
    token.user.id,
    token.user.login,
    token.user.name ?? null,
    token.access_token,
    JSON.stringify(token.scopes ?? []),
    JSON.stringify(token.user),
    token.donated_at.toISOString(),
  );

  return existed ? "updated" : "created";
}

export function listTokens(): GitHubToken[] {
  const rows = getDb()
    .prepare(
      "SELECT user_id, access_token, scopes, profile, donated_at FROM tokens ORDER BY donated_at DESC",
    )
    .all() as unknown as TokenRow[];

  return rows.map((row) => ({
    user: { ...(JSON.parse(row.profile) as GitHubUser), id: row.user_id },
    access_token: row.access_token,
    scopes: JSON.parse(row.scopes) as string[],
    donated_at: new Date(row.donated_at),
  }));
}
