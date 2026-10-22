import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  pageMetadata,
  siteUrl,
  organizationJsonLd,
  breadcrumbJsonLd,
  breadcrumbLabel,
  pageBreadcrumbs,
  articleJsonLd,
  softwareJsonLd,
  mergeJsonLd,
} from "./seo";
import {
  publicFileExists,
  getProjects,
  getProducts,
  getPostMeta,
  getPostFaqs,
} from "./content";
import { localeTags } from "@/i18n/config";
import type { RouteKey } from "@/i18n/routes";

const root = path.resolve(process.cwd());
const locales = ["tr", "en", "es"] as const;

// -------------------------------------------------------------
// 1. pageMetadata & image fallback / security unit tests
// -------------------------------------------------------------

test("pageMetadata sets absolute title and matching og:image:alt", () => {
  const meta = pageMetadata({
    lang: "tr",
    route: "home",
    title: "Web ve Mobil Uygulama Geliştirme İstanbul | Candemsoft",
    description: "Örnek meta açıklama metni...",
  });

  assert.deepEqual(meta.title, { absolute: "Web ve Mobil Uygulama Geliştirme İstanbul | Candemsoft" });
  assert.equal(meta.description, "Örnek meta açıklama metni...");
  assert.equal(meta.openGraph?.title, "Web ve Mobil Uygulama Geliştirme İstanbul | Candemsoft");

  const ogImages = meta.openGraph?.images as Array<{ url: string; alt?: string }>;
  assert.ok(Array.isArray(ogImages) && ogImages.length > 0);
  assert.equal(ogImages[0].alt, "Web ve Mobil Uygulama Geliştirme İstanbul | Candemsoft");
  assert.equal(ogImages[0].url, `${siteUrl}/og/default.png`);
});

test("pageMetadata resolves existing project screenshot to absolute URL", () => {
  const meta = pageMetadata({
    lang: "tr",
    route: "projects",
    rest: ["candemfit"],
    title: "CandemFit Sosyal Fitness Uygulaması | Candemsoft",
    description: "Açıklama...",
    image: "/projects/candemfit/desktop.webp",
  });

  const ogImages = meta.openGraph?.images as Array<{ url: string; width?: number; height?: number; alt?: string }>;
  assert.ok(Array.isArray(ogImages) && ogImages.length > 0);
  assert.equal(ogImages[0].url, `${siteUrl}/projects/candemfit/desktop.webp`);
  assert.equal(ogImages[0].width, 1440);
  assert.equal(ogImages[0].height, 900);
  assert.equal(ogImages[0].alt, "CandemFit Sosyal Fitness Uygulaması | Candemsoft");

  // Twitter cards should also have the absolute image URL
  const twitterImages = meta.twitter?.images as string[];
  assert.ok(Array.isArray(twitterImages) && twitterImages.length > 0);
  assert.equal(twitterImages[0], `${siteUrl}/projects/candemfit/desktop.webp`);
});

test("pageMetadata falls back to default og image when file does not exist", () => {
  const meta = pageMetadata({
    lang: "tr",
    route: "projects",
    rest: ["nonexistent"],
    title: "Test Başlık | Candemsoft",
    description: "Açıklama...",
    image: "/projects/nonexistent/desktop.webp",
  });

  const ogImages = meta.openGraph?.images as Array<{ url: string }>;
  assert.ok(Array.isArray(ogImages) && ogImages.length > 0);
  assert.equal(ogImages[0].url, `${siteUrl}/og/default.png`);
});

test("pageMetadata handles external https:// URLs and rejects invalid protocols", () => {
  const validMeta = pageMetadata({
    lang: "en",
    route: "blog",
    title: "External Image Post | Candemsoft",
    description: "Description...",
    image: "https://example.com/banner.png",
  });
  const validImages = validMeta.openGraph?.images as Array<{ url: string }>;
  assert.equal(validImages[0].url, "https://example.com/banner.png");

  // Invalid protocol or prefix should NOT be treated as URL and fall back to default
  const invalidMeta = pageMetadata({
    lang: "en",
    route: "blog",
    title: "Invalid Protocol Post | Candemsoft",
    description: "Description...",
    image: "httpfoo://malicious.link/img.png",
  });
  const invalidImages = invalidMeta.openGraph?.images as Array<{ url: string }>;
  assert.equal(invalidImages[0].url, `${siteUrl}/og/default.png`);
});

