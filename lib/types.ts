export interface GitHubUser {
  [key: string]: unknown;
  id: number;
  login: string;
  name: string | null;
  email: string | null;
}

export interface GitHubToken {
  user: GitHubUser;
  access_token: string;
  scopes?: string[];
  donated_at: Date;
}
