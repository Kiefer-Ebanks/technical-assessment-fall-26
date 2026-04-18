require("dotenv").config();

const express = require("express");
const cors = require("cors");

const PORT = Number(process.env.PORT) || 5001;

const app = express();

// Allow the Next.js dev server (and similar) to call this API during development
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
