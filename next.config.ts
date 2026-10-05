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
    return [
      { source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // Full script CSP would need nonces (and dynamic rendering); these directives are safe with static pages.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  experimental: {
    // Root layout sits under [lang]; see src/app/global-not-found.tsx.
    globalNotFound: true,
  },
};

// GitHub Pages build (scripts/build-pages.mjs): static files under the repository path.
// Headers, the proxy, image optimisation and the global 404 need a server, so they're off.
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const staticConfig: NextConfig = {
  pageExtensions: nextConfig.pageExtensions,
  poweredByHeader: false,
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
};

const withMDX = createMDX({});

export default withMDX(staticExport ? staticConfig : nextConfig);
