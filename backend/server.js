require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectMongo, getMongoStatus } = require("./db"); // Connect to MongoDB from db.js
const {
  getOrFetchMclarenResults,
} = require("./mclarenSeasonResultsCache");

const PORT = Number(process.env.PORT) || 5001;

const app = express();

app.use(cors({ origin: true, credentials: true })); // Allows the frontend to make requests to the backend
app.use(express.json()); // Allows the backend to parse JSON requests

// API route to test backend is working
app.get("/api/health", (_req, res) => {
  const mongo = getMongoStatus(); // Get MongoDB status from function in db.js
  const dbOk = mongo.readyState === 1; // 1 is connected, 0 is disconnected
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongo: {
      ...mongo,
      ok: dbOk,
    },
  });
});

/** API route to test backend database connection */
app.get("/api/health/db", (_req, res) => {
  const mongo = getMongoStatus();
  res.json({
    mongo: {
      ...mongo,
      ok: mongo.readyState === 1,
    },
  });
});

/** API route to handle frontend request and calls fetchMclarenConstructorResults to fetch McLaren race results for one season
 * Has a query parameter for the season, defaults to 2025 if not given
 */
app.get("/api/mclaren/results", async (req, res) => {
  try {
    const season = req.query.season ?? "2025";
    if (!/^\d{4}$/.test(String(season))) {
      return res
        .status(400)
        .json({ error: "season must be a 4-digit year (e.g. 2025)" });
    }
    const refresh =
      req.query.refresh === "true" || req.query.refresh === "1";
    const data = await getOrFetchMclarenResults(season, "mclaren", {
      refresh,
    });
    res.json(data);
  } catch (err) {
    console.error("[GET /api/mclaren/results]", err);
    res.status(502).json({
      error: err instanceof Error ? err.message : "Failed to fetch F1 data",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Mongo health: http://localhost:${PORT}/api/health/db`);
  console.log(
    `McLaren results (cached): http://localhost:${PORT}/api/mclaren/results?season=2025`,
  );
  console.log(
    `Force refresh Jolpica + rewrite cache: .../api/mclaren/results?season=2025&refresh=true`,
  );

  connectMongo().catch((err) => {
    console.error("[MongoDB] connection failed:", err.message);
  });
});
