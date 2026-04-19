"use client";

import { useEffect, useState } from "react";
import type { ApiPayload, ResultRow } from "../types/mclarenResults";

export function useMcLarenResults(season = "2025") {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

  const [rows, setRows] = useState<ResultRow[]>([]);
  const [meta, setMeta] = useState<{
    season: string;
    fromCache?: boolean;
  }>({ season: "" });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(
          `${baseUrl.replace(/\/$/, "")}/api/mclaren/results?season=${season}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ApiPayload;
        if (!cancelled) {
          setRows(Array.isArray(data.rows) ? data.rows : []);
          setMeta({
            season: data.season ?? season,
            fromCache: data.fromCache,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setFetchError(
            e instanceof Error ? e.message : "Could not load race results.",
          );
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, season]);

  return { rows, meta, loading, fetchError, baseUrl };
}
