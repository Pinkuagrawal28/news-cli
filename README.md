# Tech News CLI

A command-line interface to fetch, read, and manage the latest tech news from various sources. Stay updated directly from your terminal!

## ✨ Features

- **News Aggregation:** Fetch headlines from multiple RSS feed sources.
- **In-Terminal Article Reading:** Read full articles directly in your terminal, stripped of clutter.
- **Bookmarking:** Save articles for later reading and easily access them.
- **Source Management:** Add, list, and remove your preferred news sources.
- **Interactive Interface:** Navigate through news and options with user-friendly prompts.

For a detailed list of features, see [Features Documentation](docs/features.md).

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tech-news-cli.git
    cd tech-news-cli
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install the CLI globally (optional, for easy access):**
    ```bash
    npm install -g .
    ```

## 📖 Usage

To start the interactive news reader, run:

```bash
news show
```

This will present you with options to go to your bookmarks, select news sources, or exit.

### Key Commands:

-   `news show`: Start the interactive main menu.
-   `news sources add <name> <url>`: Add a new news source.
-   `news bookmark add <url>`: Bookmark an article.
-   `news bookmark list`: List all your saved bookmarks.

For a complete list of commands and their usage, see [Commands Documentation](docs/commands.md).

## ⚙️ Configuration

You can customize your news sources by editing the `config.json` file. This file contains a list of RSS feeds that the CLI uses to fetch news.

```json
{
  "sources": {
    "techcrunch": "https://techcrunch.com/feed/",
    "ars-technica": "https://arstechnica.com/feed/",
    "wired": "https://www.wired.com/feed/rss",
    "the-verge": "https://www.theverge.com/rss/index.xml",
    "hacker-news": "https://news.ycombinator.com/rss",
    "lobsters": "https://lobste.rs/rss",
    "dev-to": "https://dev.to/feed",
    "smashing-magazine": "https://www.smashingmagazine.com/feed/",
    "a-list-apart": "https://alistapart.com/main/feed/"
  }
}
```

## 📚 Documentation

-   [Commands](docs/commands.md): Detailed usage of all CLI commands.
-   [Features](docs/features.md): In-depth description of all functionalities.
-   [Troubleshooting](docs/troubleshooting.md): Solutions to common issues and errors.

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.