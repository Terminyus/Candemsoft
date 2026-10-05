import { preload } from "react-dom";
import { asset } from "@/lib/static";

/*
 * Serif faces, self-hosted as static cuts instanced from the variable fonts (OFL):
 *   Fraunces opsz 144 / 800  → "V3 Headline"   (masthead, headlines)
 *   Newsreader opsz 14 / 400, 650 and italic   → "V3 Text" (body, decks; 650 also for subheads)
 */
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const faces = [
  // Kickers, section labels and the nav: the classic newspaper sans.
  { family: "Libre Franklin", file: "franklin-800", weight: 800, style: "normal", preload: false }, // small labels: fine to swap in
  { family: "V3 Headline", file: "v3-fraunces-headline", weight: 800, style: "normal", preload: true },
  { family: "V3 Text", file: "v3-newsreader-text", weight: 400, style: "normal", preload: true },
  { family: "V3 Text", file: "v3-newsreader-textbold", weight: 650, style: "normal", preload: false },
  { family: "V3 Text", file: "v3-newsreader-italic", weight: 400, style: "italic", preload: true }, // decks are often the LCP
];

const css = faces
  .flatMap((f) =>
    (["latin-ext", "latin"] as const).map(
      (sub) =>
        `@font-face{font-family:"${f.family}";src:url("${asset(`/fonts/${f.file}-${sub}.v1.woff2`)}") format("woff2");font-weight:${f.weight};font-style:${f.style};font-display:swap;unicode-range:${sub === "latin" ? LATIN : LATIN_EXT}}`,
    ),
  )
  .join("\n");

export function V3Fonts() {
  for (const f of faces.filter((x) => x.preload))
    for (const sub of ["latin", "latin-ext"])
      preload(asset(`/fonts/${f.file}-${sub}.v1.woff2`), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <style dangerouslySetInnerHTML={{ __html: css + `:root{--ff-franklin:"Libre Franklin",Arial,sans-serif}` }} />;
}
