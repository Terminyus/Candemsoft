// Captures desktop + mobile screenshots of the local site for stage reviews.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [paths...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3000", out = "screenshots", ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ["/", "/projeler", "/en"];
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812, isMobile: true, deviceScaleFactor: 2 },
};

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const [name, vp] of Object.entries(viewports)) {
  const { isMobile, deviceScaleFactor, ...viewport } = vp;
  const context = await browser.newContext({ viewport, isMobile, deviceScaleFactor, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    const file = path.join(out, `${p === "/" ? "home" : p.slice(1).replace(/\//g, "_")}-${name}.jpg`);
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 70 });
    console.log(file);
  }
  await context.close();
}
await browser.close();
