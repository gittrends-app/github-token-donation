import { MongoClient } from "mongodb";
import type { GitHubToken } from "@/lib/types";

const globalForMongo = globalThis as unknown as { mongoClient?: Promise<MongoClient> };

// Reuse a single connection pool across requests (and across hot reloads in dev)
function getClient(): Promise<MongoClient> {
  if (!globalForMongo.mongoClient) {
    const client = new MongoClient(process.env.DB_URL || "mongodb://localhost:27017");
    globalForMongo.mongoClient = client.connect().catch((error) => {
      globalForMongo.mongoClient = undefined;
      throw error;
    });
  }
  return globalForMongo.mongoClient;
}

export async function getTokensCollection() {
  const client = await getClient();
  return client.db("GitTokenDonation").collection<GitHubToken & { _id: number }>("tokens");
}
