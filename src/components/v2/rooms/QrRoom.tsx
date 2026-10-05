import QRCode from "qrcode";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

const theme: RoomTheme = {
  kicker: "text-qr-yellow",
  button: "bg-qr-yellow text-black hover:bg-white",
  ghost: "border-2 border-qr-yellow/60 text-qr-yellow hover:border-qr-yellow",
  rule: "border-white/20",
  bullet: "text-qr-yellow",
  muted: "text-white/80",
};

/**
 * A real, scannable QR for the product site, generated at build time. Normal polarity
 * (dark modules on the brand yellow) with the standard 4-module quiet zone: inverted or
 * dotted codes look nice but many phone cameras won't read them.
 */
function RealQr({ url, label }: { url: string; label: string }) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const q = 4;
  const cells: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (qr.modules.get(y, x)) cells.push(`M${x} ${y}h1v1h-1z`);
  return (
    <svg viewBox={`${-q} ${-q} ${n + 2 * q} ${n + 2 * q}`} role="img" aria-label={label} shapeRendering="crispEdges" className="h-auto w-full">
      <rect x={-q} y={-q} width={n + 2 * q} height={n + 2 * q} rx="2.5" fill="#f8d008" />
      <path d={cells.join("")} fill="#000" />
    </svg>
  );
}

function ProfileCard({ t }: { t: Dictionary["v2"] }) {
  const rows = ["+90 5•• ••• •• ••", "ad@ornek.com", "@kullanici", "34 ABC 123"];
  return (
    <div className="w-full max-w-64 rounded-[2rem] border-2 border-qr-yellow/70 bg-[#0d0d0d] p-5 shadow-[0_0_60px_-20px_rgba(248,208,8,0.55)]">
      <p className="font-mono text-[0.7rem] text-qr-yellow">{t.qrCard}</p>
      <div className="mt-4 flex items-center gap-3">
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-qr-yellow font-archivo text-lg font-bold text-black">
          {t.qrName.split(" ").map((w) => w[0]).join("")}
        </span>
        <div>
          <p className="font-archivo font-semibold text-white">{t.qrName}</p>
          <p className="text-sm text-white/70">{t.qrRole}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {rows.map((r) => (
          <li key={r} className="rounded-xl border border-white/15 px-3 py-2 font-mono text-xs text-white/85">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function QrRoom({ product, lang, dict, index, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; index: number; level?: 2 | 3 }) {
  const t = dict.v2;
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto relative overflow-hidden bg-black py-(--section) text-white">
      {/* dotted grid, like the app's background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(rgba(248,208,8,.35) 1px, transparent 1.5px)", backgroundSize: "28px 28px" }}
      />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <RoomInfo level={level}
          product={product}
          lang={lang}
          dict={dict}
          theme={theme}
          index={index}
          titleClass="text-white"
          taglineClass="v2-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-qr-yellow"
        />
        <div className="grid items-end gap-6 sm:grid-cols-[1.1fr_1fr]">
          <figure>
            <a href={product.links.web || "#"} target="_blank" rel="noopener noreferrer" className="block rounded-3xl shadow-[0_0_60px_-20px_rgba(248,208,8,0.6)]">
              <RealQr url={product.links.web || "https://kisiselqr.com/"} label={t.qrReal} />
            </a>
            <figcaption className="mt-3 font-mono text-mono-sm text-qr-yellow">{t.qrReal}</figcaption>
          </figure>
          <ProfileCard t={t} />
        </div>
      </div>
    </section>
  );
}
