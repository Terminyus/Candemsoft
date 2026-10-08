/**
 * Static export mode (GitHub Pages). Set by scripts/build-pages.mjs; off for the normal
 * server build. In this mode there is no proxy, so every URL carries its locale and
 * internal (Turkish) segment, and public files need the repository base path.
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
/**
 * v2 served at the site root behind nginx (candemsoft.com): public-style URLs (/hizmetler, /en/about)
 * without the /v2 prefix; nginx maps them to the exported /v2/<lang>/... files.
 */
export const v2Root = process.env.NEXT_PUBLIC_V2_ROOT === "1";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Public-folder URL that works under a base path (next/image does not prefix string src). */
export function asset(path: string): string {
  return path.startsWith("/") ? basePath + path : path;
}
