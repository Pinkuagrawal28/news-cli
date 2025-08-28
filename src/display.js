const { Chalk } = require("chalk");
const inquirer = require("inquirer");
const open = require("open").default;
const readFullArticle = require("./readFullArticle");
const bookmarkManager = require("./bookmarkManager");

const chalk = new Chalk({ level: 2 });

async function displayNews(news) {
  let currentIndex = 0;

  while (true) {
    console.clear();
    console.log(chalk.bold.underline("Tech News Headlines:"));
    news.forEach((item, index) => {
      console.log(
        chalk.green(`[${index + 1}] ${item.title}`)
      );
    });
    console.log("\n");

    const choices = news.map((item, index) => ({
      name: `[${index + 1}] ${item.title}`,
      value: index,
    }));

    choices.push(
      { name: "Back to source selection", value: "back" },
      { name: "Exit", value: "exit" }
    );

    const { selected } = await inquirer.prompt({
      type: "list",
      name: "selected",
      message: "Select a news article to read, or an action:",
      choices: choices,
      pageSize: 15, // Adjust as needed
    });

    if (selected === "back") {
      return; // Go back to source selection in mainMenu
    } else if (selected === "exit") {
      process.exit(0);
    } else {
      currentIndex = selected;
      await displayArticle(news, currentIndex);
    }
  }
}

async function displayArticle(news, index) {
  const item = news[index];
  console.clear();
  console.log(chalk.bold.underline(item.title));
  console.log(chalk.blue(`Source: ${item.source} | Published: ${item.pubDate}`));
  console.log(chalk.yellow(`\n${item.contentSnippet}\n`));
  console.log(chalk.gray(`Link: ${item.link}\n`));

  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Open in browser", value: "open" },
        { name: "Read full article in terminal", value: "read_full" },
        { name: "Add to bookmark", value: "add_bookmark" },
        { name: "Next news", value: "next", disabled: index === news.length - 1 },
        { name: "Previous news", value: "prev", disabled: index === 0 },
        { name: "Back to news list", value: "back" },
      ],
    });

    if (action === "open") {
      await open(item.link);
    } else if (action === "read_full") {
      await readFullArticle(item.link);
      // After reading, prompt again for next action
      // This will loop back to the inquirer prompt
    } else if (action === "add_bookmark") {
      const result = await bookmarkManager.addBookmark(item.link, item.title);
      console.log(chalk.green(result.message));
    } else if (action === "next") {
      await displayArticle(news, index + 1);
      return; // Return to the previous displayArticle call
    } else if (action === "prev") {
      await displayArticle(news, index - 1);
      return; // Return to the previous displayArticle call
    } else if (action === "back") {
      return; // Go back to the news list
    }
  }
}

module.exports = displayNews;