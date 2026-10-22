// scripts/verify-jsonld.mjs
// Extracts and validates all JSON-LD structured data from static HTML files in ./out.
// Usage: node scripts/verify-jsonld.mjs [--dir out]

import fs from "node:fs";
import path from "node:path";

const outDir = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : path.resolve(process.cwd(), "out");

if (!fs.existsSync(outDir)) {
  console.error(`❌ Output directory does not exist: ${outDir}`);
  process.exit(1);
}

function findHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const allHtmlFiles = findHtmlFiles(outDir);
console.log(`🔍 Scanning ${allHtmlFiles.length} HTML files in ${outDir}...\n`);

let totalScripts = 0;
let totalEntities = 0;
const entityCounts = {};
const errors = [];
const warnings = [];

const PAGE_RULES = [
  // Regex to match page URL relative to out/ for production designs (v2 and classic lang roots)
  { pattern: /^(?:v2\/)?[a-z]{2}\/hizmetler\/[^/]+\/index\.html$/, name: "Hizmet Detay", requiredTypes: ["Service", "FAQPage", "BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/araclar\/[^/]+\/index\.html$/, name: "Araç Detay", requiredTypes: ["WebApplication", "FAQPage", "BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/blog\/[^/]+\/index\.html$/, name: "Blog Detay", requiredTypes: ["BlogPosting", "BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/projeler\/(?:orpigo|kisisel-qr|seyyah|candemfit|candemkey)\/index\.html$/, name: "Ürün Proje Detay", requiredTypes: ["MobileApplication|SoftwareApplication", "BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/projeler\/[^/]+\/index\.html$/, name: "Proje Detay", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/hakkimizda\/index\.html$/, name: "Hakkımızda", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/hizmetler\/index\.html$/, name: "Hizmetler Hub", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/projeler\/index\.html$/, name: "Projeler Hub", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/urunler\/index\.html$/, name: "Ürünler Hub", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/blog\/index\.html$/, name: "Blog Hub", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/iletisim\/index\.html$/, name: "İletişim", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/ekip\/index\.html$/, name: "Ekip", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/gizlilik\/index\.html$/, name: "Gizlilik", requiredTypes: ["BreadcrumbList"] },
  { pattern: /^(?:v2\/)?[a-z]{2}\/araclar\/index\.html$/, name: "Araçlar Hub", requiredTypes: ["BreadcrumbList"] },
];

function validateEntity(entity, relPath) {
  const type = entity["@type"];
  if (!type) {
    errors.push(`${relPath}: Entity missing @type: ${JSON.stringify(entity)}`);
    return;
  }

  entityCounts[type] = (entityCounts[type] || 0) + 1;
  totalEntities++;

  // Validate Organization
  if (type === "Organization") {
    if (!entity.name || typeof entity.name !== "string") errors.push(`${relPath}: Organization missing name`);
    if (!entity.url || !entity.url.startsWith("http")) errors.push(`${relPath}: Organization missing or invalid url`);
    if (!entity.logo || !entity.logo.startsWith("http")) errors.push(`${relPath}: Organization missing or invalid logo`);
    if (!entity.contactPoint || !entity.contactPoint.email || !entity.contactPoint.telephone) {
      errors.push(`${relPath}: Organization missing contactPoint with email and telephone`);
    }
    if (!entity.address || entity.address["@type"] !== "PostalAddress" || !entity.address.addressLocality || !entity.address.addressCountry) {
      errors.push(`${relPath}: Organization missing address with PostalAddress, locality, country`);
    }
    if (entity.address?.streetAddress) {
      warnings.push(`${relPath}: Organization contains streetAddress; requirement: 'sokak adresi uydurma'`);
    }
    if (!Array.isArray(entity.sameAs) || entity.sameAs.length === 0) {
      errors.push(`${relPath}: Organization missing sameAs social profiles`);
    }
  }

  // Validate WebSite
  if (type === "WebSite") {
    if (!entity.name) errors.push(`${relPath}: WebSite missing name`);
    if (!entity.url || !entity.url.startsWith("http")) errors.push(`${relPath}: WebSite missing url`);
    if (!entity.inLanguage) errors.push(`${relPath}: WebSite missing inLanguage`);
    if (!entity.publisher) errors.push(`${relPath}: WebSite missing publisher`);
  }

  // Validate BreadcrumbList
  if (type === "BreadcrumbList") {
    if (!Array.isArray(entity.itemListElement) || entity.itemListElement.length < 2) {
      errors.push(`${relPath}: BreadcrumbList itemListElement must have at least 2 items`);
    } else {
      entity.itemListElement.forEach((item, index) => {
        if (item["@type"] !== "ListItem") errors.push(`${relPath}: Breadcrumb item ${index} is not ListItem`);
        if (item.position !== index + 1) errors.push(`${relPath}: Breadcrumb item ${index} position mismatch (${item.position} != ${index + 1})`);
        if (!item.name || typeof item.name !== "string") errors.push(`${relPath}: Breadcrumb item ${index} missing name`);
        if (!item.item || !item.item.startsWith("http")) errors.push(`${relPath}: Breadcrumb item ${index} missing valid absolute url`);
      });
    }
  }

  // Validate BlogPosting / Article
  if (type === "BlogPosting" || type === "Article") {
    if (!entity.headline) errors.push(`${relPath}: ${type} missing headline`);
    if (!entity.datePublished) errors.push(`${relPath}: ${type} missing datePublished`);
    if (!entity.author) errors.push(`${relPath}: ${type} missing author`);
    if (!entity.image || (Array.isArray(entity.image) && entity.image.length === 0)) {
      errors.push(`${relPath}: ${type} missing image`);
    }
    if (!entity.mainEntityOfPage) errors.push(`${relPath}: ${type} missing mainEntityOfPage`);
    if (!entity.publisher) errors.push(`${relPath}: ${type} missing publisher`);
  }

  // Validate SoftwareApplication / MobileApplication
  if (type === "SoftwareApplication" || type === "MobileApplication") {
    if (!entity.name) errors.push(`${relPath}: ${type} missing name`);
    if (!entity.description) errors.push(`${relPath}: ${type} missing description`);
    if (!entity.applicationCategory) errors.push(`${relPath}: ${type} missing applicationCategory`);
    if (!entity.operatingSystem) errors.push(`${relPath}: ${type} missing operatingSystem`);
    if (!entity.offers || typeof entity.offers !== "object") {
      errors.push(`${relPath}: ${type} missing offers`);
    } else if (entity.offers.price === undefined || !entity.offers.priceCurrency) {
      errors.push(`${relPath}: ${type} offers missing price or priceCurrency`);
    }
    if (entity.aggregateRating || entity.review) {
      errors.push(`${relPath}: ${type} contains forbidden aggregateRating or review (spam check)`);
    }
  }

  // Validate WebApplication
  if (type === "WebApplication") {
    if (!entity.name) errors.push(`${relPath}: WebApplication missing name`);
    if (!entity.description) errors.push(`${relPath}: WebApplication missing description`);
    if (!entity.applicationCategory) errors.push(`${relPath}: WebApplication missing applicationCategory`);
    if (!entity.operatingSystem) errors.push(`${relPath}: WebApplication missing operatingSystem`);
    if (!entity.offers || entity.offers.price === undefined) {
      errors.push(`${relPath}: WebApplication missing offers with price`);
    }
  }

  // Validate Service
  if (type === "Service") {
    if (!entity.name) errors.push(`${relPath}: Service missing name`);
    if (!entity.description) errors.push(`${relPath}: Service missing description`);
    if (!entity.provider) errors.push(`${relPath}: Service missing provider`);
    if (!entity.url || !entity.url.startsWith("http")) errors.push(`${relPath}: Service missing url`);
    if (!entity.areaServed) errors.push(`${relPath}: Service missing areaServed`);
  }

  // Validate FAQPage
  if (type === "FAQPage") {
    if (!Array.isArray(entity.mainEntity) || entity.mainEntity.length === 0) {
      errors.push(`${relPath}: FAQPage mainEntity must be non-empty array of questions`);
    } else {
      entity.mainEntity.forEach((q, idx) => {
        if (q["@type"] !== "Question") errors.push(`${relPath}: FAQPage item ${idx} is not Question`);
        if (!q.name || typeof q.name !== "string") errors.push(`${relPath}: FAQPage question ${idx} missing name`);
        if (!q.acceptedAnswer || q.acceptedAnswer["@type"] !== "Answer" || !q.acceptedAnswer.text) {
          errors.push(`${relPath}: FAQPage question ${idx} missing acceptedAnswer.text`);
        }
      });
    }
  }
}

// Check each file
for (const file of allHtmlFiles) {
  const rel = path.relative(outDir, file);
  const content = fs.readFileSync(file, "utf8");

  // Skip redirect placeholder pages (like /index.html or /v2/index.html with meta refresh and no body content)
  if (content.includes('<meta http-equiv="refresh"') && content.length < 500) {
    continue;
  }

  const scriptMatches = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  totalScripts += scriptMatches.length;

  const pageEntities = [];

  for (let i = 0; i < scriptMatches.length; i++) {
    const rawJson = scriptMatches[i][1];
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (err) {
      errors.push(`${rel} (script #${i + 1}): JSON parse error: ${err.message}`);
      continue;
    }

    if (Array.isArray(parsed["@graph"])) {
      for (const node of parsed["@graph"]) {
        if (node && typeof node === "object") {
          pageEntities.push(node);
          validateEntity(node, rel);
        }
      }
    } else if (parsed && typeof parsed === "object") {
      pageEntities.push(parsed);
      validateEntity(parsed, rel);
    }
  }

  // Deduplication check on page
  const seenTypesWithIds = new Set();
  for (const ent of pageEntities) {
    const key = ent["@id"] ? `${ent["@type"]}:${ent["@id"]}` : null;
    if (key) {
      if (seenTypesWithIds.has(key)) {
        errors.push(`${rel}: Duplicate entity found with same @id: ${key}`);
      }
      seenTypesWithIds.add(key);
    }
  }

  // Check required page rules (specifically for v2 and root pages)
  for (const rule of PAGE_RULES) {
    if (rule.pattern.test(rel)) {
      for (const requiredTypeOption of rule.requiredTypes) {
        const allowed = requiredTypeOption.split("|");
        const found = pageEntities.some((e) => allowed.includes(e["@type"]));
        if (!found) {
          errors.push(`${rel} (${rule.name}): Missing required structured data type [${requiredTypeOption}]`);
        }
      }
    }
  }
}

console.log("====================================================");
console.log("📊 JSON-LD SCHEMA DOĞRULAMA RAPORU");
console.log("====================================================");
console.log(`İncelenen HTML Dosyaları: ${allHtmlFiles.length}`);
console.log(`Bulunan Toplam JSON-LD Script Tag'i: ${totalScripts}`);
console.log(`Çözümlenen Toplam Yapılandırılmış Veri Varlığı: ${totalEntities}\n`);

console.log("Varlık Tiplerine Göre Dağılım:");
for (const [type, count] of Object.entries(entityCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  - ${type.padEnd(25)}: ${count}`);
}
console.log("");

if (warnings.length > 0) {
  console.log(`⚠️ UYARILAR (${warnings.length}):`);
  warnings.slice(0, 10).forEach((w) => console.log(`  ${w}`));
  if (warnings.length > 10) console.log(`  ... ve ${warnings.length - 10} diğer uyarı`);
  console.log("");
}

if (errors.length > 0) {
  console.log(`❌ HATALAR (${errors.length}):`);
  errors.slice(0, 25).forEach((e) => console.log(`  ${e}`));
  if (errors.length > 25) console.log(`  ... ve ${errors.length - 25} diğer hata`);
  console.log("");
  process.exit(1);
} else {
  console.log("✅ TÜM JSON-LD YAPILANDIRILMIŞ VERİLERİ HATASIZ VE ŞEMAYA UYGUN DOĞRULANDI!");
  process.exit(0);
}
