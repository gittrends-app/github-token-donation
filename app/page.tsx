"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import Alerta from "@/components/Alerta";
import Image from "next/image";
import { useCookies } from "next-client-cookies";
import { Button } from "@mui/material";

export default function HomePage() {
  const cookie = useCookies();

  React.useEffect(() => {
    if (cookie.get("app_version") !== process.env.APP_VERSION) cookie.remove("access_token");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Alerta sx={{ margin: "auto", maxWidth: "350px" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flexGrow: 1,
        }}
      >
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          {process.env.NEXT_PUBLIC_TITLE}
        </Typography>
        <br />
        <br />
        <Typography variant="h5">
          {process.env.NEXT_PUBLIC_MESSAGE}
        </Typography>
      </Box>
      <br />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          float: "center",
        }}
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ color: "white", fontWeight: "bold", fontSize: "1.25rem" }}
          disabled={cookie.get("access_token") ? true : false}
          onClick={() => {
            if (!cookie.get("access_token")) {
              window.location.assign(
                "https://github.com/login/oauth/authorize?" +
                  new URLSearchParams({
                    client_id: process.env.NEXT_PUBLIC_GH_CLIENT_ID as string,
                    scope: process.env.NEXT_PUBLIC_GH_SCOPES || "public_repo,read:user",
                  }).toString(),
              );
            }
          }}
        >
          <GitHubIcon style={{ marginRight: 5 }} />
          {process.env.NEXT_PUBLIC_DONATE_BUTTON}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "end",
          flexGrow: 1,
        }}
      >
        <Image src="/images/ghpet.png" alt="Logo" width={240} height={240}></Image>
      </Box>
    </Box>
  );
}
