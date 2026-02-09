import "dotenv/config";
import express from "express";
import uploadRouter from "./src/routes/upload.js";
import articlesRouter from "./src/routes/articles.js";
import insightsRouter from "./src/routes/insights.js";
import podcastsRouter from "./src/routes/podcasts.js";
import eventsRouter from "./src/routes/events.js";
import trainingRouter from "./src/routes/training.js";
import newslettersRouter from "./src/routes/newsletters.js";
import authRouter from "./src/routes/auth.js";
import categoriesRouter from "./src/routes/categories.js";
import advertisementsRouter from "./src/routes/advertisements.js";
import talentsRouter from "./src/routes/talents.js";
import galleryRouter from "./src/routes/gallery.js";
import seedRouter from "./src/routes/seed.js";
import mockRouter from "./src/routes/mock.js";
import audioRouter from "./src/routes/audio.js";
import analyticsRouter from "./src/routes/analytics.js";
import usersRouter from "./src/routes/users.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "10mb" }));

// CORS Configuration - Support multiple origins
const allowedOrigins = [
  process.env.CORS_ORIGIN, // From .env file (your Vercel domain)
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow if origin is in the allowed list or if CORS_ORIGIN is "*"
  if (process.env.CORS_ORIGIN === "*" || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

// API Routes - Database routes first, then mock routes for fallback
app.use("/v1/articles", articlesRouter);
app.use("/v1/insights", insightsRouter);
app.use("/v1/podcasts", podcastsRouter);
app.use("/v1/events", eventsRouter);
app.use("/v1/training", trainingRouter);
app.use("/v1/newsletters", newslettersRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/categories", categoriesRouter);
app.use("/v1/advertisements", advertisementsRouter);
app.use("/v1/talents", talentsRouter);
app.use("/v1/gallery", galleryRouter);
app.use("/v1/seed", seedRouter);
app.use("/v1/audio", audioRouter);
app.use("/v1/analytics", analyticsRouter);
app.use("/v1/users", usersRouter);
app.use("/v1", uploadRouter);
app.use("/v1", mockRouter); // Mock data as fallback for testing

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    timestamp: new Date().toISOString(),
    service: "backend",
    path: err.path || req.path,
    message: err.message,
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || "Not set"}`);
});
