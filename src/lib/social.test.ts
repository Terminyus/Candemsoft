import test from "node:test";
import assert from "node:assert/strict";
import {
  parseSocialUrl,
  getAllSocialGroups,
  getActiveSocialGroups,
  getMissingSocialReport,
  NETWORKS,
} from "./social";
import site from "../../content/site.json";
import products from "../../content/products.json";

test("parseSocialUrl detects all known network platforms accurately", () => {
  assert.equal(parseSocialUrl("https://www.instagram.com/candem.soft/").network, "instagram");
  assert.equal(parseSocialUrl("https://www.linkedin.com/company/candemsoft/").network, "linkedin");
  assert.equal(parseSocialUrl("https://www.youtube.com/@Orpigo").network, "youtube");
  assert.equal(parseSocialUrl("https://www.tiktok.com/@orpigo").network, "tiktok");
  assert.equal(parseSocialUrl("https://github.com/candemsoft").network, "github");
  assert.equal(parseSocialUrl("https://x.com/candemsoft").network, "x");
  assert.equal(parseSocialUrl("https://twitter.com/candemsoft").network, "x");
  assert.equal(parseSocialUrl("https://example.com/custom").network, "other");
});

test("getAllSocialGroups includes Candemsoft and all products from content", () => {
  const groups = getAllSocialGroups();
  const ids = groups.map((g) => g.id);

  assert.ok(ids.includes("candemsoft"), "Candemsoft company group must be present");
  for (const p of products) {
    assert.ok(ids.includes(p.slug), `Product ${p.slug} must be present in all groups`);
  }
});

test("getActiveSocialGroups filters out products with no social media links", () => {
  const active = getActiveSocialGroups();
  const activeIds = active.map((g) => g.id);

  assert.ok(activeIds.includes("candemsoft"), "Candemsoft has active social links");
  assert.ok(activeIds.includes("seyyah"), "Seyyah has active social links");
  assert.ok(activeIds.includes("orpigo"), "Orpigo has active social links");
  assert.ok(activeIds.includes("kisisel-qr"), "Kişisel QR has active social links");

  // CandemFit and Candemkey do not have social media accounts in content
  assert.ok(!activeIds.includes("candemfit"), "CandemFit has no links and must not be in active groups");
  assert.ok(!activeIds.includes("candemkey"), "Candemkey has no links and must not be in active groups");

  // All active groups must have at least 1 link
  for (const g of active) {
    assert.ok(g.links.length > 0, `Group ${g.id} must have at least one link`);
    for (const l of g.links) {
      assert.ok(l.url.startsWith("https://"), `Link ${l.url} must be valid https`);
      assert.ok(l.networkName.length > 0, "Network name must be non-empty");
    }
  }
});

test("No fabricated links exist: all active links originate strictly from content files", () => {
  const active = getActiveSocialGroups();
  const activeUrls = active.flatMap((g) => g.links.map((l) => l.url));

  const knownContentUrls = new Set<string>();
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
      `URL ${u} in active social links must exist in site.json or products.json`,
    );
  }
});

test("getMissingSocialReport identifies entities and their missing social platforms", () => {
  const report = getMissingSocialReport();
  assert.ok(Array.isArray(report));
  assert.ok(report.length >= 6);

  const candemfitReport = report.find((r) => r.entity === "CandemFit");
  assert.ok(candemfitReport, "CandemFit must be in report");
  assert.equal(candemfitReport.activeLinks.length, 0, "CandemFit active links should be 0");
  assert.ok(candemfitReport.missingNetworks.includes("Instagram"));

  const candemkeyReport = report.find((r) => r.entity === "Candemkey");
  assert.ok(candemkeyReport, "Candemkey must be in report");
  assert.equal(candemkeyReport.activeLinks.length, 0, "Candemkey active links should be 0");

  const candemsoftReport = report.find((r) => r.entity === "Candemsoft");
  assert.ok(candemsoftReport, "Candemsoft must be in report");
  assert.ok(candemsoftReport.activeLinks.some((l) => l.includes("linkedin.com")));
  assert.ok(candemsoftReport.activeLinks.some((l) => l.includes("instagram.com")));
});
