import { preload } from "react-dom";

const files = ["/fonts/bricolage-display-latin.v1.woff2", "/fonts/bricolage-display-latin-ext.v1.woff2"];

/** Both subsets are needed on every page: Turkish headings use ş, ğ, ı, İ from latin-ext. */
export function preloadDisplayFont() {
  for (const href of files) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
}
