const mongoose = require("mongoose");
const dns = require("dns");

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    if (process.env.DNS_SERVERS) {
      dns.setServers(
        process.env.DNS_SERVERS.split(",").map((server) => server.trim()),
      );
    }

    mongoose.set("strictQuery", true);
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME || "pulsedonate",
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  const connection = await connectionPromise;
  console.log(`MongoDB connected: ${process.env.DB_NAME || "pulsedonate"}`);
  return connection;
}

module.exports = connectDB;
