const mongoose = require("mongoose");
const MclarenResultsCache = require("./models/MclarenResultsCache");
const {
  fetchMclarenConstructorResults,
} = require("./jolpicaMcLarenResults");

function dbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * If Mongoose is still connecting to the database, wait once so we don't skip the cache read by mistake
 */
async function waitIfConnecting() {
  if (mongoose.connection.readyState !== 2) return;
  try {
    await mongoose.connection.asPromise();
  } catch {
  }
}

/**
 * Returns the data from the database if it exists, or null
 */
async function tryReadCache(key, refresh) {
  if (refresh) return null;

  await waitIfConnecting();

  if (!dbConnected()) return null;

  try {
    const doc = await MclarenResultsCache.findOne(key).lean();
    if (!doc) return null;

    return {
      season: doc.season,
      constructorId: doc.constructorId,
      source: doc.source,
      raceCount: doc.raceCount,
      rowCount: doc.rowCount,
      rows: doc.rows,
      fetchedAt: doc.fetchedAt,
      fromCache: true,
    };
  } catch (err) {
    console.error("[Mclaren cache read]", err.message);
    return null;
  }
}

// Writes the new data to the database
async function writeCache(key, data, fetchedAt) {
  if (!dbConnected()) return;
  try {
    await MclarenResultsCache.findOneAndUpdate(
      key,
      { ...data, fetchedAt },
      { upsert: true, new: true },
    );
  } catch (err) {
    console.error("[Mclaren cache write]", err.message);
  }
}

/**
 * Returns cached McLaren results from the database if it exists, otherwise fetches data from the api, saves to it to the database and then returns the data
 * if refresh=true, it will skip the cache read and refresh from the API
 */
async function getOrFetchMclarenResults(
  season,
  constructorId = "mclaren",
  { refresh = false } = {},
) {
  const key = { season: String(season), constructorId };

  const cached = await tryReadCache(key, refresh);
  if (cached) { // if the data is in the database, return it
    return cached;
  }

  const data = await fetchMclarenConstructorResults(season, constructorId);
  const fetchedAt = new Date();

  await writeCache(key, data, fetchedAt);

  return {
    ...data,
    fetchedAt,
    fromCache: false,
  };
}

module.exports = { getOrFetchMclarenResults };
