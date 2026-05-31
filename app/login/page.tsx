"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);

  const [user, setUser] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" color="primary">
        Admin
      </Typography>
      <br />
      <Grid container spacing={2}>
        <Grid size={4} />
        <Grid size={4}>
          <TextField
            id="user"
            fullWidth
            label="User"
            variant="filled"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUser(event.target.value);
            }}
          />
        </Grid>
        <Grid size={4} />
        <Grid size={4} />
        <Grid size={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <FilledInput
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Ver senha" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid size={4} />
        <Grid size={4} />
        <Grid size={4}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => {
              if (user && password) {
                signIn("credentials", { callbackUrl: "/admin", user, password });
              }
            }}
          >
            Login
          </Button>
        </Grid>
        <Grid size={4} />
      </Grid>
      <div>
        <br />
      </div>
    </Box>
  );
}