test("publicFileExists prevents path traversal (../ attacks)", () => {
  assert.equal(publicFileExists("../package.json"), false);
  assert.equal(publicFileExists("/../../etc/passwd"), false);
  assert.equal(publicFileExists("projects/candemfit/../../package.json"), false);
  assert.equal(publicFileExists("/og/default.png"), true);
});

// -------------------------------------------------------------
// 2. Uniqueness & length constraints across locales, projects, blog
// -------------------------------------------------------------

test("locales meta.*Title and meta.*Description are valid, unique and within length limits", () => {
  for (const lang of locales) {
    const localePath = path.join(root, "content", "locales", `${lang}.json`);
    const dict = JSON.parse(fs.readFileSync(localePath, "utf8"));
    const meta = dict.meta;

    const titles: string[] = [];
    const descriptions: string[] = [];

    const expectedKeys = ["home", "about", "services", "projects", "products", "team", "blog", "contact", "privacy", "tools"];

    for (const key of expectedKeys) {
      const titleKey = `${key}Title`;
      const descKey = `${key}Description`;

      const title = meta[titleKey];
      const desc = meta[descKey];

      assert.ok(typeof title === "string" && title.length > 0, `${lang}.${titleKey} must be non-empty string`);
      assert.ok(typeof desc === "string" && desc.length > 0, `${lang}.${descKey} must be non-empty string`);

      assert.ok(title.length <= 60, `${lang}.${titleKey} length ${title.length} exceeds 60 chars: "${title}"`);
      assert.ok(title.endsWith("Candemsoft"), `${lang}.${titleKey} must end with brand Candemsoft: "${title}"`);

      assert.ok(desc.length >= 140 && desc.length <= 160, `${lang}.${descKey} length ${desc.length} not in [140, 160]: "${desc}"`);

      titles.push(title);
      descriptions.push(desc);
    }

    // Check uniqueness within the locale
    const uniqueTitles = new Set(titles);
    const uniqueDescs = new Set(descriptions);
    assert.equal(uniqueTitles.size, titles.length, `Duplicate meta titles found in ${lang}: ${JSON.stringify(titles)}`);
    assert.equal(uniqueDescs.size, descriptions.length, `Duplicate meta descriptions found in ${lang}: ${JSON.stringify(descriptions)}`);
  }
});

test("all projects have valid, non-empty, unique metaTitle and summary within limits", () => {
  const projects = getProjects();
  assert.ok(projects.length >= 11, `Expected at least 11 projects, found ${projects.length}`);

  for (const lang of locales) {
    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const p of projects) {
      const title = p.metaTitle?.[lang];
      const summary = p.summary[lang];

      assert.ok(typeof title === "string" && title.length > 0, `Project ${p.slug} missing metaTitle.${lang}`);
      assert.ok(typeof summary === "string" && summary.length > 0, `Project ${p.slug} missing summary.${lang}`);

      assert.ok(title.length <= 60, `Project ${p.slug} title.${lang} length ${title.length} exceeds 60: "${title}"`);
      assert.ok(title.endsWith("Candemsoft"), `Project ${p.slug} title.${lang} must end with Candemsoft: "${title}"`);

      assert.ok(summary.length >= 140 && summary.length <= 160, `Project ${p.slug} summary.${lang} length ${summary.length} not in [140, 160]: "${summary}"`);

      titles.push(title);
      descriptions.push(summary);
    }

    const uniqueTitles = new Set(titles);
    const uniqueDescs = new Set(descriptions);
    assert.equal(uniqueTitles.size, titles.length, `Duplicate project titles in ${lang}`);
    assert.equal(uniqueDescs.size, descriptions.length, `Duplicate project summaries in ${lang}`);
  }
});

