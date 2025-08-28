const { createObjectCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

function toJson(news) {
  return JSON.stringify(news, null, 2);
}

function toMarkdown(news) {
  return news
    .map(
      (item) =>
        `## [${item.title}](${item.link})\n**Source:** ${item.source} | **Published:** ${item.pubDate}\n**Description:** ${item.contentSnippet.slice(0,200)}...\n`,
    )
    .join('\n');
}

async function toCsv(news, filePath) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'title', title: 'Title' },
      { id: 'link', title: 'Link' },
      { id: 'source', title: 'Source' },
      { id: 'pubDate', title: 'Published' },
      { id: 'contentSnippet', title: 'Snippet' },
    ],
  });

  await csvWriter.writeRecords(news);
  return `CSV file saved to ${filePath}`;
}

async function toPdf(news, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  news.forEach((item) => {
    doc.fontSize(16).text(item.title, { link: item.link, underline: true });
    doc.fontSize(10).text(`Source: ${item.source} | Published: ${item.pubDate}`);
    doc.fontSize(12).text(item.contentSnippet.slice(0, 200) + '...');
    doc.moveDown();
  });

  doc.end();
  return `PDF file saved to ${filePath}`;
}

module.exports = {
  toJson,
  toMarkdown,
  toCsv,
  toPdf,
};
