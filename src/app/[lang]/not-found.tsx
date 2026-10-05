import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { NotFoundView } from "@/components/page/NotFoundView";

// notFound() thrown inside a page during client navigation. Unmatched URLs use app/global-not-found.tsx.
export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  return <NotFoundView lang={lang} dict={await getDictionary(lang)} />;
}
