export interface GitHubUser {
  [key: string]: unknown;
  id: number;
  login: string;
  name: string | null;
  email: string | null;
}

// Result of storing a donation: a first donation or a refresh of an existing one
export type DonationOutcome = "created" | "updated";

export function isDonationOutcome(value: unknown): value is DonationOutcome {
  return value === "created" || value === "updated";
}

export interface GitHubToken {
  user: GitHubUser;
  access_token: string;
  scopes?: string[];
  donated_at: Date;
}
