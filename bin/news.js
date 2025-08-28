#!/usr/bin/env node
const { program } = require("commander");
const { fetchNews } = require("../src/fetchNews");
const { listSources, addSource, removeSource } = require("../src/sourceManager");
const displayNews = require("../src/display");
const inquirer = require("inquirer");
const { toJson, toMarkdown, toCsv, toPdf } = require("../src/formatters");

function stripHtml(html) {
  return html ? html.replace(/<[^>]*>?/gm, "") : "";
}

async function mainMenu() {
  const sources = listSources();
  const sourceNames = Object.keys(sources);

  if (sourceNames.length === 0) {
    console.log("No news sources configured. Please add sources using 'news add <name> <url>'.");
    // Allow going to bookmarks even if no sources are configured
  }

  while (true) {
    const initialChoices = [
      { name: "Go to bookmarks", value: "go_to_bookmarks" },
      { name: "Select news sources", value: "select_sources" },
      { name: "Exit", value: "exit" },
    ];

    const { initialAction } = await inquirer.prompt({
      type: "list",
      name: "initialAction",
      message: "What would you like to do?",
      choices: initialChoices,
    });

    if (initialAction === "exit") {
      break;
    } else if (initialAction === "go_to_bookmarks") {
      const bookmarks = await bookmarkManager.listBookmarks();
      if (bookmarks.length === 0) {
        console.log("No bookmarks found.");
      } else {
        console.log("\nYour Bookmarks:");
        bookmarks.forEach((b, index) => {
          console.log(`${index + 1}. ${b.title} - ${b.url} (Bookmarked: ${new Date(b.date).toLocaleDateString()})`);
        });

        const bookmarkChoices = bookmarks.map((b, index) => ({
          name: `${index + 1}. ${b.title}`,
          value: index,
        }));
        bookmarkChoices.push({ name: "Back to main menu", value: "back" });

        const { selectedBookmark } = await inquirer.prompt({
          type: "list",
          name: "selectedBookmark",
          message: "Select a bookmark to open, or go back:",
          choices: bookmarkChoices,
        });

        if (selectedBookmark !== "back") {
          await open(bookmarks[selectedBookmark].url);
        }
      }
    } else if (initialAction === "select_sources") {
      if (sourceNames.length === 0) {
        console.log("No news sources configured. Please add sources using 'news add <name> <url>'.");
        continue; // Go back to initial action prompt
      }

      const { selectedSources } = await inquirer.prompt({
        type: "checkbox",
        name: "selectedSources",
        message: "Select news sources (press space to select, enter to confirm):",
        choices: sourceNames,
      });

      if (selectedSources.length === 0) {
        console.log("No sources selected. Returning to main menu.");
        continue; // Go back to initial action prompt
      }

      try {
        const { items, errors } = await fetchNews(selectedSources);

        if (items.length > 0) {
          await displayNews(items);
        } else {
          console.log("No news articles found for the selected sources.");
        }

        if (errors.length > 0) {
          errors.forEach((error) => console.error(`Error: ${error}`));
        }
      } catch (error) {
        console.error(`Failed to fetch news: ${error.message}`);
      }
    }
  }
}

program
  .command("sources")
  .description("Manage news sources")
  .command("list")
  .description("List all configured news sources")
  .action(() => {
    const currentSources = listSources();
    if (Object.keys(currentSources).length === 0) {
      console.log("No sources configured.");
      return;
    }
    console.log("\nConfigured News Sources:");
    for (const name in currentSources) {
      console.log(`- ${name}: ${currentSources[name]}`);
    }
  });

program
  .command("add <name> <url>")
  .description("Add a new news source")
  .action((name, url) => {
    const result = addSource(name, url);
    console.log(result.message);
  });

program
  .command("remove <name>")
  .description("Remove a news source")
  .action((name) => {
    const result = removeSource(name);
    console.log(result.message);
  });

const readFullArticle = require("../src/readFullArticle");
const bookmarkManager = require("../src/bookmarkManager");

program
  .command("bookmark")
  .description("Manage bookmarked articles")
  .command("add <url>")
    .description("Bookmark an article")
    .action(async (url) => {
      try {
        const article = await readFullArticle(url, true);
        if (article && article.title) {
          const result = await bookmarkManager.addBookmark(url, article.title);
          console.log(result.message);
        } else {
          console.log("Could not retrieve article title for bookmarking.");
        }
      } catch (error) {
        console.error(`Error bookmarking article: ${error.message}`);
      }
    })
  .command("list")
    .description("List all bookmarked articles")
    .action(async () => {
      const bookmarks = await bookmarkManager.listBookmarks();
      if (bookmarks.length === 0) {
        console.log("No bookmarks found.");
        return;
      }
      console.log("\nYour Bookmarks:");
      bookmarks.forEach((b, index) => {
        console.log(`${index + 1}. ${b.title} - ${b.url} (Bookmarked: ${new Date(b.date).toLocaleDateString()})`);
      });
    });

program
  .command("show")
  .description("Show news from selected sources")
  .action(mainMenu);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  mainMenu(); // Start the interactive menu if no commands are given
}