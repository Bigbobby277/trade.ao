import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Headline: "${headline}"` },
    ],
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: "Analysis unavailable for this headline.",
      impact: "low",
      sentiment: "neutral",
      affectedAssets: [],
    };
  }
}
