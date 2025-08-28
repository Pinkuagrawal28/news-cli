# Troubleshooting

This document provides solutions to common issues you might encounter while using the Tech News CLI.

## "fetch is not a function" error

This error typically indicates an issue with the `node-fetch` library or your Node.js environment. While recent versions of Node.js have native `fetch` support, this CLI uses `node-fetch` for broader compatibility.

**Solution:**

1.  **Reinstall dependencies:** Sometimes, `node_modules` can become corrupted. Try reinstalling all project dependencies:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

2.  **Node.js Version:** Ensure you are using a compatible Node.js version. While the CLI aims for broad compatibility, very old Node.js versions might not support certain features or libraries.

## "Error: cannot add command '...' as already have command '...'

This error indicates a misconfiguration in the command-line interface definition (using `commander.js`). It means a command or subcommand has been defined more than once at the same level.

**Solution:**

This is typically an internal error that should have been resolved during development. If you encounter this, please report it as a bug, providing the full error message and steps to reproduce.

## "SyntaxError: Unexpected token '...'

This error points to a syntax mistake in the JavaScript code, such as a missing parenthesis, brace, or an incorrect keyword usage.

**Solution:**

This is an internal error. Please report it as a bug, providing the full error message and steps to reproduce.

## Article content not clean or contains unwanted elements

While the CLI uses a readability library to extract the main article content, some websites might have unique HTML structures that are not perfectly handled.

**Solution:**

-   **Report the issue:** If you consistently find a specific website's articles are not being cleaned properly, please report it as a bug, providing the URL of the problematic article. This helps in improving the article extraction logic.
-   **Manual Cleanup:** For immediate use, you might need to manually copy and paste the relevant text from the browser.

## No news sources configured

When you first run `news show` or try to fetch news without adding any sources, you will see this message.

**Solution:**

-   **Add a news source:** Use the `news add <name> <url>` command to add your desired RSS feed sources. For example:
    ```bash
    news add techcrunch https://techcrunch.com/feed/
    ```

## Bookmarks not saving or listing

This could be due to file permission issues or corruption of the `bookmarks.json` file.

**Solution:**

-   **Check file permissions:** Ensure the CLI has write access to the directory where `bookmarks.json` is stored (usually the project root).
-   **Report as bug:** If the issue persists, it might indicate a bug in the bookmark management logic. Please report it with details.
