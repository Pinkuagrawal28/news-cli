const fetch = require("node-fetch").default;
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const { Chalk } = require("chalk");

const chalk = new Chalk({ level: 2 });

async function readFullArticle(url, returnArticleOnly = false) {
    try {
        console.log(chalk.blue(`Fetching full article from: ${url}`));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        // Parse HTML with JSDOM
        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        console.clear();

        if (article && article.textContent) {
            if (returnArticleOnly) {
                return article;
            }

            console.log(chalk.bold(article.title));
            const cleanedText = article.textContent
                .split('\n') // Split by newline
                .map(line => line.trim()) // Trim each line
                .filter(line => line.length > 0) // Remove empty lines
                .join('\n\n'); // Join with double newline for paragraphs

            console.log('\n' + cleanedText);
            console.log(chalk.gray(`\n--- End of article from ${url} ---`));
            return article; // Also return article when printing, in case it's useful
        } else {
            console.log(chalk.red("Could not extract article content."));
            return null; // Return null if content extraction fails
        }

    } catch (error) {
        console.error(chalk.red(`Error reading full article: ${error.message}`));
        return null; // Return null on error
    }
}

module.exports = readFullArticle;