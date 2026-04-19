/** Shared shapes for `/api/mclaren/results` and UI components. */

export type ResultRow = {
  season: string;
  round: string;
  raceName: string;
  raceDate: string;
  circuitName?: string;
  country?: string;
  driverCode: string;
  givenName?: string;
  familyName?: string;
  position: string;
  points: number;
  status?: string;
};

export type ApiPayload = {
  rows: ResultRow[];
  season: string;
  rowCount?: number;
  fromCache?: boolean;
};
