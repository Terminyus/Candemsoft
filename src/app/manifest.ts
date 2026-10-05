import type { MetadataRoute } from "next";
import { asset } from "@/lib/static";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Candemsoft",
    short_name: "Candemsoft",
    description: "Candemsoft — web, mobil ve yapay zekâ yazılımı, İstanbul.",
    start_url: asset("/"),
    display: "standalone",
    background_color: "#0e0d0b",
    theme_color: "#0e0d0b",
    lang: "tr",
    icons: [
      { src: asset("/icon.png"), sizes: "512x512", type: "image/png" },
      { src: asset("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
