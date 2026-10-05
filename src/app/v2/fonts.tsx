import { preload } from "react-dom";
import { asset } from "@/lib/static";

/*
 * Vitrin type, self-hosted as static cuts instanced from the variable fonts (OFL):
 *   Archivo wdth 125 / wght 800  → "Archivo V2 Display" (headlines)
 *   Archivo wdth 112 / wght 700  → "Archivo V2 Heading" (subheads, UI)
 *   Caveat wght 700              → "Caveat V2" (Seyyah room only)
 * Instancing cut Archivo from ~176 KB to ~52 KB. Caveat isn't preloaded: the rooms
 * use content-visibility, so it's fetched only when the Seyyah room comes near.
 */
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const faces = [
  { family: "Archivo V2 Display", file: "archivo-v2-display", weight: 800, preload: true },
  { family: "Archivo V2 Heading", file: "archivo-v2-heading", weight: 700, preload: true },
  { family: "Caveat V2", file: "caveat-v2", weight: 700, preload: false },
];

const css = faces
  .flatMap((f) =>
    (["latin-ext", "latin"] as const).map(
      (sub) =>
        `@font-face{font-family:"${f.family}";src:url("${asset(`/fonts/${f.file}-${sub}.v1.woff2`)}") format("woff2");font-weight:${f.weight};font-display:swap;unicode-range:${sub === "latin" ? LATIN : LATIN_EXT}}`,
    ),
  )
  .join("\n");

// Metric-matched fallbacks so the swap keeps line breaks (tuned against the hero headline).
const fallbacks = `
@font-face{font-family:"Archivo V2 Display Fallback";src:local("Arial Black");size-adjust:111.3%}
@font-face{font-family:"Archivo V2 Heading Fallback";src:local("Arial");font-weight:700;size-adjust:110.7%}`;

export function V2Fonts() {
  for (const f of faces.filter((x) => x.preload))
    for (const sub of ["latin", "latin-ext"])
      preload(asset(`/fonts/${f.file}-${sub}.v1.woff2`), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <style dangerouslySetInnerHTML={{ __html: css + fallbacks }} />;
}
