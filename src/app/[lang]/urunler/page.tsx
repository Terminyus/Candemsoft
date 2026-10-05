import type { Metadata } from "next";
import Image from "next/image";
import { getProducts, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { isTodo } from "@/lib/text";
import { PageIntro } from "@/components/page/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Tag } from "@/components/ui/Tag";
import { Todo } from "@/components/ui/Todo";
import { cn } from "@/components/ui/cn";

export async function generateMetadata({ params }: PageProps<"/[lang]/urunler">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.products, description: dict.productsPage.lead };
}

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

export default async function ProductsPage({ params }: PageProps<"/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.productsPage;
  const products = getProducts();

  return (
    <>
      <PageIntro label={t.label} title={t.title} lead={t.lead} />
      <div data-surface="paper">
        {products.map((p, i) => {
          const soon = p.status === "soon";
          const links = [
            p.links.appStore && { href: p.links.appStore, label: t.appStore },
            p.links.googlePlay && { href: p.links.googlePlay, label: t.googlePlay },
            p.links.web && { href: p.links.web, label: t.web },
          ].filter((l): l is { href: string; label: string } => Boolean(l));
          return (
            <section
              key={p.slug}
              id={p.slug}
              aria-labelledby={`${p.slug}-title`}
              data-surface={soon ? "ink" : "paper"}
              className={cn("border-b py-(--section-sm)", soon ? "border-ink-800" : "border-paper-200")}
            >
              <div className="container-site grid-site gap-y-8">
                <div className="col-span-full flex items-start justify-between gap-6 lg:col-span-5">
                  <div>
                    <MonoLabel as="p">
                      <span className={soon ? "text-signal" : "text-ember"}>{String(i + 1).padStart(2, "0")}</span>
                    </MonoLabel>
                    <h2 id={`${p.slug}-title`} className="mt-2 font-display-tight text-h1 font-semibold">
                      {p.name}
                    </h2>
                  </div>
                  <div
                    className={cn(
                      "relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-[22%] md:size-20",
                      soon ? "bg-ink-800" : "bg-ink-950 text-paper-100",
                    )}
                  >
                    {p.icon && publicFileExists(p.icon) ? (
                      <Image src={p.icon} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <span aria-hidden className="font-display text-h3 font-semibold">
                        {p.name[0]}
                        <span className="text-signal">.</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-full flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={soon ? "default" : "signal"}>{soon ? dict.common.comingSoon : dict.common.live}</Tag>
                    {p.platforms.map((pl) => (
                      <Tag key={pl}>{platformName[pl]}</Tag>
                    ))}
                    {p.androidSoon && <MonoLabel>{t.androidSoon}</MonoLabel>}
                  </div>
                  {isTodo(p.tagline[lang]) ? (
                    <Todo label={dict.common.todo} text={p.tagline[lang]} />
                  ) : (
                    <p className="font-display text-h3 font-semibold">{p.tagline[lang]}</p>
                  )}
                  {isTodo(p.description[lang]) ? (
                    <Todo label={dict.common.todo} text={p.description[lang]} />
                  ) : (
                    <p className="text-lead muted">{p.description[lang]}</p>
                  )}
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {links.map((l, j) => (
                        <ButtonLink key={l.href} href={l.href} arrow="↗" variant={j === 0 ? "primary" : "outline"}>
                          {l.label}
                        </ButtonLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
