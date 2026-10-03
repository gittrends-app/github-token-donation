"use client";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import * as React from "react";
import Logo from "@/components/Logo";
import { type Locale, localeLabels, locales } from "@/lib/i18n";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "@/lib/i18n/client";

export const DRAWER_WIDTH = 260;

const REPOSITORY_URL = "https://github.com/gittrends-app/github-token-donation";

const brandBackground = "linear-gradient(180deg, #2f7d7c 0%, #1f5b5a 100%)";

function Brand() {
  const { t } = useI18n();

  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        py: 4,
        px: 2,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Logo size={72} />
      <Typography variant="h6" component="span" sx={{ fontWeight: 700, textAlign: "center" }}>
        {t.app.name}
      </Typography>
    </Box>
  );
}

function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={locale}
      disabled={pending}
      aria-label={t.nav.language}
      onChange={(_, value: Locale | null) => {
        if (!value || value === locale) return;
        startTransition(async () => {
          await setLocale(value);
          router.refresh();
        });
      }}
      sx={{
        alignSelf: "center",
        "& .MuiToggleButton-root": {
          color: "rgba(255,255,255,0.7)",
          borderColor: "rgba(255,255,255,0.3)",
          px: 1.5,
          py: 0.25,
          fontSize: 12,
        },
        "& .MuiToggleButton-root.Mui-selected": {
          color: "#fff",
          bgcolor: "rgba(255,255,255,0.18)",
        },
      }}
    >
      {locales.map((value) => (
        <ToggleButton key={value} value={value} lang={value}>
          {localeLabels[value]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useI18n();

  const itemSx = {
    borderRadius: 2,
    mx: 1.5,
    mb: 0.5,
    color: "inherit",
    "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.18)" },
    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", color: "#fff" }}>
      <Brand />
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List sx={{ pt: 2 }}>
        <ListItemButton
          component={Link}
          href="/"
          selected={pathname === "/"}
          onClick={onNavigate}
          sx={itemSx}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={t.nav.home} />
        </ListItemButton>
        {session?.user && (
          <ListItemButton
            component={Link}
            href="/admin"
            selected={pathname.startsWith("/admin")}
            onClick={onNavigate}
            sx={itemSx}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t.nav.admin} />
          </ListItemButton>
        )}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* The admin area is never linked publicly: admins reach /login directly */}
      {session?.user && (
        <List>
          <ListItemButton onClick={() => signOut({ callbackUrl: "/" })} sx={itemSx}>
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t.nav.logout} />
          </ListItemButton>
        </List>
      )}
      <LanguageSwitcher />
      <Box
        component="a"
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 2,
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
          textDecoration: "none",
          "&:hover": { color: "#fff" },
        }}
      >
        <GitHubIcon sx={{ fontSize: 16 }} /> v{process.env.APP_VERSION}
      </Box>
    </Box>
  );
}

export default function SideDrawer() {
  const [open, setOpen] = React.useState(false);
  const { t } = useI18n();

  const paperSx = {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    border: 0,
    background: brandBackground,
  } as const;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ display: { xs: "block", md: "none" }, background: brandBackground }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label={t.nav.openMenu}
            onClick={() => setOpen(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Logo size={32} />
          <Typography variant="subtitle1" component="span" sx={{ ml: 1.5, fontWeight: 700 }}>
            {t.app.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": paperSx }}
      >
        <Navigation onNavigate={() => setOpen(false)} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <Navigation />
      </Drawer>
    </>
  );
}
