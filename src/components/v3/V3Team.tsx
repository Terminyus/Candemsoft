import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getTeam, publicFileExists } from "@/lib/content";
import { asset } from "@/lib/static";
import { initials } from "@/lib/text";

export function V3Team({ lang }: { lang: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
      {getTeam().map((m, i) => (
        <li key={`${m.name}-${i}`}>
          <div className="halftone relative aspect-[4/5] border border-news-ink bg-news-ink/5">
            {m.photo && publicFileExists(m.photo) ? (
              <Image src={asset(m.photo)} alt={m.name} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover grayscale" />
            ) : (
              <span aria-hidden className="absolute inset-0 grid place-items-center v3-headline text-[clamp(2.5rem,1.5rem+4vw,4.5rem)]">
                {initials(m.name)}
              </span>
            )}
          </div>
          <p className="v3-sub mt-2 text-lg">{m.name}</p>
          <p className="italic text-news-gray">{m.role[lang]}</p>
        </li>
      ))}
    </ul>
  );
}
