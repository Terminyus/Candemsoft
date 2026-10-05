import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async headers() {
    // Self-hosted font files are versioned in their names (.v1), so they can be cached forever.
    return [{ source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
  experimental: {
    // Root layout sits under [lang]; see src/app/global-not-found.tsx.
    globalNotFound: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
