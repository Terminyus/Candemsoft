import type { Metadata } from "next";
import { defaultLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import type { PostMeta, Product } from "@/lib/content";
import site from "@content/site.json";

export const siteUrl = site.url;

const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US", es: "es_ES" };

/**
 * Canonical URL, hreflang alternates and Open Graph basics for a page.
 * `availableIn` limits alternates for content that exists in one language only (e.g. a post).
 */
export function pageMetadata({
  lang,
  route,
  rest = [],
  title,
  description,
  availableIn = locales,
  type = "website",
}: {
  lang: Locale;
  route: RouteKey;
  rest?: string[];
  title?: string;
  description?: string;
  availableIn?: readonly Locale[];
  type?: "website" | "article";
}): Metadata {
  const languages: Record<string, string> = {};
  for (const l of availableIn) languages[l] = href(l, route, ...rest);
  if (availableIn.includes(defaultLocale)) languages["x-default"] = href(defaultLocale, route, ...rest);
  return {
    title,
    description,
    alternates: { canonical: href(lang, route, ...rest), languages },
    openGraph: {
      type,
      siteName: "Candemsoft",
      locale: ogLocale[lang],
      alternateLocale: availableIn.filter((l) => l !== lang).map((l) => ogLocale[l]),
      url: href(lang, route, ...rest),
      title: title ?? undefined,
      description,
    },
    twitter: { card: "summary_large_image", title: title ?? undefined, description },
  };
}

export function organizationJsonLd(lang: Locale, description: string) {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Candemsoft",
        url: siteUrl,
        logo: `${siteUrl}/brand/logo-on-light.png`,
        description,
        foundingDate: String(site.foundedYear),
        email: site.contact.email,
        telephone: site.contact.phone.replace(/\s/g, ""),
        address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.contact.email,
          telephone: site.contact.phone.replace(/\s/g, ""),
          availableLanguage: ["Turkish", "English"],
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Candemsoft",
        inLanguage: localeTags[lang],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** BlogPosting structured data (same shape for every design). */
export function articleJsonLd(lang: Locale, meta: PostMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    inLanguage: localeTags[lang],
    keywords: meta.tags.join(", "),
    author: { "@type": "Organization", name: meta.author, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}${href(lang, "blog", meta.slug)}`,
  };
}

/** SoftwareApplication structured data for a product with store links. */
export function softwareJsonLd(lang: Locale, product: Product, name: string) {
  const os = [product.platforms.includes("ios") && "iOS", product.platforms.includes("android") && "Android", product.platforms.includes("web") && "Web"].filter(Boolean).join(", ");
  const sameAs = [product.links.web, product.links.appStore, product.links.googlePlay].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description: product.description[lang],
    applicationCategory: product.platforms.includes("ios") || product.platforms.includes("android") ? "MobileApplication" : "WebApplication",
    operatingSystem: os,
    inLanguage: localeTags[lang],
    publisher: { "@id": `${siteUrl}/#organization` },
    ...(product.links.web ? { url: product.links.web } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
