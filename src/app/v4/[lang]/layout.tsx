import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { siteUrl } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { DevCursor } from "@/components/v4/fx/DevCursor";
import { V4Header } from "@/components/v4/V4Header";
import { V4Footer } from "@/components/v4/V4Footer";
import { v4Href, v4Nav } from "@/components/v4/nav";
import { V4Fonts } from "../fonts";
import "../../globals.css";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#07080a" };

export async function generateMetadata({ params }: LayoutProps<"/v4/[lang]">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.v4.metaTitle, template: `%s — ${dict.v4.metaTitle}` },
    description: dict.meta.siteDescription,
    // An alternative design of the same content: keep it out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function V4Layout({ children, params }: LayoutProps<"/v4/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} className="[color-scheme:dark]">
      <head>
        <V4Fonts />
      </head>
      <body className="v4 bg-dev-bg text-dev-text">
        <SkipLink label={dict.nav.skip} />
        <V4Header
          lang={lang}
          home={v4Href(lang, "home")}
          items={v4Nav(lang, dict)}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, language: dict.nav.language, primary: dict.nav.primary, cta: dict.v4.ctaButton, ctaHref: v4Href(lang, "contact") }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <V4Footer lang={lang} dict={dict} />
        <DevCursor />
        <CookieNotice text={dict.cookies.text} ok={dict.cookies.ok} more={dict.cookies.more} moreHref={v4Href(lang, "privacy")} />
      </body>
    </html>
  );
}
