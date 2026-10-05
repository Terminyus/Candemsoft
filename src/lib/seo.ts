import type { Metadata } from "next";
import { defaultLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
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