test("all blog posts have valid, non-empty, unique metaTitle and description within limits", () => {
  const blogDir = path.join(root, "content", "blog");
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  assert.ok(files.length >= 13, `Expected at least 13 blog mdx files, found ${files.length}`);

  for (const lang of locales) {
    const langFiles = files.filter((f) => f.endsWith(`.${lang}.mdx`));
    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const f of langFiles) {
      const src = fs.readFileSync(path.join(blogDir, f), "utf8");
      const titleMatch = src.match(/metaTitle:\s*"([^"]+)"/);
      const descMatch = src.match(/description:\s*"([^"]+)"/);

      assert.ok(titleMatch, `${f} must specify metaTitle`);
      assert.ok(descMatch, `${f} must specify description`);

      const title = titleMatch[1];
      const desc = descMatch[1];

      assert.ok(title.length <= 60, `${f} metaTitle length ${title.length} exceeds 60: "${title}"`);
      assert.ok(title.endsWith("Candemsoft"), `${f} metaTitle must end with Candemsoft: "${title}"`);

      assert.ok(desc.length >= 140 && desc.length <= 160, `${f} description length ${desc.length} not in [140, 160]: "${desc}"`);

      titles.push(title);
      descriptions.push(desc);
    }

    const uniqueTitles = new Set(titles);
    const uniqueDescs = new Set(descriptions);
    assert.equal(uniqueTitles.size, titles.length, `Duplicate blog titles in ${lang}`);
    assert.equal(uniqueDescs.size, descriptions.length, `Duplicate blog descriptions in ${lang}`);
  }
});

test("no title or description collisions across all page types within each language", () => {
  const projects = getProjects();
  const blogDir = path.join(root, "content", "blog");
  const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  for (const lang of locales) {
    const allTitles: string[] = [];
    const allDescriptions: string[] = [];

    // 1. Locales pages
    const localePath = path.join(root, "content", "locales", `${lang}.json`);
    const dict = JSON.parse(fs.readFileSync(localePath, "utf8"));
    const meta = dict.meta;
    for (const k of ["home", "about", "services", "projects", "products", "team", "blog", "contact", "privacy", "tools"]) {
      allTitles.push(meta[`${k}Title`]);
      allDescriptions.push(meta[`${k}Description`]);
    }

    // 2. Projects
    for (const p of projects) {
      allTitles.push(p.metaTitle![lang]);
      allDescriptions.push(p.summary[lang]);
    }

    // 3. Blog posts
    for (const f of blogFiles.filter((b) => b.endsWith(`.${lang}.mdx`))) {
      const src = fs.readFileSync(path.join(blogDir, f), "utf8");
      const titleMatch = src.match(/metaTitle:\s*"([^"]+)"/);
      const descMatch = src.match(/description:\s*"([^"]+)"/);
      if (titleMatch) allTitles.push(titleMatch[1]);
      if (descMatch) allDescriptions.push(descMatch[1]);
    }

    const uniqueTitles = new Set(allTitles);
    const uniqueDescs = new Set(allDescriptions);

    assert.equal(
      uniqueTitles.size,
      allTitles.length,
      `Cross-page title collision detected in ${lang}: ${allTitles.filter((t, i) => allTitles.indexOf(t) !== i)}`
    );
    assert.equal(
      uniqueDescs.size,
      allDescriptions.length,
      `Cross-page description collision detected in ${lang}: ${allDescriptions.filter((d, i) => allDescriptions.indexOf(d) !== i)}`
    );
  }
});

// -------------------------------------------------------------
// 3. Rich Schema.org JSON-LD Builders & Deduplication (Task T31)
// -------------------------------------------------------------

