const fs = require("fs");
const path = require("path");

const root = process.cwd();
const required = [
  "index.html",
  "styles.css",
  "script.js",
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  "public/brand/heart.png",
  "public/screenshots/dashboard-home.png",
  "public/screenshots/object-details.png",
  "public/screenshots/api-explorer.png",
  "public/social/og-image.png"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing required static files:\n${missing.join("\n")}`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const forbidden = ["/_next/", "src=\"/public/", "href=\"/styles.css", "src=\"/script.js"];
const found = forbidden.filter((value) => html.includes(value));
if (found.length) {
  console.error(`index.html contains non-file-friendly paths:\n${found.join("\n")}`);
  process.exit(1);
}

console.log("Static site files are present and file-friendly.");
