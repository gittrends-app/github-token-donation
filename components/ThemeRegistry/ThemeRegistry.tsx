"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { enUS, ptBR } from "@mui/material/locale";
import { createTheme, type ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Roboto } from "next/font/google";
import * as React from "react";
import type { Locale } from "@/lib/i18n";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Brand teal (#68b2b1) is too light for white text, so light mode uses a darker shade for contrast
const themeOptions: ThemeOptions = {
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2f7d7c", light: "#68b2b1", dark: "#1f5b5a", contrastText: "#ffffff" },
        background: { default: "#f6faf9", paper: "#ffffff" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#68b2b1", light: "#8fd0cf", dark: "#2f7d7c", contrastText: "#0b1f1f" },
        background: { default: "#0f1716", paper: "#16211f" },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiPaper: { styleOverrides: { outlined: { borderRadius: 16 } } },
  },
};

// MUI's own locale packs translate built-in texts (pagination labels, aria-labels, …)
const muiLocales = { en: enUS, "pt-BR": ptBR };

export default function ThemeRegistry({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const theme = React.useMemo(() => createTheme(themeOptions, muiLocales[locale]), [locale]);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
