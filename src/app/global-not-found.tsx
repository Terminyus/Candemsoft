import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";
import { Logo } from "@/components/ui/Logo";
import { NotFoundView } from "@/components/page/NotFoundView";
import { body, mono } from "./fonts";
import "./globals.css";
import { preloadDisplayFont } from "./display-font";

/*
 * The root layout lives under the dynamic [lang] segment, so Next can't server-render
 * a 404 through it. This page renders the full document itself; proxy.ts tells it the
 * locale via a request header.
 */
export const metadata: Metadata = { title: "404 — Candemsoft", robots: { index: false } };

export default async function GlobalNotFound() {
  const raw = (await headers()).get("x-cs-locale") ?? "";
  const lang = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(lang);
  preloadDisplayFont();
  return (
    <html lang={lang} className={`${body.variable} ${mono.variable}`}>
      <body>
        <header data-surface="ink" className="border-b border-ink-800">
          <div className="container-site flex h-(--header-h) items-center">
            <Link href={href(lang, "home")} aria-label="Candemsoft">
              <Logo />
            </Link>
          </div>
        </header>
        <main id="main">
          <NotFoundView lang={lang} dict={dict} />
        </main>
      </body>
    </html>
  );
}
