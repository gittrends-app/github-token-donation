"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/client";

// Starts the OAuth flow with a full-page navigation, so the page would otherwise look idle until
// GitHub answers: show a spinner from the click until the browser leaves the page.
export default function DonateButton({ isDonor }: { isDonor: boolean }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  // Going back from GitHub can restore this page from the back/forward cache with the spinner on
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    // Opening in a new tab/window keeps this page as is
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    setLoading(true);
  };

  return (
    <Button
      variant="contained"
      size="large"
      href="/api/github/authorize"
      onClick={handleClick}
      loading={loading}
      loadingPosition="start"
      startIcon={<GitHubIcon />}
      sx={{
        px: 4,
        py: 1.5,
        fontSize: "1.1rem",
        // Keep the brand look while redirecting instead of MUI's grey disabled style
        "&.MuiButton-loading": { bgcolor: "primary.dark", color: "primary.contrastText" },
        // Centre the spinner where the GitHub icon sits (MUI's default offset assumes default padding)
        "& .MuiButton-loadingIndicator": { color: "inherit", left: "31px" },
      }}
    >
      {loading ? t.home.redirecting : isDonor ? t.home.update : t.home.donate}
    </Button>
  );
}
