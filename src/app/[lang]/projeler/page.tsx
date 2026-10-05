import type { Metadata } from "next";
import { Suspense } from "react";
import { href } from "@/i18n/routes";
import { getProducts, getProjects, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { PageIntro } from "@/components/page/PageIntro";
import { ProjectIndex, ProjectIndexStatic, type IndexItem } from "@/components/project/ProjectIndex";

export async function generateMetadata({ params }: PageProps<"/[lang]/projeler">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.projects, description: dict.projectsPage.lead };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projeler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.projectsPage;

  const projects: IndexItem[] = getProjects().map((p) => ({
    slug: p.slug,
    name: p.name,
    href: href(lang, "projects", p.slug),
    type: p.type[lang],
    sector: p.sector[lang],
    categories: p.categories,
    host: new URL(p.url).host.replace(/^www\./, ""),
    desktop: publicFileExists(p.images.desktop) ? p.images.desktop : null,
    own: false,
  }));
  // Own mobile apps appear only under the "mobil" filter, clearly marked.
  const ownMobile: IndexItem[] = getProducts()
    .filter((p) => p.platforms.some((pl) => pl === "ios" || pl === "android"))
    .map((p) => ({
      slug: `urun-${p.slug}`,
      name: p.name,
      href: `${href(lang, "products")}#${p.slug}`,
      type: "",
      sector: p.platforms.map((pl) => (pl === "ios" ? "iOS" : pl === "android" ? "Android" : "Web")).join(" · "),
      categories: ["mobil"],
      host: "",
      desktop: null,
      own: true,
    }));

  const items = [...projects, ...ownMobile];
  const labels = {
    filterLabel: t.filterLabel,
    all: t.all,
    categories: t.categories,
    empty: t.empty,
    emptyMobile: t.emptyMobile,
    emptyMobileHref: href(lang, "products"),
    ownProduct: t.ownProduct,
    pending: dict.home.visualPending,
    colName: t.colName,
    colType: t.colType,
    colSector: t.colSector,
  };

  return (
    <>
      <PageIntro label={t.label} title={t.title} lead={t.lead} />
      <section data-surface="paper" aria-label={t.label} className="py-(--section-sm)">
        <div className="container-site">
          <Suspense fallback={<ProjectIndexStatic items={items} labels={labels} />}>
            <ProjectIndex items={items} labels={labels} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
