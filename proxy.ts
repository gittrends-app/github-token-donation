import { withAuth } from "next-auth/middleware";

// Only admin pages and APIs require an authenticated session
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
