import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getPostSlugs, getRelatedPosts, parsePostMetaString, getProjects } from "./content";
import { serviceSlugs } from "./services";

const root = path.resolve(process.cwd());
const blogDir = path.join(root, "content", "blog");

const newSlugs = [
  "mobil-uygulama-maliyeti-ve-gelistirme-sureci",
  "ios-app-store-uygulama-yayinlama-rehberi",
  "google-play-yayin-sureci-ve-red-nedenleri",
  "flutter-mi-native-mi-teknoloji-secimi",
  "kucuk-isletmeler-icin-web-sitesi-rehberi",
  "uygulamaya-yapay-zeka-eklemenin-yollari",
  "qr-kod-dijital-kartvizit-ve-arac-etiketi",
  "turkce-karakter-klavye-ve-ocr-sorunlari",
] as const;

test("all 8 new blog posts exist in both TR and EN", () => {
  const trSlugs = getPostSlugs("tr");
  const enSlugs = getPostSlugs("en");

  for (const slug of newSlugs) {
    assert.ok(trSlugs.includes(slug), `Missing TR post: ${slug}`);
    assert.ok(enSlugs.includes(slug), `Missing EN post: ${slug}`);

    const trFile = path.join(blogDir, `${slug}.tr.mdx`);
    const enFile = path.join(blogDir, `${slug}.en.mdx`);

    assert.ok(fs.existsSync(trFile), `File not found: ${trFile}`);
    assert.ok(fs.existsSync(enFile), `File not found: ${enFile}`);
  }
});

test("all 8 new blog posts fulfill strict 800-1200 word count criteria", () => {
  for (const slug of newSlugs) {
    for (const lang of ["tr", "en"] as const) {
      const file = path.join(blogDir, `${slug}.${lang}.mdx`);
      const src = fs.readFileSync(file, "utf8");
      const body = src.replace(/export const meta[\s\S]*?\};/, "").trim();
      const wordCount = body.split(/\s+/).filter(Boolean).length;

      assert.ok(
        wordCount >= 800 && wordCount <= 1200,
        `Post ${slug}.${lang} word count ${wordCount} not in [800, 1200]`,
      );
    }
  }
});

test("all 8 new blog posts have standard introduction format", () => {
  for (const slug of newSlugs) {
    const trSrc = fs.readFileSync(path.join(blogDir, `${slug}.tr.mdx`), "utf8");
    const enSrc = fs.readFileSync(path.join(blogDir, `${slug}.en.mdx`), "utf8");

    assert.ok(
      trSrc.includes("**Kısa cevap:**"),
      `TR post ${slug} must start with **Kısa cevap:**`,
    );
    assert.ok(
      enSrc.includes("**Short answer:**"),
      `EN post ${slug} must start with **Short answer:**`,
    );
  }
});

