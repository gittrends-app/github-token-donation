export const OAUTH_STATE_COOKIE = "gh_oauth_state";
export const DONATION_COOKIE = "donation";

export interface DonationCookie {
  login: string;
  name: string | null;
  version?: string;
}
