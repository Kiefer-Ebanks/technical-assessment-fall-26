"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResultRow } from "../types/mclarenResults";
import { aggregateTeamPointsByRound } from "../lib/teamPointsByRound";

const papaya = "#FF8700";

const chartSectionBg = {
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

type Props = {
  rows: ResultRow[];
  loading: boolean;
  seasonLabel: string;
};

export default function McLarenTeamPointsChart({
  rows,
  loading,
  seasonLabel,
}: Props) {
  const chartData = useMemo(
    () => aggregateTeamPointsByRound(rows),
    [rows],
  );

  const sectionRef = useRef<HTMLElement>(null);
  /** Mount chart only after section is in view so bars animate in (skipped if reduced motion). */
  const [revealChart, setRevealChart] = useState(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealChart(true);
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealChart(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      id="graph"
      component="section"
      sx={{
        scrollMarginTop: "1rem",
        py: { xs: 3, md: 5 },
        ...chartSectionBg,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: "#1a1a1a", fontWeight: 700, mb: 1 }}
        >
          Team points per race · {seasonLabel || "2025"}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(0,0,0,0.58)", mb: 3 }}
        >
          The total score of both McLarendrivers combined for each Grand Prix weekend.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: papaya }} />
          </Box>
        ) : chartData.length === 0 ? (
          <Typography color="text.secondary">
            No race data to chart yet.
          </Typography>
        ) : !revealChart ? (
          <Paper
            elevation={1}
            sx={{
              height: 400,
              p: { xs: 1, md: 2 },
              bgcolor: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 2,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
            aria-busy="true"
          />
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1, md: 2 },
              bgcolor: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 2,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 16, left: 8, bottom: 48 }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#444", fontSize: 12 }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={56}
                    label={{
                      value: "Round",
                      position: "bottom",
                    }}
                  />
                  <YAxis
                    tick={{ fill: "#444", fontSize: 12 }}
                    label={{
                      value: "Points",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#666",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1d24",
                      border: `1px solid ${papaya}`,
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#fff", fontWeight: 600 }}
                    formatter={(value) => [
                      typeof value === "number" ? value : Number(value) || 0,
                      "Team points",
                    ]}
                    labelFormatter={(_label, payload) => {
                      const p = payload?.[0]?.payload as
                        | { raceName?: string; label?: string }
                        | undefined;
                      return p?.raceName ?? p?.label ?? "";
                    }}
                  />
                  <Bar
                    dataKey="teamPoints"
                    fill={papaya}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                    isAnimationActive
                    animationDuration={780}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
