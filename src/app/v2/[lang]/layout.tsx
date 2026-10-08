import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { siteUrl } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { v2Root } from "@/lib/static";
import { jsonLd, organizationJsonLd } from "@/lib/seo";
import { v2Href, v2Nav } from "@/components/v2/nav";
import { mono } from "../../fonts-lib/mono";
import { V2Fonts } from "../fonts";
import "../../globals.css";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export async function generateMetadata({ params }: LayoutProps<"/v2/[lang]">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return {
    metadataBase: new URL(siteUrl),
    title: { default: v2Root ? "Candemsoft — Yazılım, mobil uygulama ve yapay zekâ" : dict.v2.metaTitle, template: `%s — ${v2Root ? "Candemsoft" : dict.v2.metaTitle}` },
    description: dict.meta.siteDescription,
    // An alternative design of the same content: keep it out of search results.
    robots: v2Root ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function V2Layout({ children, params }: LayoutProps<"/v2/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} className={mono.variable}>
      <head>
        <V2Fonts />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd(lang, dict.meta.siteDescription))} />
      </head>
      <body className="bg-white text-ink-950">
        <SkipLink label={dict.nav.skip} />
        <V2Header
          lang={lang}
          home={v2Href(lang, "home")}
          items={v2Nav(lang, dict)}
          labels={{
            menu: dict.nav.menu,
            close: dict.nav.close,
            language: dict.nav.language,
            primary: dict.nav.primary,
            classic: dict.v2.switchDesign,
            contact: dict.nav.contact,
            contactHref: v2Href(lang, "contact"),
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <V2Footer lang={lang} dict={dict} />
        <CookieNotice text={dict.cookies.text} ok={dict.cookies.ok} more={dict.cookies.more} moreHref={v2Href(lang, "privacy")} />
      </body>
    </html>
  );
}
