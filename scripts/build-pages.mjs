// Builds a static copy of the site for GitHub Pages into ./out.
// Usage: npm run build:pages            (base path defaults to /Candemsoft)
//        BASE_PATH=/other npm run build:pages
//
// The server-only files (proxy, global 404) are moved aside during the build and
// always restored. The Vercel/server build is unaffected.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const basePath = process.env.BASE_PATH ?? "/Candemsoft";
const aside = ["src/proxy.ts", "src/app/global-not-found.tsx"];
const moved = [];
try {
  for (const f of aside) {
    if (fs.existsSync(f)) {
      fs.renameSync(f, `${f}.pages-off`);
      moved.push(f);
    }
  }
  fs.rmSync("out", { recursive: true, force: true });
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath },
  });
} finally {
  for (const f of moved) fs.renameSync(`${f}.pages-off`, f);
}

// Roots of each site (classic and the alternative /v2): Turkish is the default language.
function redirect(file, target) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Candemsoft</title>` +
      `<meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://candemsoft.com/">` +
      `<script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script></head>` +
      `<body><a href="${target}">Candemsoft</a></body></html>`,
  );
}
redirect("out/index.html", `${basePath}/tr/`);
for (const site of ["v2", "v3", "v4"])
  if (fs.existsSync(`out/${site}`)) redirect(`out/${site}/index.html`, `${basePath}/${site}/tr/`);
// Pages serves 404.html for unknown paths; use the localized not-found page.
const notFound = ["out/404.html", "out/tr/404.html", "out/_not-found.html", "out/_not-found/index.html"].find((f) => fs.existsSync(f));
if (notFound && notFound !== "out/404.html") fs.copyFileSync(notFound, "out/404.html");
// Without this, Jekyll would drop the _next folder.
fs.writeFileSync("out/.nojekyll", "");
console.log(`\nPages build ready in ./out (base path ${basePath}). 404: ${notFound ?? "none"}`);
