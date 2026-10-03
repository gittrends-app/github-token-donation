import Box from "@mui/material/Box";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import type * as React from "react";
import { authOptions } from "@/auth";
import SideDrawer from "@/components/SideDrawer";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import SessionProvider from "@/context/ClientProvider";
import { I18nProvider } from "@/lib/i18n/client";
import { getI18n } from "@/lib/i18n/server";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: t.app.name, template: `%s · ${t.app.name}` },
    description: t.app.description,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2f7d7c" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1716" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, { locale }] = await Promise.all([getServerSession(authOptions), getI18n()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeRegistry locale={locale}>
          <I18nProvider locale={locale}>
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
          </I18nProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
