import { useEffect, useState } from "react";
import { api } from "../api.js";
import "./SignalStrip.css";

// Shown until real data loads from the backend (or if it's not running yet)
const FALLBACK = [
  { title: "Fed holds rates steady, signals two cuts possible in 2026", analysis: { sentiment: "bullish", impact: "high", affectedAssets: ["NQUSD", "USD"] } },
  { title: "Crude inventories rise more than expected", analysis: { sentiment: "bearish", impact: "medium", affectedAssets: ["OIL"] } },
  { title: "Core PCE inflation in line with forecasts", analysis: { sentiment: "neutral", impact: "medium", affectedAssets: ["USD", "XAUUSD"] } },
  { title: "Tech earnings beat estimates across the board", analysis: { sentiment: "bullish", impact: "high", affectedAssets: ["NQUSD"] } },
];

export default function SignalStrip() {
  const [headlines, setHeadlines] = useState(FALLBACK);

  useEffect(() => {
    api
      .newsPreview()
      .then((data) => {
        if (data.headlines?.length) setHeadlines(data.headlines);
      })
      .catch(() => {
        // Backend not running / no data yet — keep the fallback set
      });
  }, []);

  const loop = [...headlines, ...headlines];

  return (
    <div className="signal-strip" role="marquee" aria-label="Live market headlines with AI-assessed impact">
      <div className="signal-strip__track">
        {loop.map((h, i) => (
          <div className="signal-card" key={i}>
            <span className={`tag tag-${h.analysis.sentiment}`}>
              <span
                className="dot"
                style={{
                  background:
                    h.analysis.sentiment === "bullish"
                      ? "var(--bullish)"
                      : h.analysis.sentiment === "bearish"
                      ? "var(--bearish)"
                      : "var(--text-muted)",
                }}
              />
              {h.analysis.sentiment}
            </span>
            <span className="signal-card__title">{h.title}</span>
            {h.analysis.affectedAssets?.map((a) => (
              <span className="signal-card__asset" key={a}>
                {a}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
