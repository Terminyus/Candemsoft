import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { siteUrl } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { V5Header } from "@/components/v5/V5Header";
import { V5Footer } from "@/components/v5/V5Footer";
import { v5Href, v5Nav } from "@/components/v5/nav";
import { V5Fonts } from "../fonts";
import "../../globals.css";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export async function generateMetadata({ params }: LayoutProps<"/v5/[lang]">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.v5.metaTitle, template: `%s — Candemsoft` },
    description: dict.meta.siteDescription,
    // An alternative design of the same content: keep it out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function V5Layout({ children, params }: LayoutProps<"/v5/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { contact } = getSite();
  return (
    <html lang={lang}>
      <head>
        <V5Fonts />
      </head>
      <body className="v5 bg-white text-corp-ink">
        <SkipLink label={dict.nav.skip} />
        <V5Header
          lang={lang}
          home={v5Href(lang, "home")}
          items={v5Nav(lang, dict)}
          contact={contact}
          labels={{
            topbar: dict.v5.topbar,
            quote: dict.v5.quote,
            quoteHref: v5Href(lang, "contact"),
            menu: dict.nav.menu,
            close: dict.nav.close,
            language: dict.nav.language,
            primary: dict.nav.primary,
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <V5Footer lang={lang} dict={dict} />
        <CookieNotice text={dict.cookies.text} ok={dict.cookies.ok} more={dict.cookies.more} moreHref={v5Href(lang, "privacy")} />
      </body>
    </html>
  );
}
