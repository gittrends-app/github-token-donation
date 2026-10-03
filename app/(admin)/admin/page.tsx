"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useSWR from "swr";
import { useI18n } from "@/lib/i18n/client";
import type { GitHubToken } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};

function maskToken(token: string) {
  return token.length > 12
    ? `${token.slice(0, 4)}${"•".repeat(8)}${token.slice(-4)}`
    : "•".repeat(8);
}

function TokenCell({ token, onCopy }: { token: string; onCopy: (value: string) => void }) {
  const [visible, setVisible] = React.useState(false);
  const { t } = useI18n();

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
      <Box component="code" sx={{ fontSize: 13, whiteSpace: "nowrap" }}>
        {visible ? token : maskToken(token)}
      </Box>
      <Tooltip title={visible ? t.admin.hide : t.admin.show}>
        <IconButton size="small" onClick={() => setVisible((v) => !v)}>
          {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title={t.admin.copy}>
        <IconButton size="small" onClick={() => onCopy(token)}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default function AdminPage() {
  const {
    data: tokens,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<GitHubToken[]>("/api/admin", fetcher, { refreshInterval: 30_000 });
  const { locale, t } = useI18n();
  const dateFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }),
    [locale],
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [snackbar, setSnackbar] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!tokens || !query) return tokens || [];
    return tokens.filter(({ user }) =>
      [user.login, user.name, String(user.id)].some((v) => v?.toLowerCase().includes(query)),
    );
  }, [tokens, search]);

  const copy = async (value: string, message: string) => {
    await navigator.clipboard.writeText(value);
    setSnackbar(message);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" }, mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            {t.admin.title}
          </Typography>
          <Typography color="text.secondary">
            {tokens ? t.admin.received(tokens.length) : t.admin.loading}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            disabled={!filtered.length}
            onClick={() =>
              copy(
                filtered.map((t) => t.access_token).join("\n"),
                t.admin.copiedAll(filtered.length),
              )
            }
          >
            {t.admin.copyAll}
          </Button>
          <Tooltip title={t.admin.refresh}>
            <span>
              <IconButton onClick={() => mutate()} disabled={isValidating}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t.admin.loadError(error.message)}
        </Alert>
      )}

      <Paper variant="outlined">
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder={t.admin.search}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            sx={{ width: { xs: "100%", sm: 320 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t.admin.columns.user}</TableCell>
                <TableCell>{t.admin.columns.scopes}</TableCell>
                <TableCell>{t.admin.columns.donatedAt}</TableCell>
                <TableCell align="right">{t.admin.columns.token}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading &&
                ["s1", "s2", "s3", "s4", "s5"].map((key) => (
                  <TableRow key={key}>
                    <TableCell colSpan={4}>
                      <Skeleton height={40} />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {search ? t.admin.noResults : t.admin.empty}
                  </TableCell>
                </TableRow>
              )}
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({ user, access_token, scopes, donated_at }) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={`https://avatars.githubusercontent.com/u/${user.id}?s=64`}
                          alt={user.login}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name || user.login}
                          </Typography>
                          <Link
                            href={`https://github.com/${user.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                            color="text.secondary"
                          >
                            @{user.login} · {user.id}
                          </Link>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                        {(scopes || []).map((scope) => (
                          <Chip key={scope} label={scope} size="small" variant="outlined" />
                        ))}
                        {!scopes?.length && (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {donated_at ? dateFormat.format(new Date(donated_at)) : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <TokenCell
                        token={access_token}
                        onCopy={(value) => copy(value, t.admin.copied)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Paper>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={2500}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
