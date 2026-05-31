import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

function getClient() {
  return new MongoClient(process.env.DB_URL || "mongodb://localhost:27017");
}

export const revalidate = 0;

export async function GET() {
  const client = getClient();
  try {
    await client.connect();
    const db = client.db("GitTokenDonation");
    const collection = db.collection("tokens");

    var tokens = await collection.find({}).toArray();
    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await client.close();
  }
}
