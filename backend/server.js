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
import seedRouter from "./src/routes/seed.js";
import mockRouter from "./src/routes/mock.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));

// CORS (simple allow-all for now; tighten in production)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
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
app.use("/v1/seed", seedRouter);
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

app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
