import type { Locale } from "@/i18n/config";
import { getProducts, getSite } from "@/lib/content";

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
  href?: string;
  links: SocialLink[];
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

export function parseSocialUrl(url: string): SocialLink {
  try {
    const matched = NETWORKS.find((n) => url.includes(n.host));
    if (matched) {
      return { network: matched.network, networkName: matched.name, url };
    }
    const host = new URL(url).hostname.replace(/^www\./, "");
    return { network: "other", networkName: host, url };
  } catch {
    return { network: "other", networkName: "Web", url };
  }
}

export function getAllSocialGroups(): SocialGroup[] {
  const site = getSite();
  const products = getProducts();

  const companyLinks: SocialLink[] = Object.entries(site.social ?? {})
    .filter(([_, url]) => typeof url === "string" && url.trim().length > 0)
    .map(([_, url]) => parseSocialUrl(url as string));

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

  const productCategories: Record<string, Record<Locale, string>> = {
    seyyah: { tr: "Şehir Keşfi", en: "Travel & Discovery", es: "Descubrimiento" },
    orpigo: { tr: "Hızlı Okuma", en: "Speed Reading", es: "Lectura Rápida" },
    "kisisel-qr": { tr: "Araç Güvenliği", en: "Vehicle Safety", es: "Seguridad Vehicular" },
    candemfit: { tr: "Sosyal Fitness", en: "Social Fitness", es: "Fitness Social" },
    candemkey: { tr: "Yapay Zekâ Klavye", en: "AI Keyboard", es: "Teclado IA" },
  };

  const productGroups: SocialGroup[] = products.map((p) => {
    const rawLinks = p.social ?? [];
    const validLinks = rawLinks
      .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
      .map(parseSocialUrl);

    return {
      id: p.slug,
      name: p.name,
      category: productCategories[p.slug] ?? {
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

export function getActiveSocialGroups(): SocialGroup[] {
  return getAllSocialGroups().filter((g) => g.links.length > 0);
}

export function getMissingSocialReport(): {
  entity: string;
  activeLinks: string[];
  missingNetworks: string[];
}[] {
  const expectedNetworks: SocialNetwork[] = ["instagram", "linkedin", "youtube", "tiktok", "github", "x"];
  const groups = getAllSocialGroups();

  return groups.map((g) => {
    const activeNetSet = new Set(g.links.map((l) => l.network));
    const active = g.links.map((l) => `${l.networkName} (${l.url})`);
    const missing = expectedNetworks
      .filter((n) => !activeNetSet.has(n))
      .map((n) => NETWORKS.find((item) => item.network === n)?.name ?? n);

    return {
      entity: g.name,
      activeLinks: active,
      missingNetworks: missing,
    };
  });
}
