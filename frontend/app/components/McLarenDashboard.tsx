"use client";

import { useMcLarenResults } from "../hooks/useMcLarenResults";
import McLarenHero from "./McLarenHero";
import McLarenResultsTable from "./McLarenResultsTable";
import McLarenTeamPointsChart from "./McLarenTeamPointsChart";

const SEASON = "2025";

export default function McLarenDashboard() {
  const { rows, meta, loading, fetchError, baseUrl } =
    useMcLarenResults(SEASON);

  return (
    <>
      <McLarenHero />
      <McLarenResultsTable
        rows={rows}
        meta={meta}
        loading={loading}
        fetchError={fetchError}
        baseUrl={baseUrl}
      />
      <McLarenTeamPointsChart
        rows={rows}
        loading={loading}
        seasonLabel={meta.season || SEASON}
      />
    </>
  );
}
