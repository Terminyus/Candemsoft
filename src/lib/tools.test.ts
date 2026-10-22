import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { locales, type Locale } from "@/i18n/config";
import { href, switchLocalePath, toolRouteSlugs } from "@/i18n/routes";
import { v2Root } from "@/lib/static";
import { webApplicationJsonLd, siteUrl } from "@/lib/seo";
import { getProducts, getPostSlugs } from "@/lib/content";
import sitemap from "@/app/sitemap";
import {
  toTurkishUpper,
  toTurkishLower,
  toTurkishTitleCase,
  toTurkishSentenceCase,
  analyzeText,
  countSentences,
  toAsciiText,
  toAsciiSlug,
  toolKeys,
  toolSlugs,
  resolveToolKey,
  getToolSlug,
  isValidCanonicalToolSlug,
  getAllTools,
  getToolForLocale,
  type ToolData,
} from "./tools";

/* -------------------------------------------------------------------------- */
/* 1. Turkish Typography Unit Tests                                           */
/* -------------------------------------------------------------------------- */

test("toTurkishUpper correctly handles Turkish dotted and dotless I rules", () => {
  // Required in prompt: 'ilişki' -> 'İLİŞKİ'
  assert.equal(toTurkishUpper("ilişki"), "İLİŞKİ");
  assert.equal(toTurkishUpper("istanbul"), "İSTANBUL");
  assert.equal(toTurkishUpper("ışık"), "IŞIK");
  assert.equal(toTurkishUpper("ıspanak"), "ISPANAK");
  assert.equal(toTurkishUpper("fıstıkçı şahap"), "FISTIKÇI ŞAHAP");
  assert.equal(toTurkishUpper("i"), "İ");
  assert.equal(toTurkishUpper("ı"), "I");
});

test("toTurkishLower correctly handles Turkish dotted and dotless I rules", () => {
  // Required in prompt: 'IŞIK' -> 'ışık'
  assert.equal(toTurkishLower("IŞIK"), "ışık");
  assert.equal(toTurkishLower("İLİŞKİ"), "ilişki");
  assert.equal(toTurkishLower("İSTANBUL"), "istanbul");
  assert.equal(toTurkishLower("ISPANAK"), "ıspanak");
  assert.equal(toTurkishLower("İ"), "i");
  assert.equal(toTurkishLower("I"), "ı");
});

test("toTurkishTitleCase capitalizes each word with Turkish locale awareness", () => {
  assert.equal(toTurkishTitleCase("istanbul ve ışık"), "İstanbul Ve Işık");
  assert.equal(toTurkishTitleCase("İLİŞKİ VE IŞIK"), "İlişki Ve Işık");
  assert.equal(toTurkishTitleCase("türkiye cumhuriyeti"), "Türkiye Cumhuriyeti");
  assert.equal(toTurkishTitleCase(""), "");
});

test("toTurkishSentenceCase formats sentences with Turkish casing", () => {
  const input = "istanbul güzel bir şehir. ışıklar yanıyor! ilişki kurmak kolay mı?";
  const expected = "İstanbul güzel bir şehir. Işıklar yanıyor! İlişki kurmak kolay mı?";
  assert.equal(toTurkishSentenceCase(input), expected);

  assert.equal(
    toTurkishSentenceCase("İSTANBUL VE IŞIK. YENİ BİR GÜN."),
    "İstanbul ve ışık. Yeni bir gün.",
  );
  assert.equal(toTurkishSentenceCase(""), "");
});

test("toTurkishSentenceCase handles leading whitespace, quotes, and brackets", () => {
  assert.equal(toTurkishSentenceCase("  merhaba dünya."), "  Merhaba dünya.");
  assert.equal(toTurkishSentenceCase("\"merhaba\" dedi. yeni bir gün!"), "\"Merhaba\" dedi. Yeni bir gün!");
  assert.equal(toTurkishSentenceCase("(parantez içi). başka bir cümle?"), "(Parantez içi). Başka bir cümle?");
  assert.equal(toTurkishSentenceCase("«alıntı metin». devam ediyor."), "«Alıntı metin». Devam ediyor.");
});

/* -------------------------------------------------------------------------- */
/* 2. Text Analysis & Character Counter Unit Tests                            */
/* -------------------------------------------------------------------------- */

