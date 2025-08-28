# Commands

This document outlines all the available commands for the Tech News CLI.

## `news show`

Starts the interactive main menu. From here, you can:
- Go to bookmarks
- Select news sources to fetch headlines
- Exit the application

**Usage:**
```bash
news show
```

## `news sources`

Manage your news sources.

### `news sources list`

Lists all currently configured news sources.

**Usage:**
```bash
news sources list
```

### `news add <name> <url>`

Adds a new news source.

- `<name>`: A unique name for your news source (e.g., `techcrunch`, `reuters`).
- `<url>`: The RSS feed URL for the news source.

**Usage:**
```bash
news add techcrunch https://techcrunch.com/feed/
```

### `news remove <name>`

Removes an existing news source.

- `<name>`: The name of the news source to remove.

**Usage:**
```bash
news remove techcrunch
```

## `news bookmark`

Manage your bookmarked articles.

### `news bookmark add <url>`

Bookmarks an article for later reading. The CLI will attempt to fetch the article's title automatically.

- `<url>`: The URL of the article to bookmark.

**Usage:**
```bash
news bookmark add https://techcrunch.com/2025/08/27/maisa-ai-gets-25m-to-fix-enterprise-ais-95-failure-rate/
```

### `news bookmark list`

Lists all your saved bookmarks. From this list, you can choose to open a bookmarked article in your browser.

**Usage:**
```bash
news bookmark list
```
