// Captures desktop and mobile screenshots of every live project in content/projects
// and writes them as WebP to public/projects/<slug>/{desktop,mobile}.webp.
//
// Usage: npm run capture:projects [-- slug1 slug2]
//
// Always review the output: a site can respond 200 with a parking page,
// a hosting error or a bot check. If so, set "status": "offline" in its JSON.
//
// Cookie/consent banners are hidden with CSS, never accepted.
import { chromium } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "content/projects");
const only = process.argv.slice(2);
// Projects marked "offline" are skipped: never publish a parked domain or error page as our work.
const projects = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
  .filter((p) => p.status !== "offline")
  .filter((p) => !only.length || only.includes(p.slug));

const hideBanners = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], [id*="kvkk" i], [class*="kvkk" i],
  #CybotCookiebotDialog, .cc-window, .fc-consent-root, iframe[src*="consent"],
  [class*="whatsapp" i][style*="fixed"], .grecaptcha-badge { display: none !important; }
  * { caret-color: transparent !important; }
`;

const shots = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, out: { width: 1440 } },
  mobile: {
    viewport: { width: 390, height: 693 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    out: { width: 780 },
  },
};

const browser = await chromium.launch();
const report = [];
for (const project of projects) {
  const outDir = path.join(root, "public/projects", project.slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, { out, ...opts }] of Object.entries(shots)) {
    const context = await browser.newContext({ ...opts, locale: "tr-TR", reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await page.goto(project.url, { waitUntil: "load", timeout: 45000 });
      await page.addStyleTag({ content: hideBanners }).catch(() => {});
      // Nudge lazy-loaded content, then return to the top.
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight / 3);
        await new Promise((r) => setTimeout(r, 600));
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3500); // let entrance animations finish
      const png = await page.screenshot({ type: "png" });
      const file = path.join(outDir, `${name}.webp`);
      await sharp(png).resize(out).webp({ quality: 78 }).toFile(file);
      report.push(`ok    ${project.slug}/${name}`);
    } catch (e) {
      report.push(`FAIL  ${project.slug}/${name}: ${e.message.split("\n")[0]}`);
    }
    await context.close();
  }
}
await browser.close();
console.log(report.join("\n"));
