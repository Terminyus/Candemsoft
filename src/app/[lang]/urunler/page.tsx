import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { href } from "@/i18n/routes";
import { getProducts, getProject, publicFileExists, type Product } from "@/lib/content";
import { getDictionary, type Dictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/static";
import { isTodo } from "@/lib/text";
import type { Locale } from "@/i18n/config";
import { PageIntro } from "@/components/page/PageIntro";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Tag } from "@/components/ui/Tag";
import { Todo } from "@/components/ui/Todo";
import { cn } from "@/components/ui/cn";

export async function generateMetadata({ params }: PageProps<"/[lang]/urunler">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "products", title: dict.nav.products, description: dict.productsPage.lead });
}

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

function ProductIcon({ product, size = "lg" }: { product: Product; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "size-20 md:size-24" : "size-10";
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-[22%] bg-paper-50 ring-1 ring-paper-200 in-data-[surface=ink]:bg-ink-800 in-data-[surface=ink]:ring-ink-800", box)}>
      {product.icon && publicFileExists(product.icon) ? (
        <Image src={asset(product.icon)} alt={`${product.name} logo`} fill sizes="96px" className="object-contain" />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-h3 font-extrabold">
          {product.name[0]}
          <span className="text-signal">.</span>
        </span>
      )}
    </div>
  );
}

function StoreLinks({ product, t }: { product: Product; t: Dictionary["productsPage"] }) {
  const links = [
    product.links.appStore && { href: product.links.appStore, label: t.appStore },
    product.links.googlePlay && { href: product.links.googlePlay, label: t.googlePlay },
    product.links.web && { href: product.links.web, label: t.web },
  ].filter((l): l is { href: string; label: string } => Boolean(l));
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l, j) => (
        <ButtonLink key={l.href} href={l.href} arrow="↗" variant={j === 0 ? "primary" : "outline"}>
          {l.label}
        </ButtonLink>
      ))}
    </div>
  );
}

function LiveProduct({ product, index, lang, dict }: { product: Product; index: number; lang: Locale; dict: Dictionary }) {
  const t = dict.productsPage;
  const project = product.project ? getProject(product.project) : undefined;
  const flip = index % 2 === 1;
  return (
    <section id={product.slug} aria-labelledby={`${product.slug}-title`} data-surface="paper" className="border-b border-paper-200 py-(--section-sm)">
      <div className="container-site grid-site gap-y-10">
        {/* Text column */}
        <div className={cn("col-span-full flex flex-col gap-6 lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
          <div className="flex items-center gap-5">
            <ProductIcon product={product} />
            <div>
              <MonoLabel as="p">
                <span className="text-ember">{String(index + 1).padStart(2, "0")}</span> / {product.platforms.map((p) => platformName[p]).join(" · ")}
              </MonoLabel>
              <h2 id={`${product.slug}-title`} className="mt-1 font-display-tight text-h1 font-extrabold">
                {product.name}
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="signal">{dict.common.live}</Tag>
            {product.androidSoon && <MonoLabel>{t.androidSoon}</MonoLabel>}
          </div>
          {isTodo(product.tagline[lang]) ? (
            <Todo label={dict.common.todo} text={product.tagline[lang]} />
          ) : (
            <p className="font-display text-h3 font-extrabold">{product.tagline[lang]}</p>
          )}
          <p className="text-lead text-stone-600">{product.description[lang]}</p>
          {product.features[lang].length > 0 && (
            <div>
              <MonoLabel as="p">{t.features}</MonoLabel>
              <ul className="mt-3 grid gap-x-6 border-t border-ink-950 sm:grid-cols-2">
                {product.features[lang].map((f) => (
                  <li key={f} className="flex gap-3 border-b border-paper-200 py-2.5">
                    <span aria-hidden className="text-ember">
                      +
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <StoreLinks product={product} t={t} />
          {project && (
            <Link href={href(lang, "projects", project.slug)} className="self-start font-mono text-mono-sm text-stone-600 underline underline-offset-4 hover:text-ember">
              {t.caseLink} →
            </Link>
          )}
        </div>

        {/* Screens column: the live site, desktop with the phone overlapping its corner */}
        {project && (
          <figure className={cn("relative col-span-full pb-10 lg:col-span-6 lg:self-center", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
            <ProjectVisual
              project={project}
              variant="desktop"
              pendingLabel={dict.home.visualPending}
              alt={dict.common.shotDesktop.replace("{name}", product.name)}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="shadow-[0_30px_60px_-30px_rgba(14,13,11,0.35)]"
            />
            <div className={cn("absolute bottom-0 w-[30%] max-w-48", flip ? "-left-2 md:left-6" : "-right-2 md:right-6")}>
              <ProjectVisual
                project={project}
                variant="mobile"
                pendingLabel={dict.home.visualPending}
                alt={dict.common.shotMobile.replace("{name}", product.name)}
                sizes="200px"
                className="rounded-xl shadow-[0_24px_50px_-20px_rgba(14,13,11,0.55)] ring-4 ring-ink-950"
              />
            </div>
            <figcaption className="sr-only">{t.screens}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

function SoonProduct({ product, lang, dict }: { product: Product; lang: Locale; dict: Dictionary }) {
  return (
    <section id={product.slug} aria-labelledby={`${product.slug}-title`} data-surface="ink" className="py-(--section-sm)">
      <div className="container-site grid-site items-end gap-y-8">
        <div className="col-span-full flex items-center gap-5 lg:col-span-6">
          <ProductIcon product={product} />
          <div>
            <Tag>{dict.common.comingSoon}</Tag>
            <h2 id={`${product.slug}-title`} className="mt-3 font-display-tight text-h1 font-extrabold">
              {product.name}
            </h2>
          </div>
        </div>
        <div className="col-span-full lg:col-span-5 lg:col-start-8">
          <p className="font-display text-h3 font-extrabold">{product.tagline[lang]}</p>
          <p className="mt-3 text-stone-400">{product.description[lang]}</p>
        </div>
      </div>
    </section>
  );
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.productsPage;
  const products = getProducts();
  const live = products.filter((p) => p.status === "live");
  const soon = products.filter((p) => p.status === "soon");

  return (
    <>
      <PageIntro
        label={t.label}
        title={t.title}
        lead={t.lead}
        aside={
          <ul className="flex flex-wrap gap-x-8 gap-y-4 border-t border-ink-800 pt-6">
            {products.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className="group flex items-center gap-3 text-stone-400 transition-colors hover:text-paper-100">
                  <ProductIcon product={p} size="sm" />
                  <span className="font-display text-xl font-extrabold">{p.name}</span>
                </a>
              </li>
            ))}
          </ul>
        }
      />
      {live.map((p, i) => (
        <LiveProduct key={p.slug} product={p} index={i} lang={lang} dict={dict} />
      ))}
      {soon.map((p) => (
        <SoonProduct key={p.slug} product={p} lang={lang} dict={dict} />
      ))}
    </>
  );
}
