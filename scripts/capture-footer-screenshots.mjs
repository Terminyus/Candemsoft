import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const outDir = path.resolve("./out");
const targetDir = process.env.SCREENSHOT_DIR ?? process.argv[2] ?? path.resolve("./screenshots");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

// Create lightweight static file server for ./out with path traversal protection
const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split("?")[0]);
  if (reqPath.endsWith("/")) reqPath += "index.html";

  let filePath = path.join(outDir, reqPath);
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(outDir)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    filePath = path.join(safePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/v2/tr/`;
console.log(`Static server running at ${baseUrl}`);

fs.mkdirSync(targetDir, { recursive: true });

function findChromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  return candidates.find((p) => fs.existsSync(p));
}

const chromePath = findChromePath();
const launchOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
if (chromePath) {
  launchOptions.executablePath = chromePath;
}

const browser = await chromium.launch(launchOptions);

try {
  // 1. Desktop Screenshot (1440x900)
  {
    console.log("Capturing Desktop screenshot...");
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => window.localStorage.setItem("cs-notice-v1", "1"));
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator("footer.cv-auto-footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const desktopFile = path.join(targetDir, "screenshot-desktop.png");
    await footer.screenshot({ path: desktopFile });
    console.log(`Saved desktop screenshot to ${desktopFile}`);

    const socialSec = page.locator("section[aria-labelledby='v2-social-heading']");
    const desktopSocialFile = path.join(targetDir, "screenshot-social-desktop.png");
    await socialSec.screenshot({ path: desktopSocialFile });
    console.log(`Saved desktop social section screenshot to ${desktopSocialFile}`);
    await context.close();
  }

  // 2. Mobile Screenshot (375x812)
  {
    console.log("Capturing Mobile screenshot...");
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => window.localStorage.setItem("cs-notice-v1", "1"));
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator("footer.cv-auto-footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const mobileFile = path.join(targetDir, "screenshot-mobile.png");
    await footer.screenshot({ path: mobileFile });
    console.log(`Saved mobile screenshot to ${mobileFile}`);

    const socialSec = page.locator("section[aria-labelledby='v2-social-heading']");
    const mobileSocialFile = path.join(targetDir, "screenshot-social-mobile.png");
    await socialSec.screenshot({ path: mobileSocialFile });
    console.log(`Saved mobile social section screenshot to ${mobileSocialFile}`);
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log("Screenshots captured successfully!");
