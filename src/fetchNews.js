const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const { sources } = config;

const techKeywords = [
  "tech",
  "technology",
  "ai",
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "neural network",
  "data science",
  "cloud computing",
  "aws",
  "azure",
  "gcp",
  "serverless",
  "devops",
  "programming",
  "software development",
  "web development",
  "mobile development",
  "cybersecurity",
  "blockchain",
  "crypto",
  "bitcoin",
  "ethereum",
  "nft",
  "metaverse",
  "ar",
  "vr",
  "augmented reality",
  "virtual reality",
  "iot",
  "internet of things",
  "robotics",
  "gadgets",
  "startup",
];

function isTechArticle(item) {
  const title = item.title.toLowerCase();
  const content = (item.contentSnippet || "").toLowerCase();
  return techKeywords.some(
    (keyword) => title.includes(keyword) || content.includes(keyword),
  );
}

async function fetchNews(sourceKeys, topN) {
  const selectedSources = sourceKeys
    .map((key) => ({ key, url: sources[key] }))
    .filter((s) => s.url);

  if (selectedSources.length === 0) {
    throw new Error("Invalid source(s) provided.");
  }

  const allItems = await Promise.all(
    selectedSources.map(async ({ key, url }) => {
      try {
        const feed = await parser.parseURL(url);
        return feed.items.map((item) => ({ ...item, source: key }));
      } catch (err) {
        console.error(`Failed to fetch from ${url}:`, err.message);
        return [];
      }
    }),
  );

  const flattenedItems = allItems.flat();
  const techItems = flattenedItems.filter(isTechArticle);
  techItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return techItems.slice(0, topN);
}

module.exports = { fetchNews, sources };
