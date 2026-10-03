"use client";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useI18n } from "@/lib/i18n/client";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setLoading(true);
    setError(false);
    const result = await signIn("credentials", {
      user: form.get("user"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);

    // next-auth v4 reports `ok: true` even for rejected credentials, so rely on `error`
    if (result && !result.error) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70dvh" }}
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <Stack spacing={1} sx={{ alignItems: "center" }}>
              <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h5" component="h1">
                {t.login.title}
              </Typography>
            </Stack>

            {error && <Alert severity="error">{t.login.invalid}</Alert>}

            <TextField
              name="user"
              label={t.login.user}
              autoComplete="username"
              required
              fullWidth
              autoFocus
            />
            <TextField
              name="password"
              label={t.login.password}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" size="large" loading={loading} fullWidth>
              {t.login.submit}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
