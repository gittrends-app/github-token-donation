"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { GitHubToken } from "../../api/github/route";
import useSWR from "swr";

export default function AdminPage() {
  const { data: tokens } = useSWR<GitHubToken[]>("/api/admin", (url: string) =>
    fetch(url, { next: { revalidate: 30 } }).then((res) => res.json()),
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" color="primary">
        Tabela de tokens doados
      </Typography>
      <br />
      {tokens && tokens.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Nome</TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Id do GitHub
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Token
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow
                  key={user.user.id}
                  sx={{
                    "& td": {
                      border: 0,
                      color: "#68b2b1",
                      backgroundColor: "white",
                    },
                  }}
                >
                  <TableCell scope="row">{user.user.name}</TableCell>
                  <TableCell align="right">{user.user.id}</TableCell>
                  <TableCell align="right">{user.access_token}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={tokens.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
}
