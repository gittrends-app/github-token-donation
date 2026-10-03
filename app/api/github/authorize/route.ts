import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE } from "@/lib/cookies";
import { ghScopes } from "@/lib/messages";

// Starts the GitHub OAuth flow with a random `state` to protect the callback against CSRF
export async function GET() {
  const state = randomUUID();

  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: process.env.GH_CLIENT_ID || process.env.NEXT_PUBLIC_GH_CLIENT_ID || "",
    scope: ghScopes.join(","),
    state,
  }).toString();

  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/github",
    maxAge: 60 * 10,
  });
  return response;
}
