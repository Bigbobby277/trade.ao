import mongoose from "mongoose";

const headlineSchema = new mongoose.Schema(
  {
    sourceUrl: { type: String, required: true, unique: true },
    source: String,
    title: { type: String, required: true },
    publishedAt: Date,
    analysis: {
      summary: String,
      impact: { type: String, enum: ["high", "medium", "low"], default: "medium" },
      sentiment: { type: String, enum: ["bullish", "bearish", "neutral"], default: "neutral" },
      affectedAssets: [String],
      analyzedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Headline", headlineSchema);
