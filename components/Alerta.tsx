import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { DonationCookie } from "@/lib/cookies";
import type { Dictionary } from "@/lib/i18n";

export default function Alerta({
  t,
  donor,
  error,
}: {
  t: Dictionary["alerts"];
  donor?: DonationCookie;
  error?: string;
}) {
  if (error) {
    return (
      <Alert severity="error" variant="outlined">
        <AlertTitle>{t.errorTitle}</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (donor) {
    return (
      <Alert severity="success" variant="outlined">
        <AlertTitle>{t.thanksTitle(donor.name || donor.login)}</AlertTitle>
        {t.thanksMessage}
      </Alert>
    );
  }

  return null;
}
