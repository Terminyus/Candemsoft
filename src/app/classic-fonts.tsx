import { FontFaces } from "@/lib/fonts";

/** Classic design: Schibsted Grotesk (variable 400–800) for headings and text. */
export function ClassicFonts() {
  return (
    <FontFaces
      faces={[{ family: "Schibsted Grotesk", file: "schibsted", weight: "400 800", preload: true }]}
      fallbacks={[
        { family: "Schibsted Fallback", local: "Arial", weight: 400, sizeAdjust: "104.4%" },
        { family: "Schibsted Fallback", local: "Arial Bold", weight: 800, sizeAdjust: "105.2%" },
      ]}
      vars={`--ff-body:"Schibsted Grotesk","Schibsted Fallback",system-ui,sans-serif;`}
    />
  );
}
