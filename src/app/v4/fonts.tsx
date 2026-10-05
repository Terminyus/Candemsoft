import { FontFaces } from "@/lib/fonts";

/** Derleme: Geist for everything, Geist Mono for code (both variable, OFL). */
export function V4Fonts() {
  return (
    <FontFaces
      faces={[
        { family: "Geist", file: "v4-geist", weight: "400 800", preload: true },
        { family: "Geist Mono", file: "v4-geist-mono", weight: "400 600", preload: true },
      ]}
      fallbacks={[{ family: "Geist Fallback", local: "Arial", sizeAdjust: "100%" }]}
    />
  );
}
