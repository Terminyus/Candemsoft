import test from "node:test";
import assert from "node:assert/strict";
import { locales, type Locale } from "@/i18n/config";
import { href, switchLocalePath, serviceRouteSlugs } from "@/i18n/routes";
import { v2Root } from "@/lib/static";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
  siteUrl,
} from "@/lib/seo";
import {
  getAllDetailedServices,
  getDetailedServiceForLocale,
  getServiceSlug,
  isValidCanonicalServiceSlug,
  resolveServiceKey,
  serviceKeys,
  serviceSlugs,
  type DetailedService,
} from "@/lib/services";
import { getProjects, getProducts } from "@/lib/content";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function calculateServiceWordCount(service: DetailedService, lang: Locale): number {
  let words = 0;
  words += countWords(service.title[lang]);
  words += countWords(service.lead[lang]);
  words += countWords(service.targetAudience.title[lang]);
  words += countWords(service.targetAudience.description[lang]);
  for (const item of service.targetAudience.items) {
    words += countWords(item.title[lang]);
    words += countWords(item.description[lang]);
  }
  words += countWords(service.process.title[lang]);
  words += countWords(service.process.description[lang]);
  for (const step of service.process.steps) {
    words += countWords(step.title[lang]);
    words += countWords(step.description[lang]);
  }
  words += countWords(service.deliverables.title[lang]);
  words += countWords(service.deliverables.description[lang]);
  for (const item of service.deliverables.items) {
    words += countWords(item.title[lang]);
    words += countWords(item.description[lang]);
  }
  words += countWords(service.technologies.title[lang]);
  words += countWords(service.technologies.description[lang]);
  for (const item of service.faq) {
    words += countWords(item.question[lang]);
    words += countWords(item.answer[lang]);
  }
  for (const sec of service.deepDive.sections) {
    words += countWords(sec.heading[lang]);
    for (const p of sec.paragraphs[lang]) {
      words += countWords(p);
    }
  }
  return words;
}

test("serviceKeys has exactly 5 services with correct keys", () => {
  assert.equal(serviceKeys.length, 5);
  assert.deepEqual([...serviceKeys], ["web", "mobil", "yapay-zeka", "ui-ux", "danismanlik"]);
});

test("service slugs and reverse resolution work in all locales", () => {
  assert.equal(getServiceSlug("web", "tr"), "web-yazilim");
  assert.equal(getServiceSlug("web", "en"), "web-development");
  assert.equal(getServiceSlug("web", "es"), "desarrollo-web");

  assert.equal(getServiceSlug("mobil", "tr"), "mobil-uygulama");
  assert.equal(getServiceSlug("mobil", "en"), "mobile-apps");
  assert.equal(getServiceSlug("mobil", "es"), "desarrollo-movil");

  assert.equal(getServiceSlug("yapay-zeka", "tr"), "yapay-zeka");
  assert.equal(getServiceSlug("yapay-zeka", "en"), "artificial-intelligence");
  assert.equal(getServiceSlug("yapay-zeka", "es"), "inteligencia-artificial");

  assert.equal(getServiceSlug("ui-ux", "tr"), "ui-ux-tasarim");
  assert.equal(getServiceSlug("ui-ux", "en"), "ui-ux-design");
  assert.equal(getServiceSlug("ui-ux", "es"), "diseno-ui-ux");

  assert.equal(getServiceSlug("danismanlik", "tr"), "danismanlik");
  assert.equal(getServiceSlug("danismanlik", "en"), "consulting");
  assert.equal(getServiceSlug("danismanlik", "es"), "consultoria");

  // Reverse lookup
  assert.equal(resolveServiceKey("web-yazilim"), "web");
  assert.equal(resolveServiceKey("web-development"), "web");
  assert.equal(resolveServiceKey("desarrollo-web"), "web");
  assert.equal(resolveServiceKey("mobile-apps"), "mobil");
  assert.equal(resolveServiceKey("artificial-intelligence"), "yapay-zeka");
  assert.equal(resolveServiceKey("ui-ux-design"), "ui-ux");
  assert.equal(resolveServiceKey("consulting"), "danismanlik");
});

test("href generates correct localized service URLs", () => {
  const slash = v2Root ? "/" : "";
  assert.equal(href("tr", "services", "web"), `/hizmetler/web-yazilim${slash}`);
  assert.equal(href("en", "services", "web"), `/en/services/web-development${slash}`);
  assert.equal(href("es", "services", "web"), `/es/servicios/desarrollo-web${slash}`);

  // Passing cross-locale slugs
  assert.equal(href("en", "services", "web-yazilim"), `/en/services/web-development${slash}`);
  assert.equal(href("tr", "services", "desarrollo-web"), `/hizmetler/web-yazilim${slash}`);
  assert.equal(href("es", "services", "mobile-apps"), `/es/servicios/desarrollo-movil${slash}`);
});

test("switchLocalePath correctly maps service URLs between locales", () => {
  const slash = v2Root ? "/" : "";
  assert.equal(
    switchLocalePath("/hizmetler/web-yazilim/", "tr", "en"),
    `/en/services/web-development${slash}`,
  );
  assert.equal(
    switchLocalePath("/en/services/web-development/", "en", "es"),
    `/es/servicios/desarrollo-web${slash}`,
  );
  assert.equal(
    switchLocalePath("/es/servicios/desarrollo-movil/", "es", "tr"),
    `/hizmetler/mobil-uygulama${slash}`,
  );
});

