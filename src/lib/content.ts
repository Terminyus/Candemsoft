import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";
import site from "@content/site.json";
import services from "@content/services.json";
import stack from "@content/stack.json";
import products from "@content/products.json";
import team from "@content/team.json";

export type Localized<T = string> = Record<Locale, T>;

export const projectCategories = ["web", "mobil", "kurumsal", "e-ticaret"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  name: string;
  url: string;
  status: "live" | "offline";
  order: number;
  featured: boolean;
  ownProduct?: boolean;
  categories: ProjectCategory[];
  type: Localized;
  sector: Localized;
  summary: Localized;
  year: number | null;
  services: string[];
  stack: string[];
  caseStudy: { challenge: Localized; approach: Localized; outcome: Localized };
  images: { desktop: string; mobile: string };
  metaTitle?: Localized;
};

export type Service = (typeof services)[number];
export type Product = {
  slug: string;
  name: string;
  status: "live" | "soon";
  platforms: ("ios" | "android" | "web")[];
  androidSoon?: boolean;
  tagline: Localized;
  description: Localized;
  features: Localized<string[]>;
  links: { appStore: string; googlePlay: string; web: string };
  /** Official social profiles of the product (used as schema.org sameAs). */
  social?: string[];
  icon: string;
  /** Slug of the matching entry in content/projects (screenshots, case study). */
  project?: string;
};
export type TeamMember = {
  name: string;
  role: Localized;
  photo: string;
  bio: Localized;
  links: { linkedin: string; github: string };
  placeholder?: boolean;
};

const root = path.join(process.cwd(), "content");

export function getSite() {
  return site;
}

export function getServices(): Service[] {
  return services;
}

export function getStack(): string[] {
  return stack;
}

export function getProducts(): Product[] {
  return products as Product[];
}

export function getProductByProject(slug: string): Product | undefined {
  return getProducts().find((p) => (p.project ?? p.slug) === slug);
}

export function getTeam(): TeamMember[] {
  return team.members as TeamMember[];
}

export function getProjects(): Project[] {
  const dir = path.join(root, "projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Project)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export type PostMeta = {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
};

export function getPostSlugs(lang: Locale): string[] {
  const suffix = `.${lang}.mdx`;
  return fs
    .readdirSync(path.join(root, "blog"))
    .filter((f) => f.endsWith(suffix))
    .map((f) => f.slice(0, -suffix.length));
}

export function parsePostMetaString(src: string, filename = "mdx"): Omit<PostMeta, "slug"> {
  const metaMatch = src.match(/export const meta\s*=\s*(\{[\s\S]*?\n?\s*\});/);
  if (!metaMatch) {
    throw new Error(`Missing meta export in ${filename}`);
  }
  let parsed: unknown;
  try {
    parsed = new Function(`return (${metaMatch[1]});`)();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to evaluate meta export in ${filename}: ${msg}`);
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Meta export in ${filename} must be an object`);
  }
  const meta = parsed as Record<string, unknown>;
  if (typeof meta.title !== "string" || !meta.title.trim()) {
    throw new Error(`Missing or invalid 'title' in meta of ${filename}`);
  }
  if (typeof meta.description !== "string" || !meta.description.trim()) {
    throw new Error(`Missing or invalid 'description' in meta of ${filename}`);
  }
  if (typeof meta.date !== "string" || !meta.date.trim()) {
    throw new Error(`Missing or invalid 'date' in meta of ${filename}`);
  }
  if (typeof meta.author !== "string" || !meta.author.trim()) {
    throw new Error(`Missing or invalid 'author' in meta of ${filename}`);
  }
  if (!Array.isArray(meta.tags) || meta.tags.length === 0) {
    throw new Error(`Missing or invalid 'tags' in meta of ${filename}`);
  }
  return meta as unknown as Omit<PostMeta, "slug">;
}

export function getPostMeta(lang: Locale, slug: string): PostMeta {
  const filePath = path.join(root, "blog", `${slug}.${lang}.mdx`);
  const src = fs.readFileSync(filePath, "utf8");
  const meta = parsePostMetaString(src, `${slug}.${lang}.mdx`);
  return { ...meta, slug };
}

export async function getPost(lang: Locale, slug: string) {
  const meta = getPostMeta(lang, slug);
  const mod = await import(`@content/blog/${slug}.${lang}.mdx`);
  return { Post: mod.default as React.ComponentType, meta };
}

export async function getPosts(lang: Locale): Promise<PostMeta[]> {
  const posts = getPostSlugs(lang).map((slug) => getPostMeta(lang, slug));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getRelatedPosts(lang: Locale, currentSlug: string, limit = 3): Promise<PostMeta[]> {
  const posts = await getPosts(lang);
  const current = posts.find((p) => p.slug === currentSlug);
  if (!current) return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);

  const currentTags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  const scored = posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;
      for (const t of p.tags ?? []) {
        if (currentTags.has(t.toLowerCase())) score++;
      }
      return { post: p, score };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.date.localeCompare(a.post.date);
  });

  return scored.slice(0, limit).map((s) => s.post);
}

/** True when a file exists under /public (used to fall back gracefully before screenshots exist). */
export function publicFileExists(publicPath: string): boolean {
  if (!publicPath || typeof publicPath !== "string") return false;
  const publicDir = path.resolve(process.cwd(), "public");
  const cleanPath = publicPath.replace(/^\/+/, "");
  const target = path.resolve(publicDir, cleanPath);
  if (!target.startsWith(publicDir + path.sep) && target !== publicDir) return false;
  return fs.existsSync(target);
}

export function readingMinutes(lang: Locale, slug: string): number {
  const src = fs.readFileSync(path.join(root, "blog", `${slug}.${lang}.mdx`), "utf8");
  const words = src.replace(/export const meta[\s\S]*?\};/, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Extracts FAQ question-answer pairs from the post's MDX content if present. */
export function getPostFaqs(lang: Locale, slug: string): Array<{ question: string; answer: string }> {
  const filePath = path.join(root, "blog", `${slug}.${lang}.mdx`);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");

  const headingMatch = content.match(
    /^##\s+(?:Sıkça\s+Sorulan\s+Sorular|Sık\s+Sorulan\s+Sorular|Frequently\s+Asked\s+Questions|Preguntas\s+Frecuentes|FAQ)\s*$/im,
  );
  if (!headingMatch || headingMatch.index === undefined) return [];

  const afterHeading = content.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingMatch = afterHeading.search(/\n##\s+/);
  const section = nextHeadingMatch !== -1 ? afterHeading.slice(0, nextHeadingMatch) : afterHeading;

  const items: Array<{ question: string; answer: string }> = [];

  if (/^###\s+/m.test(section)) {
    const parts = section.split(/\n(?=###\s+)/);
    for (const part of parts) {
      const match = part.match(/^###\s+([^\n]+)\n+([\s\S]*)$/);
      if (match) {
        const question = match[1].replace(/^\d+[\.\)]\s*/, "").trim();
        const answer = match[2].trim();
        if (question && answer) {
          items.push({ question, answer });
        }
      }
    }
  } else {
    const parts = section.split(/\n*(?=\*\*[^*]+\?\*\*)/);
    for (const part of parts) {
      const match = part.match(/^\*\*([^*]+\?)\*\*\s*([\s\S]*)$/);
      if (match) {
        const question = match[1].replace(/^\d+[\.\)]\s*/, "").trim();
        const answer = match[2].trim();
        if (question && answer) {
          items.push({ question, answer });
        }
      }
    }
  }

  return items;
}

