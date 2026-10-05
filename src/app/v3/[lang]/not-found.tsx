import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { v3Href } from "@/components/v3/nav";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const t = (await getDictionary(lang)).notFound;
  return (
    <section className="container-site py-(--section)">
      <p className="v3-kicker text-ember">404</p>
      <h1 className="v3-headline mt-2 text-[clamp(2.5rem,1.5rem+4vw,5rem)]">{t.title}</h1>
      <p className="mt-4 text-xl italic">{t.body}</p>
      <Link href={v3Href(lang, "home")} className="v3-kicker mt-8 inline-block underline underline-offset-4 hover:text-ember">
        {t.home} →
      </Link>
    </section>
  );
}
