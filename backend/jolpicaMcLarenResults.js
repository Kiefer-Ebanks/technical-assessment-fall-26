/* API shape: MRData → RaceTable → Races[] → Results[] per race. */

// Gets the base URL for the F1 API
function getF1BaseUrl() {
  const raw =
    process.env.F1_API_BASE_URL ?? "https://api.jolpi.ca/ergast/f1";
  return raw.replace(/\/$/, "");
}

/**
 * Builds the URL for the api call as the documentation specifies
 * added the max limit so one request returns the full season
 */
function resultsUrl(season, constructorId = "mclaren") {
  const base = getF1BaseUrl();
  const path = `${season}/constructors/${constructorId}/results.json`;
  const url = new URL(`${base}/${path}`);
  url.searchParams.set("limit", "100");
  return url.toString();
}

function normalizeRows(info) {
  const races = info?.MRData?.RaceTable?.Races ?? [];
  const rows = [];

  for (const race of races) {
    const circuit = race.Circuit;
    const location = circuit?.Location;
    const results = race.Results ?? [];

    for (const r of results) {
      const driver = r.Driver;
      rows.push({
        season: race.season,
        round: race.round,
        raceName: race.raceName,
        raceDate: race.date,
        circuitId: circuit?.circuitId,
        circuitName: circuit?.circuitName,
        locality: location?.locality,
        country: location?.country,
        driverCode: driver?.code ?? "",
        driverId: driver?.driverId,
        givenName: driver?.givenName,
        familyName: driver?.familyName,
        position: r.position,
        points: Number(r.points ?? 0),
        status: r.status,
      });
    }
  }

  return rows;
}

async function fetchMclarenConstructorResults(season, constructorId = "mclaren") {
  const url = resultsUrl(season, constructorId);
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Jolpica HTTP ${res.status} ${res.statusText}${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }
  const json = await res.json();
  const rows = normalizeRows(json);

  // return the data to the backend endpoint
  return {
    season: String(season),
    constructorId,
    source: url,
    raceCount: json?.MRData?.RaceTable?.Races?.length ?? 0,
    rowCount: rows.length,
    rows,
  };
}

module.exports = {
  getF1BaseUrl,
  resultsUrl,
  normalizeRows,
  fetchMclarenConstructorResults,
};
