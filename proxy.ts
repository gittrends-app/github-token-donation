import { withAuth } from "next-auth/middleware";

// middleware is applied to all routes, use conditionals to select

export default withAuth(function proxy(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (/^(\/api)?\/admin(\/.*)?/gi.test(req.nextUrl.pathname) && token === null) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
