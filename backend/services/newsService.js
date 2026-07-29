import Parser from "rss-parser";

const parser = new Parser();

// Free, publicly available financial RSS feeds. Swap/add feeds here —
// this is where you'd plug in a paid provider (Reuters, LSEG, Benzinga)
// later if you want lower latency or exclusive content.
const FEEDS = [
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
  { name: "Investing.com", url: "https://www.investing.com/rss/news_301.rss" },
  { name: "MarketWatch", url: "https://feeds.marketwatch.com/marketwatch/topstories/" },
];

export async function fetchLatestHeadlines(limit = 20) {
  const results = [];
  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items.slice(0, limit)) {
        results.push({
          source: feed.name,
          title: item.title,
          sourceUrl: item.link,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        });
      }
    } catch (err) {
      console.error(`Failed to fetch feed ${feed.name}:`, err.message);
    }
  }
  return results
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
}
