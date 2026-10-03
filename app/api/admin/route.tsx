import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listTokens } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // The proxy already guards this route; double-check here so it never leaks tokens on misconfiguration
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(listTokens(), { status: 200 });
  } catch {
    return NextResponse.json({ error: "database_unavailable" }, { status: 500 });
  }
}
