import { preload } from "react-dom";
import { asset } from "@/lib/static";

/*
 * Self-hosted fonts, declared and preloaded per root layout. next/font is avoided for
 * these on purpose: with three root layouts sharing one stylesheet, Turbopack preloaded
 * every next/font family on every page of every design.
 */

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

export type Face = {
  family: string;
  /** File stem in public/fonts: "<file>-latin.v1.woff2" and "<file>-latin-ext.v1.woff2". */
  file: string;
  weight: string | number;
  style?: "normal" | "italic";
  preload?: boolean;
};

/** Metric-matched local fallback so the swap doesn't reflow text (CLS). */
export type Fallback = { family: string; local: string; weight?: string | number; sizeAdjust: string };

export function FontFaces({ faces, fallbacks = [], vars = "" }: { faces: Face[]; fallbacks?: Fallback[]; vars?: string }) {
  for (const f of faces.filter((x) => x.preload))
    for (const sub of ["latin", "latin-ext"])
      preload(asset(`/fonts/${f.file}-${sub}.v1.woff2`), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  const css = [
    ...faces.flatMap((f) =>
      (["latin-ext", "latin"] as const).map(
        (sub) =>
          `@font-face{font-family:"${f.family}";src:url("${asset(`/fonts/${f.file}-${sub}.v1.woff2`)}") format("woff2");font-weight:${f.weight};font-style:${f.style ?? "normal"};font-display:swap;unicode-range:${sub === "latin" ? LATIN : LATIN_EXT}}`,
      ),
    ),
    ...fallbacks.map(
      (fb) => `@font-face{font-family:"${fb.family}";src:local("${fb.local}");${fb.weight ? `font-weight:${fb.weight};` : ""}size-adjust:${fb.sizeAdjust}}`,
    ),
    vars ? `:root{${vars}}` : "",
  ].join("\n");
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