test("all 8 new blog posts have comprehensive FAQ section with at least 4 questions", () => {
  for (const slug of newSlugs) {
    const trSrc = fs.readFileSync(path.join(blogDir, `${slug}.tr.mdx`), "utf8");
    const enSrc = fs.readFileSync(path.join(blogDir, `${slug}.en.mdx`), "utf8");

    assert.ok(
      trSrc.includes("## Sık sorulan sorular"),
      `TR post ${slug} must contain ## Sık sorulan sorular`,
    );
    assert.ok(
      enSrc.includes("## Frequently asked questions"),
      `EN post ${slug} must contain ## Frequently asked questions`,
    );

    // Count questions (either bold questions **...** or h3 ### questions)
    const countFaqQuestions = (src: string, header: string) => {
      const faqPart = src.split(header)[1] ?? "";
      const boldQuestions = (faqPart.match(/\*\*[^*?]+\?\*\*/g) || []).length;
      const h3Questions = (faqPart.match(/###\s+[^?\n]+\?/g) || []).length;
      return Math.max(boldQuestions, h3Questions);
    };

    const trCount = countFaqQuestions(trSrc, "## Sık sorulan sorular");
    const enCount = countFaqQuestions(enSrc, "## Frequently asked questions");

    assert.ok(trCount >= 4, `TR post ${slug} FAQ must have >= 4 questions, found ${trCount}`);
    assert.ok(enCount >= 4, `EN post ${slug} FAQ must have >= 4 questions, found ${enCount}`);
  }
});

test("all 8 new blog posts have valid internal links to services, projects, or Candemsoft", () => {
  for (const slug of newSlugs) {
    const trSrc = fs.readFileSync(path.join(blogDir, `${slug}.tr.mdx`), "utf8");
    const enSrc = fs.readFileSync(path.join(blogDir, `${slug}.en.mdx`), "utf8");

    assert.ok(
      trSrc.includes("/hizmetler/") || trSrc.includes("/projeler/") || trSrc.includes("candemsoft.com"),
      `TR post ${slug} must include internal links`,
    );
    assert.ok(
      enSrc.includes("/en/services/") || enSrc.includes("/en/projects/") || enSrc.includes("candemsoft.com"),
      `EN post ${slug} must include internal links`,
    );
  }
});

test("all blog post dates are valid ISO dates and author is Candemsoft", () => {
  for (const slug of newSlugs) {
    for (const lang of ["tr", "en"] as const) {
      const file = path.join(blogDir, `${slug}.${lang}.mdx`);
      const src = fs.readFileSync(file, "utf8");

      const dateMatch = src.match(/date:\s*"([^"]+)"/);
      const authorMatch = src.match(/author:\s*"([^"]+)"/);

      assert.ok(dateMatch, `${slug}.${lang} missing date`);
      assert.ok(authorMatch, `${slug}.${lang} missing author`);

      assert.equal(authorMatch[1], "Candemsoft", `${slug}.${lang} author must be Candemsoft`);
      assert.match(dateMatch[1], /^\d{4}-\d{2}-\d{2}$/, `${slug}.${lang} date must be YYYY-MM-DD`);
      assert.ok(dateMatch[1] <= "2026-10-22", `${slug}.${lang} date cannot be in the future`);
    }
  }
});

test("getRelatedPosts returns relevant posts based on common tags", async () => {
  for (const lang of ["tr", "en"] as const) {
    for (const slug of newSlugs) {
      const related = await getRelatedPosts(lang, slug, 3);
      assert.ok(Array.isArray(related), `getRelatedPosts(${lang}, ${slug}) must return an array`);
      assert.ok(related.length > 0 && related.length <= 3, `Expected 1-3 related posts for ${slug}`);
      assert.ok(!related.some((p) => p.slug === slug), `Related posts must not include current post`);
    }
  }
});

test("parsePostMetaString throws clear error on missing, empty, or malformed metadata", () => {
  assert.throws(
    () => parsePostMetaString("const x = 1;", "test.mdx"),
    /Missing meta export in test.mdx/,
  );
  assert.throws(
    () => parsePostMetaString("export const meta = { title: unclosedVar };", "test.mdx"),
    /Failed to evaluate meta export in test.mdx/,
  );
  assert.throws(
    () =>
      parsePostMetaString(
        "export const meta = { description: 'd', date: '2026-10-01', author: 'Candemsoft', tags: ['t'] };",
        "test.mdx",
      ),
    /Missing or invalid 'title' in meta of test.mdx/,
  );
  assert.throws(
    () =>
      parsePostMetaString(
        "export const meta = { title: 't', description: '', date: '2026-10-01', author: 'Candemsoft', tags: ['t'] };",
        "test.mdx",
      ),
    /Missing or invalid 'description' in meta of test.mdx/,
  );
  assert.throws(
    () =>
      parsePostMetaString(
        "export const meta = { title: 't', description: 'd', date: '2026-10-01', author: 'Candemsoft', tags: [] };",
        "test.mdx",
      ),
    /Missing or invalid 'tags' in meta of test.mdx/,
  );

  // Valid multiline string with escaped quotes
  const validMultiline = `
  export const meta = {
    title: "Test Title",
    metaTitle: "Test Meta Title | Candemsoft",
    description: "Line 1 with \\"escaped\\" quotes\\nand a second line for test.",
    date: "2026-10-20",
    author: "Candemsoft",
    tags: ["test", "jest"]
  };
  `;
  const parsed = parsePostMetaString(validMultiline, "valid.mdx");
  assert.equal(parsed.title, "Test Title");
  assert.ok(parsed.description.includes('"escaped"'));
});

