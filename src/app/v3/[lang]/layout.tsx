import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { siteUrl } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { V3Header } from "@/components/v3/V3Header";
import { V3Footer } from "@/components/v3/V3Footer";
import { v3Href, v3Nav } from "@/components/v3/nav";
import { mono } from "../../fonts-lib/mono";
import { V3Fonts } from "../fonts";
import "../../globals.css";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#f2eee3" };

export async function generateMetadata({ params }: LayoutProps<"/v3/[lang]">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.v3.metaTitle, template: `%s — ${dict.v3.metaTitle}` },
    description: dict.meta.siteDescription,
    // An alternative design of the same content: keep it out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function V3Layout({ children, params }: LayoutProps<"/v3/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.v3;
  // The paper's date is its build date: the day this edition went to print.
  const date = formatDate(new Date().toISOString().slice(0, 10), lang);
  return (
    <html lang={lang} className={mono.variable}>
      <head>
        <V3Fonts />
      </head>
      <body className="v3 bg-news-paper text-news-ink">
        <SkipLink label={dict.nav.skip} />
        <V3Header
          lang={lang}
          home={v3Href(lang, "home")}
          date={date}
          items={v3Nav(lang, dict)}
          t={{ issue: t.issue, price: t.price, edition: t.edition, motto: t.motto, est: t.est, print: t.print, primary: dict.nav.primary }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <V3Footer lang={lang} dict={dict} />
        <CookieNotice text={dict.cookies.text} ok={dict.cookies.ok} more={dict.cookies.more} moreHref={v3Href(lang, "privacy")} />
      </body>
    </html>
  );
}
