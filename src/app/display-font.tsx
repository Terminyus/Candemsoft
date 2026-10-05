import { preload } from "react-dom";
import { asset } from "@/lib/static";

/*
 * Display face: Bricolage Grotesque, opsz pinned at 96 (its display cut), wght 600,
 * wdth variable 75–100. Self-hosted from public/fonts because next/font can't pin an
 * axis (OFL, see src/assets/fonts/OFL.txt). Declared here rather than in globals.css
 * so the URLs carry the base path on GitHub Pages.
 */
const latin = asset("/fonts/bricolage-display-latin.v1.woff2");
const latinExt = asset("/fonts/bricolage-display-latin-ext.v1.woff2");

const css = `
@font-face{font-family:"Bricolage Display";src:url("${latinExt}") format("woff2");font-weight:600;font-stretch:75% 100%;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Bricolage Display";src:url("${latin}") format("woff2");font-weight:600;font-stretch:75% 100%;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Bricolage Display Fallback";src:local("Arial");ascent-override:88.21%;descent-override:25.61%;line-gap-override:0%;size-adjust:81.3%}
`;

/** Both subsets are needed on every page: Turkish headings use ş, ğ, ı, İ from latin-ext. */
export function DisplayFont() {
  preload(latin, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload(latinExt, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
