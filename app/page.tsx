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
import { ghClientId, ghScopes } from "@/helpers/github";
import { DONATION_COOKIE, type DonationCookie } from "@/lib/cookies";
import { getI18n } from "@/lib/i18n/server";
import { isDonationOutcome } from "@/lib/types";

function readDonation(value: string | undefined): DonationCookie | undefined {
  if (!value) return undefined;
  try {
    const donation = JSON.parse(value) as DonationCookie;
    return typeof donation?.login === "string" ? donation : undefined;
  } catch {
    return undefined;
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; donation?: string }>;
}) {
  const [{ error, donation }, cookieStore, { t }] = await Promise.all([
    searchParams,
    cookies(),
    getI18n(),
  ]);
  // Widened for lookups by arbitrary scope strings; the dictionaries still enforce every key
  const scopeLabels: Record<string, string> = t.scopes;
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
        <Alerta
          key={error ?? donation ?? "none"}
          donor={donor}
          error={error}
          outcome={isDonationOutcome(donation) ? donation : undefined}
        />

        <Stack spacing={2}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: 1.5 }}
          >
            {t.app.name}
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            {t.home.title}
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
            {t.app.description}
          </Typography>
        </Stack>

        {/* Donors can always donate again: the new token replaces the stored one */}
        <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <Button
            variant="contained"
            size="large"
            href="/api/github/authorize"
            startIcon={<GitHubIcon />}
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            {donor ? t.home.update : t.home.donate}
          </Button>
          {donor && (
            <Typography variant="body2" color="text.secondary">
              {t.home.updateHint(donor.login)}
            </Typography>
          )}
        </Stack>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
              <LockOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                {t.home.accessTitle}
              </Typography>
            </Stack>
            <List dense disablePadding>
              {ghScopes.map((scope) => (
                <ListItem key={scope} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={scopeLabels[scope] ?? scope}
                    secondary={<code>{scope}</code>}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t.home.revokeNote}{" "}
              <Link href={revokeUrl} target="_blank" rel="noopener noreferrer">
                {t.home.revokeLink}
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
            alt={t.home.imageAlt}
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
