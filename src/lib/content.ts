import "server-only";
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
  links: { appStore: string; googlePlay: string; web: string };
  icon: string;
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
  description: string;
  date: string;
  author: string;
  tags: string[];
};

export function getPostSlugs(lang: Locale): string[] {
  const suffix = `.${lang}.mdx`;
  return fs
    .readdirSync(path.join(root, "blog"))
    .filter((f) => f.endsWith(suffix))
    .map((f) => f.slice(0, -suffix.length));
}

export async function getPost(lang: Locale, slug: string) {
  const mod = await import(`@content/blog/${slug}.${lang}.mdx`);
  return { Post: mod.default as React.ComponentType, meta: { ...(mod.meta as Omit<PostMeta, "slug">), slug } };
}

export async function getPosts(lang: Locale): Promise<PostMeta[]> {
  const posts = await Promise.all(getPostSlugs(lang).map(async (slug) => (await getPost(lang, slug)).meta));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** True when a file exists under /public (used to fall back gracefully before screenshots exist). */
export function publicFileExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

export function readingMinutes(lang: Locale, slug: string): number {
  const src = fs.readFileSync(path.join(root, "blog", `${slug}.${lang}.mdx`), "utf8");
  const words = src.replace(/export const meta[\s\S]*?\};/, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
