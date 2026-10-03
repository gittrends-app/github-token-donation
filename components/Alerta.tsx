"use client";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import type { DonationCookie } from "@/lib/cookies";
import { useI18n } from "@/lib/i18n/client";
import type { DonationOutcome } from "@/lib/types";

// Floating status shown right after the OAuth round trip, driven by the callback's query string:
// `?donation=created|updated` (auto-hides) or `?error=<code>` (stays until closed). Closing it
// leaves the URL clean, so a reload or a later visit doesn't show it again.
export default function Alerta({
  donor,
  error,
  outcome,
}: {
  donor?: DonationCookie;
  error?: string;
  outcome?: DonationOutcome;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(Boolean(error || outcome));

  if (!error && !outcome) return null;

  // Widened for lookups by an arbitrary query string; the dictionaries still enforce every key
  const errors: Record<string, string> = t.alerts.errors;
  const errorText = error && Object.hasOwn(errors, error) ? errors[error] : errors.unexpected;

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    router.replace(pathname, { scroll: false });
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={error ? null : 8000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: { xs: 72, sm: 24 } }}
    >
      {error ? (
        <Alert
          severity="error"
          variant="filled"
          onClose={handleClose}
          sx={{ width: "100%", maxWidth: 480 }}
        >
          <AlertTitle>{t.alerts.errorTitle}</AlertTitle>
          {errorText}
        </Alert>
      ) : (
        <Alert
          severity="success"
          variant="filled"
          onClose={handleClose}
          sx={{ width: "100%", maxWidth: 480 }}
        >
          <AlertTitle>{t.alerts.thanksTitle(donor?.name || donor?.login)}</AlertTitle>
          {outcome === "updated" ? t.alerts.updatedMessage : t.alerts.thanksMessage}
        </Alert>
      )}
    </Snackbar>
  );
}