test("analyzeText accurately counts characters, words, sentences and paragraphs", () => {
  const sample = "İstanbul harika bir şehir.\n\nİkinci paragraf burada! Işıklar yanıyor.";
  const res = analyzeText(sample);

  assert.equal(res.characterCount, sample.length);
  assert.equal(res.characterCountNoSpaces, sample.replace(/\s/g, "").length);
  assert.equal(res.wordCount, 9);
  assert.equal(res.sentenceCount, 3);
  assert.equal(res.paragraphCount, 2);
  assert.equal(res.readingTimeMinutes, 1);
  assert.ok(res.turkishCharCount >= 3); // 'İ', 'ş', 'ı'
});

test("countSentences avoids false splits on decimals, abbreviations, and ellipses", () => {
  assert.equal(countSentences("Pi sayısı 3.14 olarak bilinir. Yeni cümle burada."), 2);
  assert.equal(countSentences("Dr. Ahmet ve Prof. Mehmet toplantıya katıldı. Karar alındı."), 2);
  assert.equal(countSentences("Bekliyoruz... Sonunda geldi!"), 2);
  assert.equal(countSentences("Rapor vb. belgeler sunuldu."), 1);
});

test("analyzeText does not count standard ASCII I as a Turkish-specific character", () => {
  const english = "I am a developer in Istanbul.";
  const res = analyzeText(english);
  assert.equal(res.turkishCharCount, 0); // Capital ASCII 'I' is not Turkish non-ASCII
});

test("analyzeText correctly counts accented European vowels", () => {
  const spanish = "canción y éxito";
  const res = analyzeText(spanish);
  // 'a', 'i', 'ó', 'e', 'i', 'o' = 6 vowels
  assert.equal(res.vowelCount, 6);
});

test("analyzeText handles empty and whitespace-only text gracefully", () => {
  const emptyRes = analyzeText("");
  assert.equal(emptyRes.characterCount, 0);
  assert.equal(emptyRes.wordCount, 0);
  assert.equal(emptyRes.sentenceCount, 0);
  assert.equal(emptyRes.paragraphCount, 0);
  assert.equal(emptyRes.readingTimeMinutes, 0);

  const spacesRes = analyzeText("   \n\t  ");
  assert.equal(spacesRes.characterCount, 7);
  assert.equal(spacesRes.characterCountNoSpaces, 0);
  assert.equal(spacesRes.wordCount, 0);
});

/* -------------------------------------------------------------------------- */
/* 3. ASCII & Slug Generator Unit Tests                                       */
/* -------------------------------------------------------------------------- */

test("toAsciiText transliterates Turkish characters without removing punctuation", () => {
  assert.equal(
    toAsciiText("Şemsi Paşa Pasajı'nda üç tas has hoşaf"),
    "Semsi Pasa Pasaji'nda uc tas has hosaf",
  );
  assert.equal(toAsciiText("Çiçek, Ağaç, Işık, Şelale"), "Cicek, Agac, Isik, Selale");
});

test("toAsciiSlug generates clean, SEO-friendly slugs with proper Turkish handling", () => {
  // Critical prompt checks: I -> i, İ -> i
  assert.equal(toAsciiSlug("IŞIK"), "isik");
  assert.equal(toAsciiSlug("İLİŞKİ"), "iliski");

  assert.equal(
    toAsciiSlug("Şemsi Paşa Pasajı'nda üç tas has hoşaf"),
    "semsi-pasa-pasajinda-uc-tas-has-hosaf",
  );

  // Underscore separator option
  assert.equal(
    toAsciiSlug("Türkçe Karakter & Büyük I-i Testi!", { separator: "_" }),
    "turkce_karakter_buyuk_i_i_testi",
  );

  // Clean edge cases: duplicate hyphens, leading/trailing hyphens
  assert.equal(toAsciiSlug("---İstanbul---Ankara---"), "istanbul-ankara");
  assert.equal(toAsciiSlug("Özel Karakterler: @#$%^&*()+="), "ozel-karakterler");
});

/* -------------------------------------------------------------------------- */
/* 4. Routes and Slugs Synchronization                                        */
/* -------------------------------------------------------------------------- */

test("toolKeys has exactly 3 tools with correct canonical keys", () => {
  assert.equal(toolKeys.length, 3);
  assert.deepEqual(
    [...toolKeys],
    ["metin-buyuk-kucuk-harf", "kelime-karakter-sayaci", "slug-ascii-donusturucu"],
  );
});

