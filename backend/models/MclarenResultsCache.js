const mongoose = require("mongoose");

/** One flattened race-result row (matches normalizeRows output). */
const resultRowSchema = new mongoose.Schema(
  {
    season: String,
    round: String,
    raceName: String,
    raceDate: String,
    circuitId: String,
    circuitName: String,
    locality: String,
    country: String,
    driverCode: String,
    driverId: String,
    givenName: String,
    familyName: String,
    position: String,
    points: Number,
    status: String,
  },
  { _id: false },
);

/**
 * One database document per (season, constructor) so we have McLaren data only rows
 */
const mclarenResultsCacheSchema = new mongoose.Schema({
  season: { type: String, required: true },
  constructorId: { type: String, required: true, default: "mclaren" },
  source: String, // the url of the source of the data
  raceCount: Number,
  rowCount: Number,
  rows: [resultRowSchema],
  fetchedAt: { type: Date, default: Date.now },
});

mclarenResultsCacheSchema.index(
  { season: 1, constructorId: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  "MclarenResultsCache",
  mclarenResultsCacheSchema,
);