test("organizationJsonLd returns valid Organization and WebSite schema nodes", () => {
  for (const lang of locales) {
    const desc = `Candemsoft açıklama ${lang}`;
    const data = organizationJsonLd(lang, desc);

    assert.equal(data["@context"], "https://schema.org");
    assert.ok(Array.isArray(data["@graph"]), "Root must contain @graph array");
    assert.equal(data["@graph"].length, 2, "Graph must contain Organization and WebSite");

    const org = data["@graph"].find((n: Record<string, unknown>) => n["@type"] === "Organization") as Record<string, unknown>;
    const web = data["@graph"].find((n: Record<string, unknown>) => n["@type"] === "WebSite") as Record<string, unknown>;

    assert.ok(org, "Organization node must exist");
    assert.ok(web, "WebSite node must exist");

    // Organization checks
    assert.equal(org["@id"], `${siteUrl}/#organization`);
    assert.equal(org.name, "Candemsoft");
    assert.equal(org.url, `${siteUrl}/`);
    assert.equal(org.logo, `${siteUrl}/brand/logo-on-light.png`);
    assert.equal(org.description, desc);
    assert.equal(org.foundingDate, "2025");
    assert.equal(org.email, "info@candemsoft.com");
    assert.equal(org.telephone, "+90 534 933 46 31");

    // Address: city and country only, NO fabricated street address
    const address = org.address as Record<string, string>;
    assert.ok(address, "Address must be present");
    assert.equal(address["@type"], "PostalAddress");
    assert.equal(address.addressLocality, "İstanbul");
    assert.equal(address.addressCountry, "TR");
    assert.equal(address.streetAddress, undefined, "Street address must not be fabricated");

    // ContactPoint
    const cp = org.contactPoint as Record<string, unknown>;
    assert.ok(cp, "ContactPoint must be present");
    assert.equal(cp["@type"], "ContactPoint");
    assert.equal(cp.contactType, "customer service");
    assert.equal(cp.email, "info@candemsoft.com");
    assert.equal(cp.telephone, "+90 534 933 46 31");
    assert.deepEqual(cp.availableLanguage, ["Turkish", "English", "Spanish"]);

    // SameAs profiles
    const sameAs = org.sameAs as string[];
    assert.ok(Array.isArray(sameAs) && sameAs.length >= 2);
    assert.ok(sameAs.includes("https://www.linkedin.com/company/candemsoft/"));
    assert.ok(sameAs.includes("https://www.instagram.com/candem.soft/"));

    // WebSite checks
    assert.equal(web["@id"], `${siteUrl}/#website`);
    assert.equal(web.url, `${siteUrl}/`);
    assert.equal(web.name, "Candemsoft");
    assert.equal(web.inLanguage, localeTags[lang]);
    assert.deepEqual(web.publisher, { "@id": `${siteUrl}/#organization` });
  }
});

test("breadcrumbLabel maps all 10 route keys accurately across tr, en, es", () => {
  const expected: Record<RouteKey, Record<"tr" | "en" | "es", string>> = {
    home: { tr: "Ana Sayfa", en: "Home", es: "Inicio" },
    about: { tr: "Hakkımızda", en: "About", es: "Sobre nosotros" },
    services: { tr: "Hizmetler", en: "Services", es: "Servicios" },
    projects: { tr: "Projeler", en: "Projects", es: "Proyectos" },
    products: { tr: "Ürünler", en: "Products", es: "Productos" },
    team: { tr: "Ekip", en: "Team", es: "Equipo" },
    blog: { tr: "Blog", en: "Blog", es: "Blog" },
    contact: { tr: "İletişim", en: "Contact", es: "Contacto" },
    privacy: { tr: "Gizlilik Politikası", en: "Privacy Policy", es: "Política de privacidad" },
    tools: { tr: "Araçlar", en: "Tools", es: "Herramientas" },
  };

  const keys = Object.keys(expected) as RouteKey[];
  for (const k of keys) {
    for (const lang of locales) {
      assert.equal(
        breadcrumbLabel(lang, k),
        expected[k][lang],
        `breadcrumbLabel(${lang}, ${k}) must match spec`
      );
    }
  }
});

test("pageBreadcrumbs and breadcrumbJsonLd build standard BreadcrumbList schemas", () => {
  // 1. Home breadcrumbs
  const homeCrumbs = pageBreadcrumbs("tr", "home");
  assert.equal(homeCrumbs.length, 1);
  assert.equal(homeCrumbs[0].name, "Ana Sayfa");
  assert.equal(homeCrumbs[0].url, `${siteUrl}/`);

  // 2. Section breadcrumbs
  const servicesCrumbs = pageBreadcrumbs("en", "services");
  assert.equal(servicesCrumbs.length, 2);
  assert.equal(servicesCrumbs[0].name, "Home");
  assert.equal(servicesCrumbs[0].url, `${siteUrl}/en`);
  assert.equal(servicesCrumbs[1].name, "Services");
  assert.equal(servicesCrumbs[1].url, `${siteUrl}/en/services`);

  // 3. Leaf item breadcrumbs
  const toolItemCrumbs = pageBreadcrumbs("es", "tools", {
    name: "Generador de Slug",
    url: `${siteUrl}/es/herramientas/generador-slug`,
  });
  assert.equal(toolItemCrumbs.length, 3);
  assert.equal(toolItemCrumbs[0].name, "Inicio");
  assert.equal(toolItemCrumbs[1].name, "Herramientas");
  assert.equal(toolItemCrumbs[2].name, "Generador de Slug");
  assert.equal(toolItemCrumbs[2].url, `${siteUrl}/es/herramientas/generador-slug`);

  // 4. breadcrumbJsonLd serialisation check
  const jsonLdData = breadcrumbJsonLd(toolItemCrumbs);
  assert.equal(jsonLdData["@context"], "https://schema.org");
  assert.equal(jsonLdData["@type"], "BreadcrumbList");
  assert.equal(jsonLdData.itemListElement.length, 3);
  assert.deepEqual(jsonLdData.itemListElement[0], {
    "@type": "ListItem",
    position: 1,
    name: "Inicio",
    item: `${siteUrl}/es`,
  });
  assert.deepEqual(jsonLdData.itemListElement[2], {
    "@type": "ListItem",
    position: 3,
    name: "Generador de Slug",
    item: `${siteUrl}/es/herramientas/generador-slug`,
  });
});

