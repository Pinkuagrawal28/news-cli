const fs = require('fs').promises;
const path = require('path');

const BOOKMARKS_FILE = path.join(__dirname, '..', 'bookmarks.json');

async function readBookmarks() {
    try {
        const data = await fs.readFile(BOOKMARKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // File does not exist, return empty array
        }
        throw error;
    }
}

async function writeBookmarks(bookmarks) {
    await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2), 'utf8');
}

async function addBookmark(url, title) {
    const bookmarks = await readBookmarks();
    const existingBookmark = bookmarks.find(b => b.url === url);

    if (existingBookmark) {
        return { success: false, message: 'Article already bookmarked.' };
    }

    const newBookmark = {
        url,
        title,
        date: new Date().toISOString(),
    };

    bookmarks.push(newBookmark);
    await writeBookmarks(bookmarks);
    return { success: true, message: `Bookmarked: "${title}"` };
}

async function listBookmarks() {
    return await readBookmarks();
}

module.exports = {
    addBookmark,
    listBookmarks,
};
