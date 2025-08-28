const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const path = require("path");

const generateDescription = require('./generateDescription');

const configPath = path.resolve(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const { sources } = config;

async function fetchNews(sourceKeys, topN, searchKeywords) {
  const selectedSources = sourceKeys
    .map((key) => ({ key, url: sources[key] }))
    .filter((s) => s.url);

  if (selectedSources.length === 0) {
    throw new Error("Invalid source(s) provided.");
  }

  const results = await Promise.all(
    selectedSources.map(async ({ key, url }) => {
      const startTime = Date.now();
      try {
        const feed = await parser.parseURL(url);
        const duration = Date.now() - startTime;
        console.log(`Fetched ${key} from ${url} in ${duration}ms`);
        if (!feed.items || feed.items.length === 0) {
          return { items: [], error: `No articles found for ${key} from ${url}` };
        }

        const processedItems = await Promise.all(feed.items.map(async (item) => {
            const originalSnippet = item.contentSnippet || item.summary || item.description || item.title;
            const generatedSnippet = await generateDescription(originalSnippet);
            return { ...item, source: key, contentSnippet: generatedSnippet };
        }));

        return { items: processedItems, error: null };
      } catch (err) {
        const duration = Date.now() - startTime;
        console.error(`Failed to fetch from ${url} after ${duration}ms:`, err.message);
        return { items: [], error: `Failed to fetch from ${key} (${url}): ${err.message}` };
      }
    }),
  );

  let flattenedItems = results.flatMap(result => result.items);
  const errors = results.map(result => result.error).filter(Boolean);

  if (searchKeywords) {
    const keywords = searchKeywords.toLowerCase().split(",").map(k => k.trim());
    flattenedItems = flattenedItems.filter(item => {
        const title = item.title.toLowerCase();
        const content = (item.contentSnippet || "").toLowerCase();
        return keywords.some(keyword => title.includes(keyword) || content.includes(keyword));
    });
  }

  flattenedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return { items: flattenedItems.slice(0, topN), errors };
}

module.exports = { fetchNews, sources };