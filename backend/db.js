const mongoose = require("mongoose");

/** Last connection error stored here so /api/health can show a message if there is an error */
let lastError = null;

const READY = ["disconnected", "connected", "connecting", "disconnecting"];

/* Connects to MongoDB using the URI in .env */
async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    const err = new Error("MONGODB_URI is not set in .env");
    lastError = err;
    throw err;
  }
  try {
    lastError = null;
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    lastError = err;
    throw err;
  }
}

/* Getting the status of the MongoDB connection
 * `readyState` is Mongoose's numeric code and we map it to a string for readability
 */
function getMongoStatus() {
  const readyState = mongoose.connection.readyState;
  return {
    state: READY[readyState] ?? "unknown",
    readyState,
    error: lastError ? lastError.message : null,
  };
}

module.exports = { connectMongo, getMongoStatus };
