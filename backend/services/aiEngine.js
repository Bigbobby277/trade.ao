import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { responseMimeType: "application/json" },
});

const SYSTEM_PROMPT = `You are a market analyst engine for a trading intelligence platform.
Given a news headline, assess its likely market impact.
Respond ONLY with valid JSON, matching this shape exactly:
{
  "summary": "one sentence plain-English explanation of why this matters to traders",
  "impact": "high" | "medium" | "low",
  "sentiment": "bullish" | "bearish" | "neutral",
  "affectedAssets": ["e.g. NQUSD", "XAUUSD", "USD", "OIL" - up to 4, empty array if none clear]
}`;

export async function analyzeHeadline(headline) {
  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\nHeadline: "${headline}"`
  );
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // If the model returns non-JSON, fail safe rather than crash the pipeline
    return {
      summary: "Analysis unavailable for this headline.",
      impact: "low",
      sentiment: "neutral",
      affectedAssets: [],
    };
  }
}
