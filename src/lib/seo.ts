import type { Metadata } from "next";
import { defaultLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { publicFileExists, type PostMeta, type Product } from "@/lib/content";
import site from "@content/site.json";

export const siteUrl = site.url;

const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US", es: "es_ES" };

export type OgImageInput =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

const HTTP_URL_REGEX = /^https?:\/\//i;

export function toAbsoluteUrl(urlPath: string): string {
  if (HTTP_URL_REGEX.test(urlPath)) return urlPath;
  const clean = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
  return `${siteUrl}${clean}`;
}

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
  image,
  availableIn = locales,
  type = "website",
}: {
  lang: Locale;
  route: RouteKey;
  rest?: string[];
  title?: string;
  description?: string;
  image?: OgImageInput;
  availableIn?: readonly Locale[];
  type?: "website" | "article";
}): Metadata {
  const languages: Record<string, string> = {};
  for (const l of availableIn) languages[l] = href(l, route, ...rest);
  if (availableIn.includes(defaultLocale)) languages["x-default"] = href(defaultLocale, route, ...rest);

  const defaultOgRelative = "/og/default.png";
  const fallbackOgRelative = publicFileExists(defaultOgRelative)
    ? defaultOgRelative
    : publicFileExists("/brand/logo-on-light.png")
      ? "/brand/logo-on-light.png"
      : undefined;

  let ogImage: { url: string; width: number; height: number } | undefined;

  if (image) {
    const rawUrl = typeof image === "string" ? image : image.url;
    if (rawUrl && typeof rawUrl === "string") {
      if (HTTP_URL_REGEX.test(rawUrl)) {
        ogImage = {
          url: rawUrl,
          width: typeof image === "object" && image.width ? image.width : 1200,
          height: typeof image === "object" && image.height ? image.height : 630,
        };
      } else if (publicFileExists(rawUrl)) {
        const clean = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
        const isDesktopWebp = clean.endsWith("desktop.webp");
        ogImage = {
          url: toAbsoluteUrl(clean),
          width: typeof image === "object" && image.width ? image.width : isDesktopWebp ? 1440 : 1200,
          height: typeof image === "object" && image.height ? image.height : isDesktopWebp ? 900 : 630,
        };
      }
    }
  }

  if (!ogImage && fallbackOgRelative) {
    ogImage = {
      url: toAbsoluteUrl(fallbackOgRelative),
      width: 1200,
      height: 630,
    };
  }

  const ogImageAlt = (typeof image === "object" && image.alt) || title || "Candemsoft";
  const imageList = ogImage ? [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImageAlt }] : [];
  const twitterImages = ogImage ? [ogImage.url] : [];

  return {
    title: title ? { absolute: title } : undefined,
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
      images: imageList,
    },
    twitter: { card: "summary_large_image", title: title ?? undefined, description, images: twitterImages },
  };
}

export function organizationJsonLd(lang: Locale, description: string) {
  const sameAs = [site.social.linkedin, site.social.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Candemsoft",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/brand/logo-on-light.png`,
        description,
        foundingDate: String(site.foundedYear),
        email: site.contact.email,
        telephone: site.contact.phone,
        address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.contact.email,
          telephone: site.contact.phone,
          availableLanguage: ["Turkish", "English", "Spanish"],
        },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
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

export const breadcrumbLabels: Record<RouteKey, Record<Locale, string>> = {
  home: { tr: "Ana Sayfa", en: "Home", es: "Inicio" },
  about: { tr: "Hakkımızda", en: "About", es: "Sobre nosotros" },
  services: { tr: "Hizmetler", en: "Services", es: "Servicios" },
  projects: { tr: "Projeler", en: "Projects", es: "Proyectos" },
  products: { tr: "Ürünler", en: "Products", es: "Productos" },
  team: { tr: "Ekip", en: "Team", es: "Equipo" },
  blog: { tr: "Blog", en: "Blog", es: "Blog" },
  contact: { tr: "İletişim", en: "Contact", es: "Contacto" },
  privacy: { tr: "Gizlilik Politikası", en: "Privacy Policy", es: "Política de privacidad" },
  tools: { tr: "Araçlar", en: "Tools", es: "Herramientas" },
};

export function breadcrumbLabel(lang: Locale, key: RouteKey): string {
  return breadcrumbLabels[key]?.[lang] ?? key;
}

export function pageBreadcrumbs(
  lang: Locale,
  sectionKey: RouteKey,
  currentPage?: { name: string; url: string },
): Array<{ name: string; url: string }> {
  const items: Array<{ name: string; url: string }> = [
    { name: breadcrumbLabel(lang, "home"), url: `${siteUrl}${href(lang, "home")}` },
  ];
  if (sectionKey !== "home") {
    items.push({
      name: breadcrumbLabel(lang, sectionKey),
      url: `${siteUrl}${href(lang, sectionKey)}`,
    });
  }
  if (currentPage) {
    items.push(currentPage);
  }
  return items;
}

/** BreadcrumbList structured data for rich breadcrumbs. */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** BlogPosting structured data (same shape for every design). */
export function articleJsonLd(lang: Locale, meta: PostMeta, postUrl?: string) {
  const canonicalUrl = postUrl || `${siteUrl}${href(lang, "blog", meta.slug)}`;
  const imageUrl = meta.image ? toAbsoluteUrl(meta.image) : `${siteUrl}/og/default.png`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    inLanguage: localeTags[lang],
    keywords: meta.tags?.join(", "),
    author: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: meta.author || "Candemsoft",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Candemsoft",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo-on-light.png`,
      },
    },
    image: [imageUrl],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
  };
}

