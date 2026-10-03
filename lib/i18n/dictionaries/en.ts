export const en = {
  app: {
    name: "GitHub Token Donation",
    description:
      "We make thousands of GitHub API requests to keep our research datasets up to date. Every donated token helps us collect data faster.",
  },
  nav: {
    home: "Home",
    admin: "Admin",
    logout: "Logout",
    openMenu: "Open menu",
    language: "Language",
  },
  home: {
    title: "Donate a GitHub access token",
    donate: "Donate with GitHub",
    accessTitle: "What we will be able to access",
    revokeNote:
      "Tokens are only used for research data collection and are never shared. You can revoke access at any time in your",
    revokeLink: "GitHub settings",
    imageAlt: "Scientist Octocat",
  },
  scopes: {
    public_repo: "Access public repositories (we only read data, never push code)",
    repo: "Access public and private repositories",
    "read:org": "Read organization membership and teams",
    "read:user": "Read your public profile information",
    "user:email": "Read your email addresses",
  },
  alerts: {
    thanksTitle: (name: string) => `Thank you, ${name}!`,
    thanksMessage: "You have successfully donated a token.",
    errorTitle: "Error",
    errors: {
      github: "Error trying to reach GitHub. Please try again.",
      database: "We could not save your token. Please try again later.",
      state: "The authorization request expired or is invalid. Please try again.",
      unexpected: "Something unexpected happened, try again later.",
    },
  },
  login: {
    title: "Admin",
    user: "User",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Login",
    invalid: "Invalid username or password",
  },
  admin: {
    title: "Donated tokens",
    received: (count: number) => `${count} token${count === 1 ? "" : "s"} received`,
    loading: "Loading…",
    copyAll: "Copy all",
    copiedAll: (count: number) => `${count} token${count === 1 ? "" : "s"} copied`,
    copied: "Token copied",
    refresh: "Refresh",
    loadError: (message: string) => `Could not load the tokens: ${message}`,
    search: "Search by login, name or id",
    columns: { user: "User", scopes: "Scopes", donatedAt: "Donated at", token: "Token" },
    noResults: "No results for this search",
    empty: "No tokens donated yet",
    show: "Show",
    hide: "Hide",
    copy: "Copy",
  },
  email: {
    subject: (login: string) => `New token donated by ${login}`,
    heading: (id: string, login: string, name: string) =>
      `New token received from: ${id} - ${login} (${name})`,
    scopes: "Scopes",
  },
};

export type Dictionary = typeof en;