test("articleJsonLd constructs BlogPosting schema conforming to specification", () => {
  const meta = getPostMeta("tr", "candemsoft-nedir-yazilim-hizmetleri");
  const posting = articleJsonLd("tr", meta);

  assert.equal(posting["@context"], "https://schema.org");
  assert.equal(posting["@type"], "BlogPosting");
  assert.equal(posting["@id"], `${siteUrl}/blog/candemsoft-nedir-yazilim-hizmetleri#article`);
  assert.equal(posting.headline, meta.title);
  assert.equal(posting.description, meta.description);
  assert.equal(posting.datePublished, meta.date);
  assert.equal(posting.dateModified, meta.date);
  assert.equal(posting.inLanguage, "tr-TR");
  assert.equal(posting.keywords, meta.tags.join(", "));
  assert.deepEqual(posting.author, {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: meta.author || "Candemsoft",
    url: siteUrl,
  });
  assert.deepEqual(posting.publisher, {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Candemsoft",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/logo-on-light.png`,
    },
  });
  assert.deepEqual(posting.image, [`${siteUrl}/og/default.png`]);
  assert.deepEqual(posting.mainEntityOfPage, {
    "@type": "WebPage",
    "@id": `${siteUrl}/blog/candemsoft-nedir-yazilim-hizmetleri`,
  });
  assert.equal(posting.url, `${siteUrl}/blog/candemsoft-nedir-yazilim-hizmetleri`);

  // Custom postUrl and image overrides
  const customMeta = { ...meta, image: "/blog/custom-banner.webp" };
  const customPosting = articleJsonLd("en", customMeta, "https://candemsoft.com/en/blog/custom-post");
  assert.equal(customPosting["@id"], "https://candemsoft.com/en/blog/custom-post#article");
  assert.equal(customPosting.url, "https://candemsoft.com/en/blog/custom-post");
  assert.deepEqual(customPosting.mainEntityOfPage, {
    "@type": "WebPage",
    "@id": "https://candemsoft.com/en/blog/custom-post",
  });
  assert.deepEqual(customPosting.image, [`${siteUrl}/blog/custom-banner.webp`]);
  assert.equal(customPosting.inLanguage, "en-GB");
});

