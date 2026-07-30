import { Router } from "express";
import Headline from "../models/Headline.js";
import { fetchLatestHeadlines } from "../services/newsService.js";
import { analyzeHeadline } from "../services/aiEngine.js";
import { requireAuth, attachUserTier } from "../middleware/auth.js";

const router = Router();

export async function refreshAndAnalyze() {
  const headlines = await fetchLatestHeadlines(20);
  for (const h of headlines) {
    const exists = await Headline.findOne({ sourceUrl: h.sourceUrl });
    if (exists) continue;
    let analysis;
    try {
      analysis = await analyzeHeadline(h.title);
    } catch (err) {
      console.error("AI analysis failed for headline:", h.title, err.message);
      continue;
    }
    await Headline.create({
      ...h,
      analysis: { ...analysis, analyzedAt: new Date() },
    });
  }
}

// Public preview — no auth required (for landing page)
router.get("/preview", async (req, res) => {
  const headlines = await Headline.find().sort({ publishedAt: -1 }).limit(5);
  res.json({ headlines });
});

// Full feed — requires login AND checks tier
router.get("/", requireAuth, attachUserTier, async (req, res) => {
  let headlines = await Headline.find().sort({ publishedAt: -1 }).limit(50);

  // FREE TIER: only XAUUSD headlines
  if (!req.isPaid) {
    headlines = headlines.filter((h) =>
      h.analysis?.affectedAssets?.includes("XAUUSD")
    );
  }
  // PAID TIER: all headlines, no filtering

  res.json({ headlines, tier: req.isPaid ? "paid" : "free" });
});

// Bias endpoint (for Daily Bias banner) — paid only
router.get("/bias", requireAuth, attachUserTier, async (req, res) => {
  if (!req.isPaid) {
    return res.status(402).json({ error: "Daily Bias requires paid subscription" });
  }

  // Aggregate sentiment from today's headlines
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const headlines = await Headline.find({
    createdAt: { $gte: today },
  });

  const sentiments = headlines
    .map((h) => h.analysis?.sentiment)
    .filter(Boolean);

  const bullish = sentiments.filter((s) => s === "bullish").length;
  const bearish = sentiments.filter((s) => s === "bearish").length;
  const neutral = sentiments.filter((s) => s === "neutral").length;

  let bias = "neutral";
  if (bullish > bearish && bullish > neutral) bias = "bullish";
  if (bearish > bullish && bearish > neutral) bias = "bearish";

  res.json({ bias, sentiment_breakdown: { bullish, bearish, neutral } });
});

export default router;
