"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function SideDrawer() {
  const { data: session } = useSession();

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: session?.user ? "start" : "center",
        },
        display: { xs: "none", md: "block" },
      }}
      variant="permanent"
      ModalProps={{ keepMounted: false }}
      anchor="left"
    >
      <Link
        href="/"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          padding: "25px 0",
        }}
      >
        <Image src="/images/logo-white.png" alt="Logo" width={80} height={80}></Image>
        <Typography variant="h5" color="secondary" sx={{ fontWeight: "bold", pt: 1, textAlign: "center" }}>
          {process.env.NEXT_PUBLIC_NAME}
        </Typography>
      </Link>

      {session?.user && (
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="text"
          color="secondary"
          size="large"
        >
          <Button href="/" LinkComponent={Link}>
            <HomeIcon /> {process.env.NEXT_PUBLIC_HOME_BUTTON}
          </Button>
          <Button href="/admin" LinkComponent={Link}>
            <AdminPanelSettingsIcon /> {process.env.NEXT_PUBLIC_ADMIN_BUTTON}
          </Button>
          <Button onClick={() => signOut({ callbackUrl: "/" })} color="error">
            <LogoutIcon /> {process.env.NEXT_PUBLIC_ADMIN_LOGOUT_BUTTON}
          </Button>
        </ButtonGroup>
      )}
    </Drawer>
  );
}
