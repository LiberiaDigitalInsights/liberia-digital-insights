import "dotenv/config";
import express from "express";
import uploadRouter from "./src/routes/upload.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/v1", uploadRouter);

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

app.listen(PORT, () => console.log(`API listening on :${PORT}`));
