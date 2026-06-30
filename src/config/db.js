const mongoose = require("mongoose");
const dns = require("dns");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()));
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || "pulsedonate",
  });
  console.log(`MongoDB connected: ${process.env.DB_NAME || "pulsedonate"}`);
}

module.exports = connectDB;
