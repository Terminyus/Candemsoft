import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getProducts, publicFileExists } from "@/lib/content";
import { asset } from "@/lib/static";
import { isTodo } from "@/lib/text";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Tag } from "@/components/ui/Tag";
import { Todo } from "@/components/ui/Todo";

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

export function ProductsStrip({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const products = getProducts();
  return (
    <section data-surface="paper" aria-labelledby="products-title" className="py-(--section)">
      <div className="container-site grid-site gap-y-10">
        <div className="col-span-full flex flex-col gap-4 lg:col-span-6 lg:col-start-4">
          <MonoLabel as="p">{dict.home.productsLabel}</MonoLabel>
          <h2 id="products-title" className="text-h2">
            {dict.home.productsTitle}
          </h2>
          <p className="max-w-lg text-stone-600">{dict.home.productsBody}</p>
        </div>

        <ul className="col-span-full border-t border-ink-950">
          {products.map((p) => (
            <li key={p.slug} className="group relative border-b border-paper-200">
              <div className="grid grid-cols-4 items-baseline gap-x-6 gap-y-2 py-5 md:grid-cols-12">
                <h3 className="col-span-4 flex items-center gap-4 font-display-tight text-[clamp(2rem,1.2rem+3.5vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:translate-x-2 md:col-span-5">
                  <span className="relative size-[0.8em] shrink-0 overflow-hidden rounded-[22%] bg-paper-50 ring-1 ring-paper-200">
                    {p.icon && publicFileExists(p.icon) ? (
                      <Image src={asset(p.icon)} alt="" fill sizes="64px" className="object-contain" />
                    ) : (
                      <span aria-hidden className="absolute inset-0 grid place-items-center text-[0.5em]">
                        {p.name[0]}
                      </span>
                    )}
                  </span>
                  <Link href={`${href(lang, "products")}#${p.slug}`} className="after:absolute after:inset-0">
                    {p.name}
                  </Link>
                </h3>
                <div className="col-span-4 md:col-span-4">
                  {isTodo(p.tagline[lang]) ? (
                    <Todo label={dict.common.todo} text={p.tagline[lang]} />
                  ) : (
                    <p className="text-stone-600">{p.tagline[lang]}</p>
                  )}
                </div>
                <div className="col-span-4 flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
                  {p.platforms.map((pl) => (
                    <MonoLabel key={pl}>{platformName[pl]}</MonoLabel>
                  ))}
                  <Tag tone={p.status === "live" ? "signal" : "default"}>
                    {p.status === "live" ? dict.common.live : dict.common.comingSoon}
                  </Tag>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="col-span-full">
          <ButtonLink href={href(lang, "products")} variant="quiet">
            {dict.home.productsAll}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
