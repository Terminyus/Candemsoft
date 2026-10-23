import assert from "node:assert/strict";
import test from "node:test";
import { initials, slugify, textOf } from "./text";

test("slugify keeps Turkish headings readable and stable", () => {
  assert.equal(slugify("CSS de kurtarmıyor"), "css-de-kurtarmiyor");
  assert.equal(slugify("Doğru dönüşüm"), "dogru-donusum");
  assert.equal(slugify("  İletişim: nasıl?  "), "iletisim-nasil");
});

test("textOf flattens MDX children", () => {
  assert.equal(textOf(["A ", { props: { children: "code" } }, " B"]), "A code B");
});

test("initials use first name and surname", () => {
  assert.equal(initials("Ahmet Can Yüksel"), "AY");
  assert.equal(initials("İbrahim Çartı"), "İÇ");
});
