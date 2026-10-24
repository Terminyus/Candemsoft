export type Locale = "tr" | "en" | "es";

export type SocialNetwork = "instagram" | "linkedin" | "youtube" | "tiktok" | "github" | "x";

export type SocialLink = {
  network: SocialNetwork | "other";
  networkName: string;
  url: string;
};

export type SocialGroup = {
  id: string;
  name: string;
  category: Record<Locale, string>;
  icon?: string;
  links: SocialLink[];
};

export type SiteData = {
  social?: Record<string, string>;
};

export type ProductData = {
  slug: string;
  name: string;
  icon?: string;
  social?: string[];
};

export const NETWORKS: { host: string; network: SocialNetwork; name: string }[] = [
  { host: "instagram.com", network: "instagram", name: "Instagram" },
  { host: "linkedin.com", network: "linkedin", name: "LinkedIn" },
  { host: "youtube.com", network: "youtube", name: "YouTube" },
  { host: "tiktok.com", network: "tiktok", name: "TikTok" },
  { host: "github.com", network: "github", name: "GitHub" },
  { host: "x.com", network: "x", name: "X" },
  { host: "twitter.com", network: "x", name: "X" },
];

/**
 * Strict URL parsing with hostname extraction and domain boundary matching.
 * Prevents sub-string collisions such as box.com or max.com matching x.com.
 */
export function parseSocialUrl(rawUrl: string): SocialLink {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { network: "other", networkName: "Web", url: rawUrl };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

  // Special case: YouTube short URL (youtu.be)
  if (hostname === "youtu.be") {
    return { network: "youtube", networkName: "YouTube", url: rawUrl };
  }

  // Exact hostname or sub-domain matching (.instagram.com, .linkedin.com, etc.)
  for (const n of NETWORKS) {
    if (hostname === n.host || hostname.endsWith("." + n.host)) {
      return { network: n.network, networkName: n.name, url: rawUrl };
    }
  }

  return { network: "other", networkName: hostname, url: rawUrl };
}

const PRODUCT_CATEGORIES: Record<string, Record<Locale, string>> = {
  seyyah: { tr: "Şehir Keşfi", en: "Travel & Discovery", es: "Descubrimiento" },
  orpigo: { tr: "Hızlı Okuma", en: "Speed Reading", es: "Lectura Rápida" },
  "kisisel-qr": { tr: "Araç Güvenliği", en: "Vehicle Safety", es: "Seguridad Vehicular" },
  candemfit: { tr: "Sosyal Fitness", en: "Social Fitness", es: "Fitness Social" },
  candemkey: { tr: "Yapay Zekâ Klavye", en: "AI Keyboard", es: "Teclado IA" },
};

export function getAllSocialGroups(site: SiteData, products: ProductData[]): SocialGroup[] {
  const companyLinks: SocialLink[] = Object.values(site?.social ?? {})
    .filter((url) => typeof url === "string" && url.trim().length > 0)
    .map((url) => parseSocialUrl(url));

  const companyGroup: SocialGroup = {
    id: "candemsoft",
    name: "Candemsoft",
    category: {
      tr: "Kurumsal",
      en: "Company",
      es: "Corporativo",
    },
    icon: "/brand/mark.png",
    links: companyLinks,
  };

  const productGroups: SocialGroup[] = (products ?? []).map((p) => {
    const rawLinks = p.social ?? [];
    const validLinks = rawLinks
      .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
      .map(parseSocialUrl);

    return {
      id: p.slug,
      name: p.name,
      category: PRODUCT_CATEGORIES[p.slug] ?? {
        tr: "Ürün",
        en: "Product",
        es: "Producto",
      },
      icon: p.icon,
      links: validLinks,
    };
  });

  return [companyGroup, ...productGroups];
}

export function getActiveSocialGroups(site: SiteData, products: ProductData[]): SocialGroup[] {
  return getAllSocialGroups(site, products).filter((g) => g.links.length > 0);
}

export function getMissingSocialReport(site: SiteData, products: ProductData[]): {
  id: string;
  entity: string;
  activeLinks: string[];
  missingNetworks: string[];
}[] {
  const expectedNetworks: SocialNetwork[] = ["instagram", "linkedin", "youtube", "tiktok", "github", "x"];
  const groups = getAllSocialGroups(site, products);

  return groups.map((g) => {
    const activeNetSet = new Set(g.links.map((l) => l.network));
    const active = g.links.map((l) => `${l.networkName} (${l.url})`);
    const missing = expectedNetworks
      .filter((n) => !activeNetSet.has(n))
      .map((n) => NETWORKS.find((item) => item.network === n)?.name ?? n);

    return {
      id: g.id,
      entity: g.name,
      activeLinks: active,
      missingNetworks: missing,
    };
  });
}

// Relative luminance & WCAG contrast calculation
export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function getLuminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}
