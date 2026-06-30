const express = require("express");
const cors = require("cors");
const dns = require("dns");

const authRoutes = require("./routes/auth.routes");
const donorRoutes = require("./routes/donor.routes");
const emergencyRoutes = require("./routes/emergency.routes");
const { notFound, errorHandler } = require("./middleware/error");

const DNS_SERVERS =
  process.env.DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean) || [
      "8.8.8.8",
      "8.8.4.4",
      "1.1.1.1",
    ];

// Configure DNS servers
dns.setServers(DNS_SERVERS);

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "pulsedonate-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/emergency-requests", emergencyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;