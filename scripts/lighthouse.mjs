// Mobile Lighthouse run over the main pages; fails if any category drops below 90.
// Usage: npm run test:lighthouse [-- baseUrl]   (needs a production build: npm run build && npm start)
// Uses Playwright's Chromium unless CHROME_PATH is set.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const paths = ["/", "/hakkimizda", "/hizmetler", "/projeler", "/projeler/kredi-turbo", "/urunler", "/ekip", "/blog", "/blog/turkce-buyuk-harf", "/iletisim", "/en", "/es", "/es/productos"];
const chrome = process.env.CHROME_PATH ?? chromium.executablePath();
const out = fs.mkdtempSync(path.join(os.tmpdir(), "lh-"));
let failed = false;

for (const p of paths) {
  const file = path.join(out, `${p.replace(/\//g, "_") || "_"}.json`);
  execFileSync(
    "npx",
    ["lighthouse", base + p, "--quiet", "--output=json", `--output-path=${file}`, "--form-factor=mobile",
      "--only-categories=performance,accessibility,best-practices,seo", "--chrome-flags=--headless=new --no-sandbox"],
    { env: { ...process.env, CHROME_PATH: chrome }, stdio: "ignore" },
  );
  const r = JSON.parse(fs.readFileSync(file, "utf8"));
  const scores = Object.values(r.categories).map((c) => [c.id, Math.round(c.score * 100)]);
  const low = scores.filter(([, s]) => s < 90);
  if (low.length) failed = true;
  const a = r.audits;
  console.log(
    `${low.length ? "✗" : "✓"} ${p.padEnd(26)} ${scores.map(([id, s]) => `${id.slice(0, 4)} ${s}`).join("  ")}` +
      `   LCP ${a["largest-contentful-paint"].displayValue}  CLS ${a["cumulative-layout-shift"].displayValue}  TBT ${a["total-blocking-time"].displayValue}`,
  );
}
process.exit(failed ? 1 : 0);
