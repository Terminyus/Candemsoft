import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getProjects, getProducts } from "./content";

const publicDir = path.join(process.cwd(), "public");

test("brand logos exist in AVIF, WebP, and PNG formats", () => {
  const logos = [
    "brand/logo-on-light.avif",
    "brand/logo-on-light.webp",
    "brand/logo-on-light.png",
    "brand/logo-on-dark.avif",
    "brand/logo-on-dark.webp",
    "brand/logo-on-dark.png",
  ];
  for (const rel of logos) {
    const full = path.join(publicDir, rel);
    assert.ok(fs.existsSync(full), `Expected logo file to exist: ${rel}`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 0, `Logo file should not be empty: ${rel}`);
  }
});

test("all live products have AVIF, WebP, and original icons", () => {
  const products = getProducts().filter((p) => p.status === "live");
  assert.ok(products.length >= 4, "Expected at least 4 live products");
  for (const product of products) {
    assert.ok(product.icon, `Product ${product.slug} must have an icon defined`);
    const base = product.icon.replace(/\.[^.]+$/, "");
    const ext = path.extname(product.icon);
    const variants = [`${base}${ext}`, `${base}.webp`, `${base}.avif`];
    for (const rel of variants) {
      const relClean = rel.replace(/^\//, "");
      const full = path.join(publicDir, relClean);
      assert.ok(fs.existsSync(full), `Product ${product.slug} icon variant missing: ${relClean}`);
      assert.ok(fs.statSync(full).size > 0, `Icon variant should not be empty: ${relClean}`);
    }
  }
});

test("all live projects have desktop and mobile responsive AVIF and WebP screenshot variants", () => {
  const projects = getProjects().filter((p) => p.status === "live");
  assert.ok(projects.length >= 3, "Expected at least 3 live projects");
  for (const project of projects) {
    const variants = [
      `projects/${project.slug}/desktop.webp`,
      `projects/${project.slug}/desktop.avif`,
      `projects/${project.slug}/desktop-sm.webp`,
      `projects/${project.slug}/desktop-sm.avif`,
      `projects/${project.slug}/mobile.webp`,
      `projects/${project.slug}/mobile.avif`,
      `projects/${project.slug}/mobile-sm.webp`,
      `projects/${project.slug}/mobile-sm.avif`,
    ];
    for (const rel of variants) {
      const full = path.join(publicDir, rel);
      assert.ok(fs.existsSync(full), `Project ${project.slug} image variant missing: ${rel}`);
      const size = fs.statSync(full).size;
      assert.ok(size > 0, `Project image variant must not be empty: ${rel}`);
      // Small variant must be smaller than or equal to large variant
      if (rel.includes("-sm.avif")) {
        const lgRel = rel.replace("-sm.avif", ".avif");
        const lgSize = fs.statSync(path.join(publicDir, lgRel)).size;
        assert.ok(size <= lgSize, `sm variant (${size}B) should be <= lg variant (${lgSize}B) for ${rel}`);
      }
    }
  }
});

test("critical self-hosted font files exist and are non-empty", () => {
  const requiredFonts = [
    "fonts/instrument-latin.v1.woff2",
    "fonts/instrument-latin-ext.v1.woff2",
    "fonts/archivo-v2-display-latin.v1.woff2",
    "fonts/archivo-v2-display-latin-ext.v1.woff2",
    "fonts/archivo-v2-heading-latin.v1.woff2",
    "fonts/archivo-v2-heading-latin-ext.v1.woff2",
    "fonts/caveat-v2-latin.v1.woff2",
    "fonts/caveat-v2-latin-ext.v1.woff2",
  ];
  for (const font of requiredFonts) {
    const full = path.join(publicDir, font);
    assert.ok(fs.existsSync(full), `Required font file missing: ${font}`);
    assert.ok(fs.statSync(full).size > 1000, `Font file unexpectedly small: ${font}`);
  }
});
