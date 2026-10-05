import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import { publicFileExists } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";

/** Colours a room hands to the shared info block. */
export type RoomTheme = {
  kicker: string; // small label colour
  button: string; // primary store button
  ghost: string; // secondary buttons
  rule: string; // list dividers
  bullet: string;
  muted: string;
};

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

export function RoomIcon({ product, className }: { product: Product; className?: string }) {
  return (
    <span className={cn("relative block size-16 shrink-0 overflow-hidden rounded-[22%] bg-white md:size-20", className)}>
      {product.icon && publicFileExists(product.icon) ? (
        <Image src={asset(product.icon)} alt={`${product.name} logo`} fill sizes="80px" className="object-contain" />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center v2-heading text-2xl text-ink-950">
          {product.name[0]}
        </span>
      )}
    </span>
  );
}

export function StoreButtons({ product, dict, theme }: { product: Product; dict: Dictionary; theme: RoomTheme }) {
  const t = dict.productsPage;
  const links = [
    product.links.appStore && { href: product.links.appStore, label: t.appStore },
    product.links.googlePlay && { href: product.links.googlePlay, label: t.googlePlay },
    product.links.web && { href: product.links.web, label: t.web },
  ].filter((l): l is { href: string; label: string } => Boolean(l));
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-12 items-center gap-3 rounded-full px-6 font-archivo text-[0.95rem] font-semibold transition-transform active:translate-y-px",
            i === 0 ? theme.button : theme.ghost,
          )}
        >
          {l.label} <span aria-hidden>↗</span>
        </a>
      ))}
    </div>
  );
}

export function RoomInfo({
  product,
  lang,
  dict,
  theme,
  index,
  titleClass,
  taglineClass,
  level = 3,
}: {
  product: Product;
  lang: Locale;
  dict: Dictionary;
  theme: RoomTheme;
  index: number;
  titleClass?: string;
  taglineClass?: string;
  /** h3 under a section heading (home), h2 directly under the page h1 (products page). */
  level?: 2 | 3;
}) {
  const Title = level === 2 ? "h2" : "h3";
  const features = product.features[lang];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <RoomIcon product={product} />
        <div>
          <p className={cn("font-mono text-mono-sm", theme.kicker)}>
            {String(index).padStart(2, "0")} / {product.platforms.map((p) => platformName[p]).join(" · ") || dict.common.comingSoon}
          </p>
          <Title id={`room-${product.slug}`} className={cn("v2-display mt-1 text-[clamp(2.5rem,1.6rem+3.5vw,4.75rem)]", titleClass)}>
            {product.name}
          </Title>
        </div>
      </div>
      <p className={taglineClass ?? "v2-heading text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]"}>{product.tagline[lang]}</p>
      <p className={cn("max-w-xl text-lead", theme.muted)}>{product.description[lang]}</p>
      {features.length > 0 && (
        <ul className={cn("grid max-w-xl gap-x-6 border-t sm:grid-cols-2", theme.rule)}>
          {features.map((f) => (
            <li key={f} className={cn("flex gap-3 border-b py-2.5", theme.rule)}>
              <span aria-hidden className={theme.bullet}>
                +
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}
      {product.androidSoon && <p className={cn("font-mono text-mono-sm", theme.kicker)}>{dict.productsPage.androidSoon}</p>}
      <StoreButtons product={product} dict={dict} theme={theme} />
    </div>
  );
}
