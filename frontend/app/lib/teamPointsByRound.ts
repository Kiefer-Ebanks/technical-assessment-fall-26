import type { ResultRow } from "../types/mclarenResults";

/* One bar per round and both drivers’ points summed for each race */
export type TeamPointsDatum = {
  round: number;
  /** Short X-axis tick, e.g. "R3" */
  label: string;
  raceName: string;
  teamPoints: number;
};

/* Groups rows by round and sums points */
export function aggregateTeamPointsByRound(rows: ResultRow[]): TeamPointsDatum[] {
  const map = new Map<
    string,
    { round: number; raceName: string; teamPoints: number }
  >();

  for (const r of rows) {
    const key = r.round;
    const pts = Number(r.points) || 0;
    const existing = map.get(key);
    if (existing) {
      existing.teamPoints += pts;
    } else {
      map.set(key, {
        round: Number(r.round),
        raceName: r.raceName,
        teamPoints: pts,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.round - b.round)
    .map((d) => ({
      ...d,
      label: `R${d.round}`,
    }));
}
