import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { uploadRouter } from "./routes/upload.js";
import { analysisRouter } from "./routes/analysis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8080";
const NODE_ENV = process.env.NODE_ENV || "development";

// CORS: support multiple origins (comma-separated) for production
const allowedOrigins =
  NODE_ENV === "production"
    ? CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
    : true;

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/analysis", analysisRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  console.error("Request path:", req.path);
  console.error("Request method:", req.method);
  
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 CORS enabled for: ${NODE_ENV === "production" ? CORS_ORIGIN : "all origins (development)"}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
});
