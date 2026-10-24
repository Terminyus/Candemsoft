import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseSocialUrl,
  getAllSocialGroups,
  getActiveSocialGroups,
  getMissingSocialReport,
  getContrastRatio,
  NETWORKS,
} from "./social";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../");
const site = JSON.parse(fs.readFileSync(path.join(rootDir, "content", "site.json"), "utf-8"));
const products = JSON.parse(fs.readFileSync(path.join(rootDir, "content", "products.json"), "utf-8"));

test("1. parseSocialUrl: platform tespiti ve alt dize çakışma koruması (box.com / max.com / netflix.com)", () => {
  // Geçerli platformlar
  assert.equal(parseSocialUrl("https://www.instagram.com/candem.soft/").network, "instagram");
  assert.equal(parseSocialUrl("https://www.linkedin.com/company/candemsoft/").network, "linkedin");
  assert.equal(parseSocialUrl("https://www.youtube.com/@Orpigo").network, "youtube");
  assert.equal(parseSocialUrl("https://youtu.be/dQw4w9WgXcQ").network, "youtube");
  assert.equal(parseSocialUrl("https://www.tiktok.com/@orpigo").network, "tiktok");
  assert.equal(parseSocialUrl("https://github.com/candemsoft").network, "github");
  assert.equal(parseSocialUrl("https://x.com/candemsoft").network, "x");
  assert.equal(parseSocialUrl("https://twitter.com/candemsoft").network, "x");

  // Yanlış alt dize eşleşme koruması: box.com, max.com, netflix.com kesinlikle "x" olarak algılanmamalıdır
  assert.equal(parseSocialUrl("https://box.com").network, "other");
  assert.equal(parseSocialUrl("https://max.com/shows").network, "other");
  assert.equal(parseSocialUrl("https://netflix.com").network, "other");
  assert.equal(parseSocialUrl("https://example.com/custom").network, "other");

  // Geçersiz / bozuk URL durumunda güvenli fallback
  const invalid = parseSocialUrl("not-a-valid-url");
  assert.equal(invalid.network, "other");
  assert.equal(invalid.networkName, "Web");
});

test("2. getAllSocialGroups: Candemsoft ve tüm ürünlerin dahil edilmesi", () => {
  const groups = getAllSocialGroups(site, products);
  const ids = groups.map((g) => g.id);

  assert.ok(ids.includes("candemsoft"), "Candemsoft çatı grup olarak mevcut olmalı");
  for (const p of products) {
    assert.ok(ids.includes(p.slug), `Ürün ${p.slug} gruplarda mevcut olmalı`);
  }
});

test("3. getActiveSocialGroups: Yalnızca aktif linki olan 4 odanın filtrelenmesi", () => {
  const active = getActiveSocialGroups(site, products);
  const activeIds = active.map((g) => g.id);

  assert.equal(active.length, 4, "Aktif linki olan tam 4 proje grubu olmalı");
  assert.ok(activeIds.includes("candemsoft"), "Candemsoft aktif olmalı");
  assert.ok(activeIds.includes("seyyah"), "Seyyah aktif olmalı");
  assert.ok(activeIds.includes("orpigo"), "Orpigo aktif olmalı");
  assert.ok(activeIds.includes("kisisel-qr"), "Kişisel QR aktif olmalı");

  // CandemFit ve Candemkey içerikte linki olmadığı için aktif grupta yer almamalıdır
  assert.ok(!activeIds.includes("candemfit"), "CandemFit aktif grupta yer almamalı");
  assert.ok(!activeIds.includes("candemkey"), "Candemkey aktif grupta yer almamalı");
});

