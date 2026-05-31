import { NextResponse, NextRequest } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from "next/headers";
import { omitBy } from "lodash";
import { SMTPClient } from "emailjs";
import { getGithubProfile } from "@/helpers/github";

export interface GitHubUser {
  [key: string]: any;
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

export interface GitHubToken {
  user: GitHubUser;
  access_token: string;
  donated_at: Date;
}

function getClient() {
  return new MongoClient(process.env.DB_URL || "mongodb://localhost:27017");
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    let token = req.nextUrl.searchParams.get("token");

    if (code) {
      const authResponse = await fetch(
        "https://github.com/login/oauth/access_token?" +
          new URLSearchParams({
            client_id: process.env.GH_CLIENT_ID as string,
            client_secret: process.env.GH_CLIENT_SECRET as string,
            code,
          }).toString(),
        {
          method: "POST",
          headers: { Accept: "application/json" },
        },
      );

      const authData = await authResponse.json();
      token = authData?.access_token || null;

      if (!token) {
        return NextResponse.json(
          { error: "invalid_or_expired_code", details: authData?.error || "missing_access_token" },
          { status: 400 },
        );
      }
    }

    if (!token) {
      return NextResponse.json({ error: "missing_code_or_token" }, { status: 400 });
    }

    const user = await getGithubProfile(token);

    if (user) {
      const donation = {
        user: omitBy(user, (_, key) => key.endsWith("_url")) as GitHubUser,
        access_token: token,
        donated_at: new Date(),
      };
      await setUserDB(donation);
      if (process.env.SMTP) await sendEmail(donation);
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", token);
    cookieStore.set("app_version", process.env.APP_VERSION || "unknown");

    return NextResponse.redirect(process.env.NEXTAUTH_URL as string);
  } catch {
    return NextResponse.json({ error: "github_callback_failed" }, { status: 500 });
  }
}

async function setUserDB(data: GitHubToken) {
  const client = getClient();
  await client.connect();
  const collection = client.db("GitTokenDonation").collection("tokens");
  return collection
    .updateOne({ _id: data.user.id as any }, { $set: data }, { upsert: true })
    .finally(() => client.close());
}

async function sendEmail(user: GitHubToken) {
  const emailDestino = process.env.ADMIN_EMAIL_SECRET + "";
  try {
    const client = new SMTPClient({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 1025),
      ssl: process.env.SMTP_AUTH === "true",
      user: process.env.SMTP_USER || undefined,
      password: process.env.SMTP_PASSWORD || undefined,
    });

    await new Promise<void>((resolve, reject) => {
      client.send(
        {
          from: `Git Token Donation <${process.env.SMTP_USER || "no-reply@gittrends.local"}>`,
          to: [emailDestino],
          subject: `[${process.env.NODE_ENV || "development"}] Novo Token doado`,
          attachment: [
            {
              data:
                "<div><h1>Novo token recebido de: " +
                user.user.id +
                "-" +
                user.user.name +
                "!</h1><br /><code>" +
                user.access_token +
                "</code></div>",
              alternative: true,
            },
          ],
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });

    return;
  } catch {
    return;
  }
}