test("softwareJsonLd creates valid MobileApplication and SoftwareApplication schemas without review spam", () => {
  const products = getProducts();

  const seyyah = products.find((p) => p.slug === "seyyah")!;
  const orpigo = products.find((p) => p.slug === "orpigo")!;
  const kisiselQr = products.find((p) => p.slug === "kisisel-qr")!;
  const candemfit = products.find((p) => p.slug === "candemfit")!;
  const candemkey = products.find((p) => p.slug === "candemkey")!;

  assert.ok(seyyah && orpigo && kisiselQr && candemfit && candemkey);

  // 1. Seyyah (Mobile + Web)
  const seyyahLd = softwareJsonLd("tr", seyyah, seyyah.name);
  assert.equal(seyyahLd["@type"], "MobileApplication");
  assert.equal(seyyahLd["@id"], `${siteUrl}/projeler/seyyah#software`);
  assert.equal(seyyahLd.name, "Seyyah");
  assert.equal(seyyahLd.description, seyyah.description.tr);
  assert.equal(seyyahLd.applicationCategory, "TravelApplication");
  assert.equal(seyyahLd.operatingSystem, "iOS, Android, Web Browser");
  assert.deepEqual(seyyahLd.offers, { "@type": "Offer", price: "0", priceCurrency: "TRY" });
  assert.equal(seyyahLd.url, "https://seyyah.info/");
  assert.equal(seyyahLd.image, `${siteUrl}/products/seyyah.png`);
  assert.deepEqual(seyyahLd.publisher, { "@id": `${siteUrl}/#organization` });
  assert.equal(seyyahLd.inLanguage, "tr-TR");
  assert.ok((seyyahLd.sameAs as string[]).includes("https://seyyah.info/"));
  assert.ok((seyyahLd.sameAs as string[]).includes("https://apps.apple.com/tr/app/seyyah-ke%C5%9Ffet-karar-ver-git/id6761266829?l=tr"));

  // Strict check: ABSOLUTELY NO AggregateRating or Review anywhere
  assert.equal((seyyahLd as Record<string, unknown>).aggregateRating, undefined);
  assert.equal((seyyahLd as Record<string, unknown>).review, undefined);

  // 2. Orpigo (Utilities)
  const orpigoLd = softwareJsonLd("en", orpigo, orpigo.name);
  assert.equal(orpigoLd["@type"], "MobileApplication");
  assert.equal(orpigoLd.applicationCategory, "UtilitiesApplication");
  assert.equal(orpigoLd.operatingSystem, "iOS, Android, Web Browser");
  assert.deepEqual(orpigoLd.offers, { "@type": "Offer", price: "0", priceCurrency: "TRY" });
  assert.equal((orpigoLd as Record<string, unknown>).aggregateRating, undefined);

  // 3. Kişisel QR (Business)
  const qrLd = softwareJsonLd("es", kisiselQr, kisiselQr.name);
  assert.equal(qrLd["@type"], "MobileApplication");
  assert.equal(qrLd.applicationCategory, "BusinessApplication");
  assert.deepEqual(qrLd.offers, { "@type": "Offer", price: "0", priceCurrency: "TRY" });
  assert.equal((qrLd as Record<string, unknown>).aggregateRating, undefined);

  // 4. CandemFit (Health)
  const fitLd = softwareJsonLd("tr", candemfit, candemfit.name);
  assert.equal(fitLd["@type"], "MobileApplication");
  assert.equal(fitLd.applicationCategory, "HealthApplication");
  assert.equal(fitLd.operatingSystem, "iOS, Web Browser");
  assert.deepEqual(fitLd.offers, { "@type": "Offer", price: "0", priceCurrency: "TRY" });
  assert.equal((fitLd as Record<string, unknown>).aggregateRating, undefined);

  // 5. Candemkey (SoftwareApplication, Utilities, platforms: [])
  const keyLd = softwareJsonLd("tr", candemkey, candemkey.name);
  assert.equal(keyLd["@type"], "SoftwareApplication");
  assert.equal(keyLd.applicationCategory, "UtilitiesApplication");
  assert.equal(keyLd.operatingSystem, "All");
  assert.deepEqual(keyLd.offers, { "@type": "Offer", price: "0", priceCurrency: "TRY" });
  assert.equal((keyLd as Record<string, unknown>).aggregateRating, undefined);

  // Custom pageUrl override
  const customSw = softwareJsonLd("en", seyyah, "Seyyah App", "https://candemsoft.com/en/custom-seyyah");
  assert.equal(customSw["@id"], "https://candemsoft.com/en/custom-seyyah#software");
});

