#!/usr/bin/env node
const { program } = require("commander");
const { fetchNews, sources } = require("../src/fetchNews");
const displayNews = require("../src/display");
const inquirer = require("inquirer");
const open = null; // Replaced with dynamic import

program.option("-t, --top <number>", "number of top articles", "5");

program.parse(process.argv);

const options = program.opts();

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, "");
}

async function main() {
  try {
    const sourceChoices = Object.keys(sources).map((key) => ({ name: key, value: key }));
    const sourceAnswers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedSources",
        message: "Select news sources:",
        choices: sourceChoices,
        validate: function (value) {
          if (value.length < 1) {
            return "You must choose at least one source.";
          }
          return true;
        },
      },
    ]);

    const news = await fetchNews(sourceAnswers.selectedSources, parseInt(options.top));

    if (!news.length) {
      console.log("No articles found.");
      return;
    }

    while (true) {
      displayNews(news);

      const choices = news.map((item, index) => ({
        name: `[${index + 1}] ${item.title} (${item.source})`,
        value: index,
      }));
      choices.push({ name: "Exit", value: -1 });

      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "selectedIndex",
          message: "Select an article to open in browser or read in terminal:",
          choices,
        },
      ]);

      if (answers.selectedIndex === -1) {
        break;
      }

      const selectedArticle = news[answers.selectedIndex];

      const actionAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "What would you like to do?",
          choices: [
            { name: "Open in browser", value: "open" },
            { name: "Read in terminal", value: "read" },
            { name: "Back to list", value: "back" },
          ],
        },
      ]);

      if (actionAnswer.action === "open") {
        const {default: open} = await import('open');
        await open(selectedArticle.link);
        break;
      } else if (actionAnswer.action === "read") {
        console.log("\n---\n");
        console.log(stripHtml(selectedArticle.content || ""));
        console.log("\n---\n");
        const backAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "back",
            message: "Press Enter to go back to the list",
            choices: ["Back"],
          },
        ]);
        if (backAnswer.back === "Back") {
          continue;
        }
      } else if (actionAnswer.action === "back") {
        continue;
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
