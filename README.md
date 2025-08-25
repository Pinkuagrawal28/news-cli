# Tech News CLI

A command-line interface to fetch and read the latest tech news from various sources.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/tech-news-cli.git
   cd tech-news-cli
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Install the CLI globally (optional, for easy access):
   ```sh
   npm install -g .
   ```

## Usage

Run the CLI with the following command:

```sh
news
```

This will prompt you to select the news sources you want to fetch from.

### Options

- `-t, --top <number>`: Specify the number of top articles to fetch (default: 5).

  Example:
  ```sh
  news --top 10
  ```

## Configuration

You can customize the news sources by editing the `config.json` file. This file contains a list of RSS feeds that the CLI uses to fetch news.

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

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
