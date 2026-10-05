import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Header, type NavItem } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { body, display, mono } from "./fonts";
import "./globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return {
    title: { default: dict.meta.siteTitle, template: "%s — Candemsoft" },
    description: dict.meta.siteDescription,
  };
}

const navKeys: RouteKey[] = ["about", "services", "projects", "products", "team", "blog", "contact"];

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const items: NavItem[] = navKeys.map((key) => ({ key, label: dict.nav[key], href: href(lang, key) }));
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SkipLink label={dict.nav.skip} />
        <Header
          lang={lang}
          home={href(lang, "home")}
          items={items}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, switchTo: dict.nav.switchTo, primary: dict.nav.primary }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer lang={lang} dict={dict} items={items} />
      </body>
    </html>
  );
}