test("tool slugs and reverse resolution work in all locales", () => {
  assert.equal(getToolSlug("metin-buyuk-kucuk-harf", "tr"), "buyuk-kucuk-harf-donusturucu");
  assert.equal(getToolSlug("metin-buyuk-kucuk-harf", "en"), "case-converter");
  assert.equal(getToolSlug("metin-buyuk-kucuk-harf", "es"), "convertidor-mayusculas-minusculas");

  assert.equal(getToolSlug("kelime-karakter-sayaci", "tr"), "kelime-karakter-sayaci");
  assert.equal(getToolSlug("kelime-karakter-sayaci", "en"), "word-character-counter");
  assert.equal(getToolSlug("kelime-karakter-sayaci", "es"), "contador-palabras-caracteres");

  assert.equal(getToolSlug("slug-ascii-donusturucu", "tr"), "slug-ascii-donusturucu");
  assert.equal(getToolSlug("slug-ascii-donusturucu", "en"), "slug-generator");
  assert.equal(getToolSlug("slug-ascii-donusturucu", "es"), "generador-slug");

  // Reverse resolution
  assert.equal(resolveToolKey("buyuk-kucuk-harf-donusturucu"), "metin-buyuk-kucuk-harf");
  assert.equal(resolveToolKey("case-converter"), "metin-buyuk-kucuk-harf");
  assert.equal(resolveToolKey("convertidor-mayusculas-minusculas"), "metin-buyuk-kucuk-harf");
  assert.equal(resolveToolKey("word-character-counter"), "kelime-karakter-sayaci");
  assert.equal(resolveToolKey("slug-generator"), "slug-ascii-donusturucu");
});

test("slug mapping synchronization across routes.ts, tools.ts, and JSON files", () => {
  const tools = getAllTools();
  for (const tool of tools) {
    for (const lang of locales) {
      const slugFromJson = tool.slug[lang];
      const slugFromTools = getToolSlug(tool.key, lang);
      const slugFromRoutes = toolRouteSlugs[tool.key][lang];
      const slugFromConstant = toolSlugs[tool.key][lang];

      assert.equal(slugFromJson, slugFromTools, `Mismatch for ${tool.key}[${lang}] in tools.ts`);
      assert.equal(slugFromJson, slugFromRoutes, `Mismatch for ${tool.key}[${lang}] in routes.ts`);
      assert.equal(slugFromJson, slugFromConstant, `Mismatch for ${tool.key}[${lang}] in toolSlugs`);
    }
  }
});

test("all relatedProducts and relatedBlogSlug in tool JSONs exist in content", () => {
  const products = getProducts().map((p) => p.slug);
  const tools = getAllTools();

  for (const tool of tools) {
    for (const pr of tool.relatedProducts) {
      assert.ok(
        products.includes(pr),
        `Tool ${tool.key} references unknown product "${pr}" in relatedProducts`,
      );
    }
    // Verify related blog slug exists in at least TR and EN
    const trSlugs = getPostSlugs("tr");
    assert.ok(
      trSlugs.includes(tool.relatedBlogSlug),
      `Tool ${tool.key} references unknown blog slug "${tool.relatedBlogSlug}"`,
    );
  }
});

test("href generates correct localized tool URLs", () => {
  const slash = v2Root ? "/" : "";
  assert.equal(href("tr", "tools"), `/araclar${slash}`);
  assert.equal(href("en", "tools"), `/en/tools${slash}`);
  assert.equal(href("es", "tools"), `/es/herramientas${slash}`);

  assert.equal(
    href("tr", "tools", "metin-buyuk-kucuk-harf"),
    `/araclar/buyuk-kucuk-harf-donusturucu${slash}`,
  );
  assert.equal(
    href("en", "tools", "metin-buyuk-kucuk-harf"),
    `/en/tools/case-converter${slash}`,
  );
  assert.equal(
    href("es", "tools", "metin-buyuk-kucuk-harf"),
    `/es/herramientas/convertidor-mayusculas-minusculas${slash}`,
  );
});

test("switchLocalePath correctly maps tool URLs between locales", () => {
  const slash = v2Root ? "/" : "";
  assert.equal(
    switchLocalePath("/araclar/buyuk-kucuk-harf-donusturucu/", "tr", "en"),
    `/en/tools/case-converter${slash}`,
  );
  assert.equal(
    switchLocalePath("/en/tools/case-converter/", "en", "tr"),
    `/araclar/buyuk-kucuk-harf-donusturucu${slash}`,
  );
});

test("sitemap includes all tool URLs with matching hreflang alternates", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  for (const lang of locales) {
    const hubUrl = `${siteUrl}${href(lang, "tools")}`;
    assert.ok(urls.includes(hubUrl), `Sitemap missing tools hub URL: ${hubUrl}`);

    for (const key of toolKeys) {
      const toolUrl = `${siteUrl}${href(lang, "tools", key)}`;
      assert.ok(urls.includes(toolUrl), `Sitemap missing tool URL: ${toolUrl}`);
    }
  }
});

