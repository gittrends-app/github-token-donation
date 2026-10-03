import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ghClientId, ghScopes } from "@/helpers/github";
import { OAUTH_STATE_COOKIE } from "@/lib/cookies";

// Starts the GitHub OAuth flow with a random `state` to protect the callback against CSRF
export async function GET() {
  const state = randomUUID();

  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: ghClientId,
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
