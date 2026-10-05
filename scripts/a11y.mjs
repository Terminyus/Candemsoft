// Runs axe-core (WCAG 2.1 A/AA) on every page at desktop and mobile widths.
// Usage: npm run test:a11y [-- baseUrl]
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const paths = [
  "/", "/hakkimizda", "/hizmetler", "/projeler", "/projeler/kredi-turbo", "/projeler/proox", "/urunler",
  "/ekip", "/blog", "/blog/turkce-buyuk-harf", "/iletisim", "/gizlilik", "/yok-boyle-bir-sayfa",
  "/en", "/en/projects", "/en/contact", "/es", "/es/productos", "/es/proyectos/seyyah",
  "/v2", "/v2/urunler", "/v2/projeler", "/v2/projeler/seyyah", "/v2/hizmetler", "/v2/hakkimizda", "/v2/blog", "/v2/iletisim", "/v2/en", "/v2/es/productos",
];
const browser = await chromium.launch();
let failures = 0;
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 375, height: 812 }]]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of violations) {
      failures++;
      console.log(`✗ [${name}] ${p} — ${v.id} (${v.impact}): ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
    }
  }
  await context.close();
}
await browser.close();
console.log(failures ? `\n${failures} violation(s)` : "No axe violations.");
process.exit(failures ? 1 : 0);
