import { Router } from "express";
import Headline from "../models/Headline.js";
import { fetchLatestHeadlines } from "../services/newsService.js";
import { analyzeHeadline } from "../services/aiEngine.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Pulls fresh headlines and runs any un-analyzed ones through the AI engine.
// Call this from a cron job (see server.js) rather than on every page load.
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

// Public preview — a handful of headlines, no auth required (for the landing page feed)
router.get("/preview", async (req, res) => {
  const headlines = await Headline.find().sort({ publishedAt: -1 }).limit(5);
  res.json({ headlines });
});

// Full feed — requires login (gate this behind requireActiveSubscription once billing is live)
router.get("/", requireAuth, async (req, res) => {
  const headlines = await Headline.find().sort({ publishedAt: -1 }).limit(50);
  res.json({ headlines });
});

export default router;