test("mergeJsonLd consolidates JSON-LD nodes, deduplicates entries and standardizes graph", () => {
  const org = organizationJsonLd("tr", "Örnek");
  const meta = getPostMeta("tr", "candemsoft-nedir-yazilim-hizmetleri");
  const article = articleJsonLd("tr", meta);
  const breadcrumbs = breadcrumbJsonLd(pageBreadcrumbs("tr", "blog"));

  // 1. Single node returns with @context without @graph wrapper
  const single = mergeJsonLd(article);
  assert.equal(single["@context"], "https://schema.org");
  assert.equal(single["@type"], "BlogPosting");
  assert.equal(single["@graph"], undefined);

  // 2. Multiple nodes returns @graph array
  const multi = mergeJsonLd(article, breadcrumbs);
  assert.equal(multi["@context"], "https://schema.org");
  assert.ok(Array.isArray(multi["@graph"]));
  assert.equal(multi["@graph"].length, 2);

  // Individual nodes inside @graph must NOT have @context
  assert.equal((multi["@graph"][0] as Record<string, unknown>)["@context"], undefined);
  assert.equal((multi["@graph"][1] as Record<string, unknown>)["@context"], undefined);

  // 3. Deduplication by @id: merging identical org structures keeps only 1 Organization and 1 WebSite
  const dedupOrg = mergeJsonLd(org, org, org);
  assert.ok(Array.isArray(dedupOrg["@graph"]));
  assert.equal(dedupOrg["@graph"].length, 2);
  const orgTypes = (dedupOrg["@graph"] as Array<{ "@type": string }>).map((n) => n["@type"]);
  assert.deepEqual(orgTypes.sort(), ["Organization", "WebSite"].sort());

  // 4. Deduplication by type+name when @id is missing
  const itemA = { "@type": "ListItem", name: "Ana Sayfa", position: 1 };
  const itemB = { "@type": "ListItem", name: "Ana Sayfa", position: 99 };
  const itemC = { "@type": "ListItem", name: "Hizmetler", position: 2 };
  const dedupItems = mergeJsonLd(itemA, itemB, itemC);
  assert.ok(Array.isArray(dedupItems["@graph"]));
  assert.equal(dedupItems["@graph"].length, 2);
  assert.equal((dedupItems["@graph"][0] as { position: number }).position, 1);

  // 5. Safely ignores null, undefined, false
  const withFalsy = mergeJsonLd(null, article, undefined, false);
  assert.equal(withFalsy["@type"], "BlogPosting");
  assert.equal(withFalsy["@graph"], undefined);
});

test("getPostFaqs extracts valid Q&A pairs from MDX blog posts across formats and locales", () => {
  // 1. Post with ### H3 questions and leading numbering
  const h3Faqs = getPostFaqs("tr", "turkce-buyuk-harf");
  assert.ok(h3Faqs.length >= 4, `Expected at least 4 FAQs, got ${h3Faqs.length}`);
  for (const item of h3Faqs) {
    assert.ok(item.question.length > 5, "Question must be a non-empty string");
    assert.ok(item.answer.length > 10, "Answer must be a non-empty string");
    assert.ok(!/^\d+\./.test(item.question), `Leading number must be stripped: "${item.question}"`);
  }
  assert.ok(h3Faqs[0].question.includes("Unicode"));

  // 2. Post with **Question?** markdown format
  const boldFaqs = getPostFaqs("tr", "candemsoft-nedir-yazilim-hizmetleri");
  assert.ok(boldFaqs.length >= 3, `Expected at least 3 FAQs, got ${boldFaqs.length}`);
  assert.equal(boldFaqs[0].question, "Candemsoft nerede?");
  assert.equal(boldFaqs[0].answer, "İstanbul, Türkiye.");
  assert.equal(boldFaqs[1].question, "Hangi alanlarda hizmet veriyorsunuz?");

  // 3. English post with ## Frequently asked questions
  const enFaqs = getPostFaqs("en", "flutter-mi-native-mi-teknoloji-secimi");
  assert.ok(enFaqs.length >= 4, `Expected at least 4 FAQs, got ${enFaqs.length}`);
  assert.equal(enFaqs[0].question, "Can Flutter applications run as smoothly as native apps?");
  assert.ok(enFaqs[0].answer.startsWith("Yes."));

  // 4. Spanish post with ## Preguntas Frecuentes
  const esFaqs = getPostFaqs("es", "turkce-buyuk-harf");
  assert.ok(esFaqs.length >= 4, `Expected at least 4 FAQs, got ${esFaqs.length}`);
  assert.ok(esFaqs[0].question.includes("Unicode"));
  assert.ok(!/^\d+\./.test(esFaqs[0].question), `Leading number must be stripped in Spanish too: "${esFaqs[0].question}"`);

  // 5. Non-existent slug returns empty array
  assert.deepEqual(getPostFaqs("tr", "non-existent-slug-12345"), []);
});

