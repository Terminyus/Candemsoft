// Finds content spilling out of visible boxes (bordered or filled elements) at several widths.
// Usage: node scripts/overflow.mjs [baseUrl] [paths...]
import { chromium } from "@playwright/test";

const [base = "http://localhost:3000", ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ["/"];
const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const browser = await chromium.launch();
let found = 0;
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.addInitScript(() => localStorage.setItem("cs-notice-v1", "1"));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const issues = await page.evaluate(() => {
      const out = [];
      const boxes = [...document.querySelectorAll("main *, header *, footer *")].filter((el) => {
        const s = getComputedStyle(el);
        if (s.overflowX !== "visible" || s.display === "contents") return false;
        const bordered = parseFloat(s.borderLeftWidth) > 0 && parseFloat(s.borderRightWidth) > 0;
        const filled = s.backgroundColor !== "rgba(0, 0, 0, 0)" && el.getBoundingClientRect().width < innerWidth - 2;
        return bordered || filled;
      });
      for (const box of boxes) {
        const r = box.getBoundingClientRect();
        if (!r.width) continue;
        for (const child of box.querySelectorAll("*")) {
          const c = child.getBoundingClientRect();
          if (!c.width || getComputedStyle(child).position === "absolute") continue;
          if (c.right > r.right + 1.5 || c.left < r.left - 1.5) {
            out.push(`${(child.textContent || child.tagName).trim().slice(0, 30)} ⟶ spills ${Math.round(Math.max(c.right - r.right, r.left - c.left))}px out of <${box.tagName.toLowerCase()} class="${String(box.className).slice(0, 50)}">`);
            break;
          }
        }
      }
      // Text wider than its own box (e.g. an unbreakable word in a shrunk flex item).
      for (const el of document.querySelectorAll("main *, header *, footer *")) {
        if (el instanceof SVGElement) continue; // SVG text boxes don't report scroll sizes meaningfully
        const s = getComputedStyle(el);
        if (s.overflowX !== "visible" || s.display === "inline" || s.display === "contents") continue;
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
          out.push(`"${el.textContent.trim().slice(0, 30)}" ⟶ text ${el.scrollWidth - el.clientWidth}px wider than its box <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}">`);
      }
      return [...new Set(out)].slice(0, 8);
    });
    for (const i of issues) console.log(`${w}px ${p}  ${i}`);
    found += issues.length;
  }
  await page.close();
}
await browser.close();
console.log(found ? `\n${found} overflow(s)` : "No overflow.");
