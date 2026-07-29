import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import newsRoutes, { refreshAndAnalyze } from "./routes/news.js";
import subscriptionRoutes from "./routes/subscription.js";

const app = express();

// Allows your main CLIENT_URL plus any Vercel preview/production URL,
// since Vercel generates a new domain on every deploy.
const allowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // non-browser requests (curl, server-to-server)
  const isVercel = /\.vercel\.app$/.test(new URL(origin).hostname);
  const isConfigured = origin === process.env.CLIENT_URL;
  if (isVercel || isConfigured) return callback(null, true);
  callback(new Error("Not allowed by CORS"));
};

app.use(cors({ origin: allowedOrigin, credentials: true }));

// Stripe webhook needs the raw body — must be registered BEFORE express.json()
app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();

  // Refresh headlines + run AI analysis every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    refreshAndAnalyze().catch((err) => console.error("Scheduled refresh failed:", err.message));
  });

  // Run once on boot so the feed isn't empty
  refreshAndAnalyze().catch((err) => console.error("Initial refresh failed:", err.message));

  app.listen(PORT, () => console.log(`Trader.ai API running on port ${PORT}`));
}

start();
