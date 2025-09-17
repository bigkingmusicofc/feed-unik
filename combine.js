const Parser = require("rss-parser");
const fs = require("fs");

const parser = new Parser();

// daftar feed unik
const feeds = [
  "https://en.wikipedia.org/w/api.php?action=featuredfeed&feed=didyouknow&feedformat=rss",
  "https://www.ripleys.com/feed/",
  "https://www.nationalgeographic.com/feeds/weird.rss",
  "https://www.livescience.com/feeds/all",
  "https://listverse.com/bizarre/feed/",
  "https://futurism.com/rss",
  "https://www.mentalfloss.com/rss.xml"
];

(async () => {
  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      items = items.concat(feed.items);
    } catch (e) {
      console.error("Gagal ambil feed:", url, e.message);
    }
  }

  // urutkan berdasarkan tanggal terbaru
  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // bikin RSS gabungan
  const rss =
    `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
    <channel>
      <title>Fakta Unik Aggregator</title>
      <link>https://yourgithubusername.github.io/feed-unik/</link>
      <description>Gabungan Fakta Unik Dunia</description>` +
    items
      .map(
        (item) => `
      <item>
        <title><![CDATA[${item.title}]]></title>
        <link>${item.link}</link>
        <pubDate>${item.pubDate}</pubDate>
        <description><![CDATA[${item.contentSnippet || ""}]]></description>
      </item>`
      )
      .join("\n") +
    `
    </channel>
    </rss>`;

  fs.writeFileSync("public/feed.xml", rss);
})();
