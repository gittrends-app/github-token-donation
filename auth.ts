import { timingSafeEqual } from "node:crypto";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function safeEqual(value: string | undefined, expected: string | undefined) {
  if (!value || !expected) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          safeEqual(credentials?.user, process.env.ADMIN_LOGIN_SECRET) &&
          safeEqual(credentials?.password, process.env.ADMIN_PASSWORD_SECRET)
        ) {
          return {
            id: process.env.ADMIN_LOGIN_SECRET as string,
            email: process.env.ADMIN_EMAIL_SECRET as string,
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
};