const softwareCategories: Record<string, string> = {
  seyyah: "TravelApplication",
  orpigo: "UtilitiesApplication",
  "kisisel-qr": "BusinessApplication",
  candemfit: "HealthApplication",
  candemkey: "UtilitiesApplication",
};

/** SoftwareApplication / MobileApplication structured data for a product with store links. */
export function softwareJsonLd(lang: Locale, product: Product, name: string, pageUrl?: string) {
  const isMobile = product.platforms.includes("ios") || product.platforms.includes("android");
  const canonicalUrl = pageUrl || `${siteUrl}${href(lang, "projects", product.project ?? product.slug)}`;

  const osList: string[] = [];
  if (product.platforms.includes("ios")) osList.push("iOS");
  if (product.platforms.includes("android")) osList.push("Android");
  if (product.platforms.includes("web")) osList.push("Web Browser");
  const operatingSystem = osList.length > 0 ? osList.join(", ") : "All";

  const applicationCategory =
    softwareCategories[product.slug] || (isMobile ? "MobileApplication" : "UtilitiesApplication");

  const sameAs = [product.links.web, product.links.appStore, product.links.googlePlay, ...(product.social ?? [])].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": isMobile ? "MobileApplication" : "SoftwareApplication",
    "@id": `${canonicalUrl}#software`,
    name,
    description: product.description[lang],
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    url: product.links.web || canonicalUrl,
    ...(product.icon ? { image: `${siteUrl}${product.icon}` } : {}),
    publisher: { "@id": `${siteUrl}/#organization` },
    ...(sameAs.length ? { sameAs } : {}),
    inLanguage: localeTags[lang],
  };
}

/** WebApplication / SoftwareApplication structured data for browser-based free tools. */
export function webApplicationJsonLd(lang: Locale, name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    url,
    inLanguage: localeTags[lang],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/** Service structured data for service detail pages. */
export function serviceJsonLd(lang: Locale, name: string, description: string, url: string, serviceType?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || name,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "City", name: "İstanbul" },
    ],
    url,
    inLanguage: localeTags[lang],
  };
}

/** FAQPage structured data for frequently asked questions. */
export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Merges multiple JSON-LD structures into a single valid object, removing duplicates. */
export function mergeJsonLd(
  ...items: Array<Record<string, unknown> | null | undefined | false>
): Record<string, unknown> {
  const rawNodes: Array<Record<string, unknown>> = [];

  function collect(item: unknown) {
    if (!item || typeof item !== "object") return;
    if (Array.isArray(item)) {
      for (const el of item) collect(el);
      return;
    }
    const obj = item as Record<string, unknown>;
    if (Array.isArray(obj["@graph"])) {
      for (const node of obj["@graph"]) {
        collect(node);
      }
    } else {
      const cleanNode = { ...obj };
      delete cleanNode["@context"];
      if (Object.keys(cleanNode).length > 0) {
        rawNodes.push(cleanNode);
      }
    }
  }

  for (const item of items) {
    collect(item);
  }

  const uniqueNodes: Array<Record<string, unknown>> = [];
  const seen = new Set<string>();

  for (const node of rawNodes) {
    const id = typeof node["@id"] === "string" && node["@id"].trim() ? `@id:${node["@id"].trim()}` : null;
    const typeName =
      node["@type"] && node["name"]
        ? `${Array.isArray(node["@type"]) ? node["@type"].join("+") : String(node["@type"])}:${String(node["name"])}`
        : null;
    const key = id || typeName || JSON.stringify(node);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueNodes.push(node);
    }
  }

  if (uniqueNodes.length === 1) {
    return {
      "@context": "https://schema.org",
      ...uniqueNodes[0],
    };
  }
  return {
    "@context": "https://schema.org",
    "@graph": uniqueNodes,
  };
}