test("JSON-LD builders generate valid schema objects", () => {
  const svc = serviceJsonLd("tr", "Web Yazılım", "Özel web uygulamaları.", `${siteUrl}/hizmetler/web-yazilim/`);
  assert.equal(svc["@context"], "https://schema.org");
  assert.equal(svc["@type"], "Service");
  assert.equal(svc.name, "Web Yazılım");
  assert.equal(svc.inLanguage, "tr-TR");

  const faq = faqJsonLd([
    { question: "Süreç nasıl işler?", answer: "Adım adım analiz ve çevik sprintlerle ilerler." },
  ]);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0]["@type"], "Question");
  assert.equal(faq.mainEntity[0].name, "Süreç nasıl işler?");

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: `${siteUrl}/` },
    { name: "Hizmetler", url: `${siteUrl}/hizmetler/` },
    { name: "Web Yazılım", url: `${siteUrl}/hizmetler/web-yazilim/` },
  ]);
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.equal(breadcrumbs.itemListElement.length, 3);
  assert.equal(breadcrumbs.itemListElement[2].position, 3);
});

test("all detailed service content files exist and fulfill all SEO/word count constraints", () => {
  const services = getAllDetailedServices();
  assert.equal(services.length, 5, `Expected exactly 5 service content files, found ${services.length}`);

  for (const s of services) {
    for (const lang of locales) {
      // 1. Meta title check: <= 60 characters, brand suffix
      const title = s.metaTitle[lang];
      assert.ok(title, `Missing metaTitle for ${s.key} [${lang}]`);
      assert.ok(
        title.length <= 60,
        `metaTitle too long (${title.length} chars) for ${s.key} [${lang}]: "${title}"`,
      );
      assert.ok(
        title.includes("Candemsoft"),
        `metaTitle must include brand for ${s.key} [${lang}]: "${title}"`,
      );

      // 2. Meta description check: 140-160 characters
      const desc = s.metaDescription[lang];
      assert.ok(desc, `Missing metaDescription for ${s.key} [${lang}]`);
      assert.ok(
        desc.length >= 140 && desc.length <= 160,
        `metaDescription length out of bounds (${desc.length} chars) for ${s.key} [${lang}]: "${desc}"`,
      );

      // 3. FAQ count check: 5 to 6 items
      assert.ok(
        s.faq.length >= 5 && s.faq.length <= 6,
        `FAQ count must be 5-6, got ${s.faq.length} for ${s.key}`,
      );

      // 4. Word count check: strictly 600 - 900 words
      const words = calculateServiceWordCount(s, lang);
      assert.ok(
        words >= 600 && words <= 900,
        `Word count for ${s.key} [${lang}] is ${words}, expected 600-900 words`,
      );
    }
  }
});

test("canonical service slug verification rejects cross-locale or non-canonical slugs", () => {
  // Canonical slug for web in tr is web-yazilim, in en is web-development
  assert.equal(isValidCanonicalServiceSlug("web-yazilim", "tr"), true);
  assert.equal(isValidCanonicalServiceSlug("web-yazilim", "en"), false);
  assert.equal(isValidCanonicalServiceSlug("web-development", "tr"), false);
  assert.equal(isValidCanonicalServiceSlug("web-development", "en"), true);
  assert.equal(isValidCanonicalServiceSlug("web", "tr"), false);
  assert.equal(isValidCanonicalServiceSlug("unknown-slug", "tr"), false);

  // getDetailedServiceForLocale
  const trService = getDetailedServiceForLocale("web-yazilim", "tr");
  assert.ok(trService);
  assert.equal(trService?.key, "web");

  // Cross-locale slug returns undefined to prevent duplicate content
  assert.equal(getDetailedServiceForLocale("web-yazilim", "en"), undefined);
  assert.equal(getDetailedServiceForLocale("web-development", "tr"), undefined);
  assert.equal(getDetailedServiceForLocale("web", "tr"), undefined);
});

test("slug mapping synchronization across routes.ts, services.ts, and JSON files", () => {
  const services = getAllDetailedServices();
  for (const s of services) {
    for (const lang of locales) {
      const slugFromJson = s.slug[lang];
      const slugFromServices = getServiceSlug(s.key, lang);
      const slugFromRoutes = serviceRouteSlugs[s.key][lang];
      const slugFromConstant = serviceSlugs[s.key][lang];

      assert.equal(slugFromJson, slugFromServices, `Mismatch for ${s.key}[${lang}] in services.ts`);
      assert.equal(slugFromJson, slugFromRoutes, `Mismatch for ${s.key}[${lang}] in routes.ts`);
      assert.equal(slugFromJson, slugFromConstant, `Mismatch for ${s.key}[${lang}] in serviceSlugs`);
    }
  }
});

test("all relatedProjects and relatedProducts in service JSONs exist in content", () => {
  const projects = getProjects().map((p) => p.slug);
  const products = getProducts().map((p) => p.slug);
  const services = getAllDetailedServices();

  for (const s of services) {
    for (const p of s.relatedProjects) {
      assert.ok(
        projects.includes(p),
        `Service ${s.key} references unknown project "${p}" in relatedProjects (must exist in content/projects/)`,
      );
    }
    for (const pr of s.relatedProducts) {
      assert.ok(
        products.includes(pr),
        `Service ${s.key} references unknown product "${pr}" in relatedProducts (must exist in content/products.json)`,
      );
    }
  }
});