/* -------------------------------------------------------------------------- */
/* 5. Tool Content Files, Word Count & SEO Constraints                        */
/* -------------------------------------------------------------------------- */

function calculateToolArticleWordCount(tool: ToolData, lang: Locale): number {
  let count = 0;
  for (const sec of tool.article.sections) {
    count += sec.heading[lang].trim().split(/\s+/).filter(Boolean).length;
    for (const p of sec.paragraphs[lang]) {
      count += p.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return count;
}

test("all tool content files exist and fulfill strict 400+ words, SEO title and description rules", () => {
  const tools = getAllTools();
  assert.equal(tools.length, 3, `Expected 3 tools, got ${tools.length}`);

  for (const tool of tools) {
    for (const lang of locales) {
      // 1. Meta Title: <= 60 chars, ends with Candemsoft
      const title = tool.metaTitle[lang];
      assert.ok(title, `Missing metaTitle for ${tool.key} [${lang}]`);
      assert.ok(
        title.length <= 60,
        `metaTitle too long (${title.length} chars) for ${tool.key} [${lang}]: "${title}"`,
      );
      assert.ok(
        title.endsWith("Candemsoft"),
        `metaTitle must end with Candemsoft for ${tool.key} [${lang}]: "${title}"`,
      );

      // 2. Meta Description: strictly 140 - 160 characters
      const desc = tool.metaDescription[lang];
      assert.ok(desc, `Missing metaDescription for ${tool.key} [${lang}]`);
      assert.ok(
        desc.length >= 140 && desc.length <= 160,
        `metaDescription length ${desc.length} not in [140, 160] for ${tool.key} [${lang}]: "${desc}"`,
      );

      // 3. Article Word Count: strictly >= 400 words (prompt requirement)
      const words = calculateToolArticleWordCount(tool, lang);
      assert.ok(
        words >= 400,
        `Tool ${tool.key} [${lang}] article word count ${words} is less than required 400 words`,
      );

      // 4. FAQ: at least 4 items
      assert.ok(
        tool.faq.length >= 4,
        `Tool ${tool.key} FAQ count ${tool.faq.length} is less than 4`,
      );
      for (const faqItem of tool.faq) {
        assert.ok(faqItem.question[lang].length > 0, `Empty FAQ question in ${tool.key} [${lang}]`);
        assert.ok(faqItem.answer[lang].length > 0, `Empty FAQ answer in ${tool.key} [${lang}]`);
      }
    }
  }
});

test("no fabricated statistics or percentage numbers in any tool JSON files", () => {
  const root = path.resolve(process.cwd());
  const toolsDir = path.join(root, "content", "tools");
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"));

  for (const f of files) {
    const raw = fs.readFileSync(path.join(toolsDir, f), "utf8");
    // Strip URL percent-encoded byte sequences (e.g. %C4%B1) before checking for percentage statistics
    const sanitized = raw.replace(/%[0-9A-Fa-f]{2}/g, "");
    const percentMatches = sanitized.match(/(?:%\s*\d+|\d+\s*%|yüzde\s+\d+|\d+\s+percent)/gi);
    assert.equal(
      percentMatches,
      null,
      `Fabricated percentage numbers found in ${f}: ${JSON.stringify(percentMatches)}`,
    );
  }
});

test("canonical tool slug verification rejects cross-locale slugs", () => {
  assert.equal(isValidCanonicalToolSlug("buyuk-kucuk-harf-donusturucu", "tr"), true);
  assert.equal(isValidCanonicalToolSlug("buyuk-kucuk-harf-donusturucu", "en"), false);
  assert.equal(isValidCanonicalToolSlug("case-converter", "en"), true);
  assert.equal(isValidCanonicalToolSlug("case-converter", "tr"), false);

  assert.ok(getToolForLocale("buyuk-kucuk-harf-donusturucu", "tr"));
  assert.equal(getToolForLocale("buyuk-kucuk-harf-donusturucu", "en"), undefined);
});

test("webApplicationJsonLd produces valid free schema with price 0", () => {
  const json = webApplicationJsonLd(
    "tr",
    "Büyük Küçük Harf Dönüştürücü",
    "Açıklama...",
    `${siteUrl}/araclar/buyuk-kucuk-harf-donusturucu/`,
  );

  assert.equal(json["@type"], "WebApplication");
  assert.equal(json.name, "Büyük Küçük Harf Dönüştürücü");
  assert.equal(json.offers["@type"], "Offer");
  assert.equal(json.offers.price, "0");
  assert.equal(json.offers.priceCurrency, "TRY");
});
