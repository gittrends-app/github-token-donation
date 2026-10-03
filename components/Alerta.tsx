import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { DonationCookie } from "@/lib/cookies";
import { messages } from "@/lib/messages";

export default function Alerta({ donor, error }: { donor?: DonationCookie; error?: string }) {
  if (error) {
    return (
      <Alert severity="error" variant="outlined">
        <AlertTitle>{messages.errorTitle}</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (donor) {
    return (
      <Alert severity="success" variant="outlined">
        <AlertTitle>
          {messages.thanksTitle}, {donor.name || donor.login}!
        </AlertTitle>
        {messages.thanksMessage}
      </Alert>
    );
  }

  return null;
}
