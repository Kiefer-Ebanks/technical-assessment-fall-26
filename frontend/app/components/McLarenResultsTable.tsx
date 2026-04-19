"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResultRow } from "../types/mclarenResults";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Search from "@mui/icons-material/Search";

const ROWS_PER_PAGE = 20;
const papaya = "#FF8700";

/** White field + very subtle grey diagonal dashes (opacity kept low so it stays calm). */
const tableSectionBg = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    repeating-linear-gradient(
      -45deg,
      #ffffff,
      #ffffff 13px,
      rgba(160, 168, 178, 0.04) 28px,
      rgba(160, 168, 178, 0.04) 14px,
      #ffffff 14px,
      #ffffff 28px
    )
  `,
};

function rowMatchesQuery(row: ResultRow, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const hay = [
    row.season,
    row.round,
    row.raceName,
    row.raceDate,
    row.circuitName,
    row.country,
    row.driverCode,
    row.givenName,
    row.familyName,
    row.position,
    String(row.points),
    row.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

export type McLarenResultsTableProps = {
  rows: ResultRow[];
  meta: { season: string; fromCache?: boolean };
  loading: boolean;
  fetchError: string | null;
  baseUrl: string;
};

export default function McLarenResultsTable({
  rows,
  meta,
  loading,
  fetchError,
  baseUrl,
}: McLarenResultsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => { // reset the page to 0 when the search changes
    setPage(0);
  }, [search]);

  const filtered = useMemo( // filter the rows based on the search query
    () => rows.filter((r) => rowMatchesQuery(r, search)),
    [rows, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const pageSlice = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return filtered.slice(start, start + ROWS_PER_PAGE);
  }, [filtered, page]);

  const rangeStart = filtered.length === 0 ? 0 : page * ROWS_PER_PAGE + 1;
  const rangeEnd = Math.min(
    filtered.length,
    page * ROWS_PER_PAGE + pageSlice.length,
  );

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 6 },
        ...tableSectionBg,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: "#1a1a1a",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {meta.season || "2025"} Season · race results
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.58)", mb: 3 }}>
          Find out how McLaren has performed in the past seasons. You can search for specific information too!
        </Typography>

        <TextField
          fullWidth
          placeholder="Search races, circuits, drivers, points…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.92)",
              color: "#222",
              "& fieldset": { borderColor: "rgba(255,135,0,0.45)" },
              "&:hover fieldset": { borderColor: papaya },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: papaya }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError} — is the backend running at {baseUrl}?
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: papaya }} />
          </Box>
        ) : (
          <>
            <Paper
              elevation={2}
              sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <TableContainer sx={{ maxHeight: 520 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: "#f0f2f5", color: "#1a1a1a", fontWeight: 700 }}>
                        Rnd
                      </TableCell>
                      <TableCell sx={{ bgcolor: "#f0f2f5", color: "#1a1a1a", fontWeight: 700 }}>
                        Grand Prix
                      </TableCell>
                      <TableCell sx={{ bgcolor: "#f0f2f5", color: "#1a1a1a", fontWeight: 700 }}>
                        Circuit
                      </TableCell>
                      <TableCell sx={{ bgcolor: "#f0f2f5", color: "#1a1a1a", fontWeight: 700 }}>
                        Driver
                      </TableCell>
                      <TableCell align="right" sx={{ bgcolor: "#f0f2f5", color: papaya, fontWeight: 700 }}>
                        Pos.
                      </TableCell>
                      <TableCell align="right" sx={{ bgcolor: "#f0f2f5", color: papaya, fontWeight: 700 }}>
                        Pts
                      </TableCell>
                      <TableCell sx={{ bgcolor: "#f0f2f5", color: "#1a1a1a", fontWeight: 700 }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageSlice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: "rgba(0,0,0,0.45)" }}>
                          No rows match your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageSlice.map((row, i) => (
                        <TableRow
                          key={`${row.round}-${row.raceName}-${row.driverCode}-${row.position}-${i}`}
                          hover
                          sx={{
                            "&:nth-of-type(even)": {
                              bgcolor: "rgba(0,0,0,0.03)",
                            },
                          }}
                        >
                          <TableCell sx={{ color: "#444" }}>{row.round}</TableCell>
                          <TableCell sx={{ color: "#111", fontWeight: 500 }}>
                            {row.raceName}
                          </TableCell>
                          <TableCell sx={{ color: "#555", maxWidth: 200 }}>
                            {[row.circuitName, row.country].filter(Boolean).join(" · ")}
                          </TableCell>
                          <TableCell sx={{ color: "#222" }}>
                            {[row.givenName, row.familyName].filter(Boolean).join(" ")}{" "}
                            <Typography component="span" variant="caption" sx={{ color: papaya }}>
                              ({row.driverCode})
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ color: "#111", fontWeight: 600 }}>
                            {row.position}
                          </TableCell>
                          <TableCell align="right" sx={{ color: papaya, fontWeight: 700 }}>
                            {row.points}
                          </TableCell>
                          <TableCell sx={{ color: "#666", maxWidth: 140 }}>{row.status ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.58)" }}>
                {filtered.length === 0
                  ? "No results"
                  : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} rows`}
                {search.trim() ? ` (filtered from ${rows.length} total)` : ""}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  aria-label="Previous page"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page <= 0 || filtered.length === 0}
                  sx={{
                    color: papaya,
                    border: "1px solid rgba(255,135,0,0.55)",
                    bgcolor: "rgba(255,255,255,0.85)",
                    "&:disabled": { opacity: 0.35 },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <Typography variant="body2" sx={{ color: "#333", minWidth: 120, textAlign: "center" }}>
                  Page {filtered.length === 0 ? 0 : page + 1} of {filtered.length === 0 ? 0 : totalPages}
                </Typography>
                <IconButton
                  aria-label="Next page"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || filtered.length === 0}
                  sx={{
                    color: papaya,
                    border: "1px solid rgba(255,135,0,0.55)",
                    bgcolor: "rgba(255,255,255,0.85)",
                    "&:disabled": { opacity: 0.35 },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
