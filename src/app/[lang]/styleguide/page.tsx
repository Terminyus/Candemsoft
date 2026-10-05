import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Index, MonoLabel } from "@/components/ui/MonoLabel";
import { Monogram } from "@/components/ui/Monogram";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Todo } from "@/components/ui/Todo";

// Internal reference page for the design system. Not linked, not indexed.
export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const swatches = [
  ["ink-950", "#0E0D0B"],
  ["ink-900", "#161512"],
  ["ink-800", "#24221E"],
  ["stone-400", "#A39D91"],
  ["stone-600", "#5F5A50"],
  ["paper-200", "#E6E1D7"],
  ["paper-100", "#F3F0EA"],
  ["signal", "#F85404"],
  ["ember", "#B93F05"],
  ["cobalt", "#6B9BFF"],
];

export default function Styleguide() {
  return (
    <>
      <Section surface="ink" space="lg">
        <div className="grid-site gap-y-8">
          <Index n={0} label="styleguide" className="col-span-full" />
          <h1 className="col-span-full font-display-tight text-display font-extrabold lg:col-span-10">
            Şimdi ğüşıöç, İstanbul.
          </h1>
          <p className="col-span-full text-lead text-stone-400 lg:col-span-6 lg:col-start-3">
            Kısa, somut cümleler. Büyük harf dönüşümü yok: İ ve ı kaynağında yazılır.
          </p>
          <div className="col-span-full flex flex-wrap gap-3 lg:col-start-3">
            <ButtonLink href="#">Proje başlat</ButtonLink>
            <ButtonLink href="#" variant="outline" arrow="↗">
              Siteyi ziyaret et
            </ButtonLink>
            <ButtonLink href="#" variant="quiet">
              Tüm projeler
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid-site gap-y-6">
          <Index n={1} label="renk" className="col-span-full" />
          {swatches.map(([name, hex]) => (
            <div key={name} className="col-span-2">
              <div className="aspect-square border border-paper-200" style={{ background: hex }} />
              <MonoLabel as="p" className="mt-2">
                {name} · {hex}
              </MonoLabel>
            </div>
          ))}
        </div>
      </Section>

      <Section space="sm">
        <div className="grid-site gap-y-6">
          <Index n={2} label="tipografi" className="col-span-full" />
          <p className="col-span-full font-display text-h1">H1 Çalışan yazılım</p>
          <p className="col-span-full font-display text-h2">H2 Hizmetlerimiz ve süreç</p>
          <p className="col-span-full font-display text-h3">H3 Kurumsal web siteleri</p>
          <p className="col-span-full text-lead lg:col-span-8">
            Lead: Altem için ürün, stok ve sipariş akışını tek panelde topladık.
          </p>
          <p className="col-span-full lg:col-span-6">
            Gövde metni: Schibsted Grotesk, okunaklı ve sakin. Uzun paragraflarda satır uzunluğu 60–75 karakter
            civarında tutulur. ğ ü ş ı İ ö ç Ğ Ü Ş I Ö Ç.
          </p>
          <MonoLabel className="col-span-full">mono-sm · 2026-10-05 · e-ticaret</MonoLabel>
        </div>
      </Section>

      <Section surface="ink" space="sm">
        <div className="grid-site gap-y-6">
          <Index n={3} label="etiket ve yer tutucu" className="col-span-full" />
          <div className="col-span-full flex flex-wrap gap-2">
            <Tag>web</Tag>
            <Tag>e-ticaret</Tag>
            <Tag tone="signal">Yayında</Tag>
          </div>
          <div className="col-span-full">
            <Todo label="İçerik bekleniyor" text="TODO: Orpigo için tek cümlelik tanım" />
          </div>
          <div className="col-span-full flex flex-wrap gap-3">
            <Button>Gönder</Button>
            <Button variant="outline">İptal</Button>
          </div>
        </div>
      </Section>

      <Section space="sm">
        <div className="grid-site gap-y-6">
          <Index n={4} label="monogram" className="col-span-full" />
          {["Ad Soyad", "Ayşe Yılmaz", "İlker Öz", "Çağrı Uğur"].map((n, i) => (
            <Monogram key={n} name={n} index={i} className="col-span-2 lg:col-span-3" />
          ))}
        </div>
      </Section>

      <Section space="sm">
        <form className="grid-site gap-y-6">
          <Index n={5} label="form" className="col-span-full" />
          <div className="col-span-full lg:col-span-6">
            <Field id="sg-name" label="Adınız" required>
              <Input id="sg-name" placeholder="Ad Soyad" />
            </Field>
          </div>
          <div className="col-span-full lg:col-span-6">
            <Field id="sg-mail" label="E-posta" required error="Geçerli bir e-posta adresi yazın.">
              <Input id="sg-mail" aria-invalid aria-describedby="sg-mail-error" defaultValue="ornek@" />
            </Field>
          </div>
          <div className="col-span-full lg:col-span-6">
            <Field id="sg-topic" label="Konu">
              <Select id="sg-topic">
                <option>Teklif talebi</option>
              </Select>
            </Field>
          </div>
          <div className="col-span-full">
            <Field id="sg-msg" label="Mesaj" hint="0/1000">
              <Textarea id="sg-msg" />
            </Field>
          </div>
        </form>
      </Section>
    </>
  );
}
