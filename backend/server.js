require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectMongo, getMongoStatus } = require("./db"); // Connect to MongoDB from db.js

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Mongo health: http://localhost:${PORT}/api/health/db`);

  connectMongo().catch((err) => {
    console.error("[MongoDB] connection failed:", err.message);
  });
});