test("4. Kırık İkon Koruması: Tüm aktif grupların ikon dosyaları public/ dizininde fiziksel olarak bulunmalı", () => {
  const active = getActiveSocialGroups(site, products);
  const publicDir = path.join(rootDir, "public");

  for (const g of active) {
    assert.ok(g.icon, `${g.name} için ikon yolu tanımlı olmalı`);
    const cleanPath = g.icon.replace(/^\//, "");
    const fullPath = path.join(publicDir, cleanPath);
    assert.ok(
      fs.existsSync(fullPath),
      `${g.name} grubunun ikon dosyası (${g.icon}) fiziksel olarak ${fullPath} konumunda mevcut olmalı`,
    );
  }
});

test("5. Uydurma Link Koruması: Tüm aktif URL'ler site.json veya products.json içeriklerinden gelmeli", () => {
  const active = getActiveSocialGroups(site, products);
  const activeUrls = active.flatMap((g) => g.links.map((l) => l.url));

  const knownContentUrls = new Set();
  for (const url of Object.values(site.social ?? {})) {
    if (url) knownContentUrls.add(url);
  }
  for (const p of products) {
    for (const url of p.social ?? []) {
      if (url) knownContentUrls.add(url);
    }
  }

  for (const u of activeUrls) {
    assert.ok(
      knownContentUrls.has(u),
      `URL ${u} içerik dosyalarında tanımlı olmalı, uydurma link eklenmemeli`,
    );
  }
});

test("6. getMissingSocialReport: Eksik ve boş bırakılan sosyal medya kanallarının tespiti", () => {
  const report = getMissingSocialReport(site, products);
  assert.ok(Array.isArray(report));
  assert.equal(report.length, 6, "1 şirket + 5 ürün toplam 6 rapor satırı olmalı");

  const candemfitReport = report.find((r) => r.entity === "CandemFit");
  assert.ok(candemfitReport, "CandemFit raporda yer almalı");
  assert.equal(candemfitReport.activeLinks.length, 0, "CandemFit aktif linki 0 olmalı");
  assert.ok(candemfitReport.missingNetworks.includes("Instagram"));
  assert.ok(candemfitReport.missingNetworks.includes("LinkedIn"));

  const candemkeyReport = report.find((r) => r.entity === "Candemkey");
  assert.ok(candemkeyReport, "Candemkey raporda yer almalı");
  assert.equal(candemkeyReport.activeLinks.length, 0, "Candemkey aktif linki 0 olmalı");

  const candemsoftReport = report.find((r) => r.entity === "Candemsoft");
  assert.ok(candemsoftReport, "Candemsoft raporda yer almalı");
  assert.ok(candemsoftReport.missingNetworks.includes("GitHub"), "GitHub boş bırakıldığı için eksik sayılmalı");
});

test("7. WCAG 2.1 Kontrast Oranları Matematiksel Doğrulaması (Hesaplanmış Değerler)", () => {
  // Proje tasarım paleti
  const bgFooter = "#0e0d0b";
  const bgCard = "#18181b";
  const bgButton = "#09090b";
  const textTitle = "#f5f4ef";
  const textMuted = "#a8a29e";
  const textSignal = "#ffb800";

  const crCardTitle = getContrastRatio(bgCard, textTitle);
  const crCardMuted = getContrastRatio(bgCard, textMuted);
  const crButtonIcon = getContrastRatio(bgButton, textMuted);
  const crHoverSignal = getContrastRatio(bgCard, textSignal);
  const crFooterMuted = getContrastRatio(bgFooter, textMuted);

  // Exact values: 16.09, 7.02, 7.89, 10.22, 7.70
  assert.ok(crCardTitle >= 16.0, `Kart başlık kontrastı (${crCardTitle}) >= 16.0 AAA olmalı`);
  assert.ok(crCardMuted >= 7.0, `Kart ikincil metin kontrastı (${crCardMuted}) >= 7.0 AAA olmalı`);
  assert.ok(crButtonIcon >= 7.8, `İkon buton kontrastı (${crButtonIcon}) >= 7.8 AAA olmalı`);
  assert.ok(crHoverSignal >= 10.0, `Signal hover kontrastı (${crHoverSignal}) >= 10.0 AAA olmalı`);
  assert.ok(crFooterMuted >= 7.5, `Footer açıklama kontrastı (${crFooterMuted}) >= 7.5 AAA olmalı`);
});
