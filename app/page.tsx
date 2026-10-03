import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { cookies } from "next/headers";
import Image from "next/image";
import Alerta from "@/components/Alerta";
import { DONATION_COOKIE, type DonationCookie } from "@/lib/cookies";
import { describeScope, errorMessage, ghClientId, ghScopes, messages } from "@/lib/messages";

function readDonation(value: string | undefined): DonationCookie | undefined {
  if (!value) return undefined;
  try {
    const donation = JSON.parse(value) as DonationCookie;
    // A new app version may request different scopes, so previous donors can donate again
    return donation.version === process.env.APP_VERSION ? donation : undefined;
  } catch {
    return undefined;
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, cookieStore] = await Promise.all([searchParams, cookies()]);
  const donor = readDonation(cookieStore.get(DONATION_COOKIE)?.value);
  const revokeUrl = ghClientId
    ? `https://github.com/settings/connections/applications/${ghClientId}`
    : "https://github.com/settings/applications";

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
        alignItems: "center",
        gap: { xs: 4, md: 6 },
        minHeight: { md: "calc(100dvh - 96px)" },
      }}
    >
      <Stack spacing={4}>
        <Alerta donor={donor} error={errorMessage(error)} />

        <Stack spacing={2}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: 1.5 }}
          >
            {messages.name}
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            {messages.title}
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
            {messages.message}
          </Typography>
        </Stack>

        <Box>
          <Button
            variant="contained"
            size="large"
            href="/api/github/authorize"
            disabled={Boolean(donor)}
            startIcon={<GitHubIcon />}
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            {messages.donateButton}
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
              <LockOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                What we will be able to access
              </Typography>
            </Stack>
            <List dense disablePadding>
              {ghScopes.map((scope) => (
                <ListItem key={scope} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={describeScope(scope)} secondary={<code>{scope}</code>} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tokens are only used for research data collection and are never shared. You can revoke
              access at any time in your{" "}
              <Link href={revokeUrl} target="_blank" rel="noopener noreferrer">
                GitHub settings
              </Link>
              .
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          order: { xs: -1, md: 0 },
        }}
      >
        <Box sx={{ width: { xs: 160, sm: 220, md: "100%" }, maxWidth: 380 }}>
          <Image
            src="/images/ghpet.png"
            alt="Scientist Octocat"
            width={612}
            height={684}
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
