import { FontFaces } from "@/lib/fonts";

/** Kurumsal mixes the classic design's Schibsted Grotesk with Derleme's Geist Mono for code. */
export function V5Fonts() {
  return (
    <FontFaces
      faces={[
        { family: "Schibsted Grotesk", file: "schibsted", weight: "400 800", preload: true },
        { family: "Geist Mono", file: "v4-geist-mono", weight: "400 600" },
      ]}
      fallbacks={[
        { family: "Schibsted Fallback", local: "Arial", weight: 400, sizeAdjust: "104.4%" },
        { family: "Schibsted Fallback", local: "Arial Bold", weight: 800, sizeAdjust: "105.2%" },
      ]}
    />
  );
}
