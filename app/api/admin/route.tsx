import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTokensCollection } from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function GET() {
  // The proxy already guards this route; double-check here so it never leaks tokens on misconfiguration
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const collection = await getTokensCollection();
    const tokens = await collection.find({}).sort({ donated_at: -1 }).toArray();
    return NextResponse.json(tokens, { status: 200 });
  } catch {
    return NextResponse.json({ error: "database_unavailable" }, { status: 500 });
  }
}
