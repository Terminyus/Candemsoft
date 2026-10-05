import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { v5Href } from "@/components/v5/nav";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const t = (await getDictionary(lang)).notFound;
  return (
    <section className="container-site py-(--section) text-center">
      <p className="font-mono text-sm font-medium text-ember">HTTP 404</p>
      <h1 className="v5-title mt-3 text-[clamp(2.2rem,1.4rem+3vw,3.75rem)]">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-corp-muted">{t.body}</p>
      <Link href={v5Href(lang, "home")} className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-ember px-6 font-semibold text-white hover:bg-corp-ink">
        {t.home}
      </Link>
    </section>
  );
}