test("no fabricated statistics or percentage numbers in any of the 8 new blog posts", () => {
  const percentRegex = /\d+%/;
  const wordPercentRegex = /(yüzde\s+\d+|\d+\s+percent)/i;

  for (const slug of newSlugs) {
    for (const lang of ["tr", "en"] as const) {
      const file = path.join(blogDir, `${slug}.${lang}.mdx`);
      const src = fs.readFileSync(file, "utf8");
      const body = src.replace(/export const meta[\s\S]*?\};/, "");

      assert.ok(
        !percentRegex.test(body),
        `Found forbidden percentage symbol (\\d+%) in ${slug}.${lang}.mdx`,
      );
      assert.ok(
        !wordPercentRegex.test(body),
        `Found forbidden word percentage statistic in ${slug}.${lang}.mdx`,
      );
    }
  }
});

test("all internal markdown links in 8 new posts resolve to valid, existing routes", () => {
  const validProjectSlugs = new Set(getProjects().map((p) => p.slug));
  const validTrServices = new Set(Object.values(serviceSlugs).map((s) => s.tr));
  const validEnServices = new Set(Object.values(serviceSlugs).map((s) => s.en));

  for (const slug of newSlugs) {
    for (const lang of ["tr", "en"] as const) {
      const file = path.join(blogDir, `${slug}.${lang}.mdx`);
      const src = fs.readFileSync(file, "utf8");

      const internalLinks = Array.from(src.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g)).map((m) => m[1]);

      for (const link of internalLinks) {
        assert.ok(link.endsWith("/"), `Internal link ${link} in ${slug}.${lang} must end with /`);

        if (link.startsWith("/hizmetler/")) {
          const serviceSlug = link.replace("/hizmetler/", "").replace(/\/$/, "");
          assert.ok(
            validTrServices.has(serviceSlug) || serviceSlug === "",
            `Invalid TR service link ${link} in ${slug}.${lang}`,
          );
        } else if (link.startsWith("/en/services/")) {
          const serviceSlug = link.replace("/en/services/", "").replace(/\/$/, "");
          assert.ok(
            validEnServices.has(serviceSlug) || serviceSlug === "",
            `Invalid EN service link ${link} in ${slug}.${lang}`,
          );
        } else if (link.startsWith("/projeler/")) {
          const projectSlug = link.replace("/projeler/", "").replace(/\/$/, "");
          assert.ok(
            validProjectSlugs.has(projectSlug) || projectSlug === "",
            `Invalid TR project link ${link} in ${slug}.${lang}`,
          );
        } else if (link.startsWith("/en/projects/")) {
          const projectSlug = link.replace("/en/projects/", "").replace(/\/$/, "");
          assert.ok(
            validProjectSlugs.has(projectSlug) || projectSlug === "",
            `Invalid EN project link ${link} in ${slug}.${lang}`,
          );
        } else {
          const knownPrefixes = ["/blog/", "/en/blog/", "/iletisim/", "/en/contact/"];
          const matchesKnown = knownPrefixes.some((p) => link.startsWith(p)) || link === "/" || link === "/en/";
          assert.ok(matchesKnown, `Unknown internal route ${link} in ${slug}.${lang}`);
        }
      }
    }
  }
});
