// NEXT_PUBLIC_* variables are inlined at build time, so they must be referenced literally.
export const messages = {
  name: process.env.NEXT_PUBLIC_NAME || "Git Token Donation",
  title: process.env.NEXT_PUBLIC_TITLE || "Donate a GitHub access token",
  message:
    process.env.NEXT_PUBLIC_MESSAGE ||
    "We make thousands of GitHub API requests to keep our research datasets up to date. Every donated token helps us collect data faster.",
  donateButton: process.env.NEXT_PUBLIC_DONATE_BUTTON || "Donate with GitHub",
  homeButton: process.env.NEXT_PUBLIC_HOME_BUTTON || "Home",
  adminButton: process.env.NEXT_PUBLIC_ADMIN_BUTTON || "Admin",
  logoutButton: process.env.NEXT_PUBLIC_ADMIN_LOGOUT_BUTTON || "Logout",
  thanksTitle: process.env.NEXT_PUBLIC_THANKS_TITLE || "Thank you",
  thanksMessage: process.env.NEXT_PUBLIC_THANKS_MESSAGE || "You have successfully donated a token.",
  errorTitle: process.env.NEXT_PUBLIC_ERROR_TITLE || "Error",
  dbErrorMessage: process.env.NEXT_PUBLIC_DB_ERROR_MESSAGE || "Error trying to reach the database",
  ghErrorMessage: process.env.NEXT_PUBLIC_GH_ERROR_MESSAGE || "Error trying to reach GitHub",
  unexpectedErrorMessage:
    process.env.NEXT_PUBLIC_UNEXPECTED_ERROR_MESSAGE ||
    "Something unexpected happened, try again later",
};

export const ghClientId = process.env.NEXT_PUBLIC_GH_CLIENT_ID || "";
export const ghScopes = (process.env.NEXT_PUBLIC_GH_SCOPES || "public_repo,read:user")
  .split(",")
  .map((scope) => scope.trim())
  .filter(Boolean);

const scopeDescriptions: Record<string, string> = {
  public_repo: "Access public repositories (we only read data, never push code)",
  repo: "Access public and private repositories",
  "read:org": "Read organization membership and teams",
  "read:user": "Read your public profile information",
  "user:email": "Read your email addresses",
};

export function describeScope(scope: string) {
  return scopeDescriptions[scope] || scope;
}

export function errorMessage(code: string | undefined) {
  switch (code) {
    case undefined:
      return undefined;
    case "github":
      return messages.ghErrorMessage;
    case "database":
      return messages.dbErrorMessage;
    default:
      return messages.unexpectedErrorMessage;
  }
}
