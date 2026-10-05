import type { Metadata, Viewport } from "next";
import { locales } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";
import { jsonLd, organizationJsonLd, siteUrl } from "@/lib/seo";
import { resolveLang } from "@/lib/params";
import { Header, type NavItem } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { CommandPalette } from "@/components/terminal/CommandPalette";
import { TerminalTrigger } from "@/components/terminal/TerminalTrigger";
import { getTerminalData } from "@/lib/terminal/data";
import { run } from "@/lib/terminal/engine";
import { ClassicFonts } from "../classic-fonts";
import { mono } from "../fonts-lib/mono";
import "../globals.css";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

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
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.siteTitle, template: "%s — Candemsoft" },
    description: dict.meta.siteDescription,
    applicationName: "Candemsoft",
    formatDetection: { telephone: false, email: false, address: false },
  };
}

const navKeys: RouteKey[] = ["about", "services", "projects", "products", "team", "blog", "contact"];

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const items: NavItem[] = navKeys.map((key) => ({ key, label: dict.nav[key], href: href(lang, key) }));
  const terminal = getTerminalData(lang, dict);
  const terminalLabels = {
    title: dict.terminal.title,
    hint: dict.terminal.hint,
    prompt: dict.terminal.prompt,
    inputLabel: dict.terminal.inputLabel,
    hintKeys: dict.terminal.hintKeys,
    close: dict.terminal.close,
  };
  return (
    <html lang={lang} className={mono.variable}>
      <head>
        <ClassicFonts />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd(lang, dict.meta.siteDescription))} />
        <SkipLink label={dict.nav.skip} />
        <Header
          lang={lang}
          home={href(lang, "home")}
          items={items}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, switchTo: dict.nav.language, primary: dict.nav.primary }}
          extra={<TerminalTrigger label={dict.terminal.openPalette} />}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer lang={lang} dict={dict} items={items} />
        <CommandPalette data={terminal} labels={terminalLabels} initial={run(terminal, "help").lines} />
        <CookieNotice text={dict.cookies.text} ok={dict.cookies.ok} more={dict.cookies.more} moreHref={href(lang, "privacy")} />
      </body>
    </html>
  );
}
