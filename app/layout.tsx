import Box from "@mui/material/Box";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import type * as React from "react";
import { authOptions } from "@/auth";
import SideDrawer from "@/components/SideDrawer";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import SessionProvider from "@/context/ClientProvider";
import { messages } from "@/lib/messages";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: messages.name, template: `%s · ${messages.name}` },
  description: messages.message,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2f7d7c" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1716" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <SessionProvider session={session}>
            <Box sx={{ display: { md: "flex" }, minHeight: "100dvh" }}>
              <SideDrawer />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  px: { xs: 2, sm: 4, lg: 8 },
                  py: { xs: 3, md: 6 },
                }}
              >
                {children}
              </Box>
            </Box>
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
