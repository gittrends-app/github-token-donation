import type { GitHubUser } from "@/lib/types";

const GH_BASE_URL = "https://api.github.com/";

// Server-only OAuth settings, read at runtime (no rebuild needed to change them)
export const ghClientId = process.env.GH_CLIENT_ID || "";
export const ghScopes = (process.env.GH_SCOPES || "public_repo,read:user")
  .split(",")
  .map((scope) => scope.trim())
  .filter(Boolean);

export async function getGithubProfile(
  token: string,
): Promise<{ user: GitHubUser; scopes: string[] }> {
  const response = await fetch(`${GH_BASE_URL}user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`GitHub responded with status ${response.status}`);

  const scopes = (response.headers.get("x-oauth-scopes") || "")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

  return { user: await response.json(), scopes };
}
