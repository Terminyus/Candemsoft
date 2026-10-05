import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { body, display, mono } from "./fonts";
import "./globals.css";


export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return {
    title: { default: dict.meta.siteTitle, template: "%s — Candemsoft" },
    description: dict.meta.siteDescription,
  };
}

const nav: RouteKey[] = ["about", "services", "projects", "products", "team", "blog", "contact"];

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header>
          <Link href={href(lang, "home")}>Candemsoft</Link>
          <nav aria-label={dict.nav.menu}>
            {nav.map((key) => (
              <Link key={key} href={href(lang, key)}>
                {dict.nav[key]}
              </Link>
            ))}
          </nav>
        </header>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
