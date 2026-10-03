import { SMTPClient } from "emailjs";
import { type NextRequest, NextResponse } from "next/server";
import { getGithubProfile } from "@/helpers/github";
import { DONATION_COOKIE, type DonationCookie, OAUTH_STATE_COOKIE } from "@/lib/cookies";
import { saveToken } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { GitHubToken, GitHubUser } from "@/lib/types";

export async function GET(req: NextRequest) {
  const home = new URL("/", process.env.NEXTAUTH_URL || req.nextUrl.origin);
  const fail = (error: string) => {
    home.searchParams.set("error", error);
    const response = NextResponse.redirect(home);
    response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: "/api/github" });
    return response;
  };

  const code = req.nextUrl.searchParams.get("code");
  let token = req.nextUrl.searchParams.get("token");

  if (code) {
    const state = req.nextUrl.searchParams.get("state");
    if (!state || state !== req.cookies.get(OAUTH_STATE_COOKIE)?.value) return fail("state");

    try {
      const authResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          client_id: process.env.GH_CLIENT_ID as string,
          client_secret: process.env.GH_CLIENT_SECRET as string,
          code,
        }),
      });
      const authData = await authResponse.json();
      token = authData?.access_token || null;
    } catch {
      return fail("github");
    }
  }

  if (!token) return fail("github");

  let donation: GitHubToken;
  try {
    const { user, scopes } = await getGithubProfile(token);
    donation = {
      user: Object.fromEntries(
        Object.entries(user).filter(([key]) => !key.endsWith("_url")),
      ) as GitHubUser,
      access_token: token,
      scopes,
      donated_at: new Date(),
    };
  } catch {
    return fail("github");
  }

  try {
    saveToken(donation);
  } catch {
    return fail("database");
  }

  if (process.env.SMTP === "true") await sendEmail(donation);

  const response = NextResponse.redirect(home);
  response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: "/api/github" });
  response.cookies.delete("access_token"); // legacy cookie that exposed the token to the browser
  response.cookies.set(
    DONATION_COOKIE,
    JSON.stringify({
      login: donation.user.login,
      name: donation.user.name,
      version: process.env.APP_VERSION,
    } satisfies DonationCookie),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    },
  );
  return response;
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

async function sendEmail(donation: GitHubToken) {
  try {
    const client = new SMTPClient({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 1025),
      ssl: process.env.SMTP_AUTH === "true",
      user: process.env.SMTP_USER || undefined,
      password: process.env.SMTP_PASSWORD || undefined,
    });

    // Emails go to the admins, so they use ADMIN_LOCALE instead of the donor's language
    const adminLocale = process.env.ADMIN_LOCALE;
    const t = getDictionary(isLocale(adminLocale) ? adminLocale : "pt-BR").email;
    const { user } = donation;
    const scopes = (donation.scopes || []).join(", ") || "-";

    await client.sendAsync({
      from: `Git Token Donation <${process.env.SMTP_USER || "no-reply@gittrends.local"}>`,
      to: [`${process.env.ADMIN_EMAIL_SECRET}`],
      subject: `[${process.env.NODE_ENV || "development"}] ${t.subject(user.login)}`,
      text: `${t.heading(String(user.id), user.login, user.name ?? "")}\n${t.scopes}: ${scopes}`,
      attachment: [
        {
          data:
            `<div><h1>${t.heading(escapeHtml(user.id), escapeHtml(user.login), escapeHtml(user.name))}</h1>` +
            `<p>${t.scopes}: ${escapeHtml(scopes)}</p>` +
            `<code>${escapeHtml(donation.access_token)}</code></div>`,
          alternative: true,
        },
      ],
    });
  } catch {
    // Email notifications are best-effort; the donation is already stored
  }
}
