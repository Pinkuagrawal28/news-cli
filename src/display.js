// src/display.js
const {Chalk} = require("chalk");

const chalk = new Chalk({level: 2});

function displayNews(news) {
  news.forEach((item, index) => {
    console.log(chalk.green(`[${index + 1}] ${item.title}`));
    console.log(
      chalk.blue(`   Source: ${item.source} | Published: ${item.pubDate}`),
    );
    console.log(chalk.yellow(`   Description: ${item.contentSnippet.slice(0, 200)}...`));
    console.log(`   ${item.link}\n`);
  });
}

module.exports = displayNews;
