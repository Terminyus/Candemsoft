"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { toAsciiSlug, toAsciiText } from "@/lib/text-tools";

type Props = {
  lang: Locale;
};

const labels = {
  tr: {
    inputLabel: "Başlık veya Metin Girin",
    placeholder: "Örn: İstanbul Boğazı'nda Gece & Işık Gösterisi...",
    slugOutputLabel: "Oluşturulan SEO Dostu URL Slug:",
    asciiOutputLabel: "ASCII Metin Karşılığı (Tiresiz):",
    separatorLabel: "Ayırıcı Karakter:",
    hyphen: "Tire (-)",
    underscore: "Alt Çizgi (_)",
    lowercaseLabel: "Küçük harfe dönüştür",
    copySlug: "Slug Kopyala",
    copyAscii: "ASCII Kopyala",
    copied: "Kopyalandı!",
    copyFailed: "Kopyalama başarısız oldu.",
    clear: "Temizle",
    sampleText: "Örnek Yükle",
    statusReady: "Dönüşüme hazır.",
    quickTest: "Hızlı Denemeler:",
  },
  en: {
    inputLabel: "Enter Title or Text",
    placeholder: "E.g. Building Mobile Apps in Istanbul with Next.js & React...",
    slugOutputLabel: "Generated SEO-Friendly Slug:",
    asciiOutputLabel: "ASCII Transliterated Text (No dashes):",
    separatorLabel: "Separator Character:",
    hyphen: "Hyphen (-)",
    underscore: "Underscore (_)",
    lowercaseLabel: "Convert to lowercase",
    copySlug: "Copy Slug",
    copyAscii: "Copy ASCII",
    copied: "Copied!",
    copyFailed: "Failed to copy.",
    clear: "Clear",
    sampleText: "Load Sample",
    statusReady: "Ready for conversion.",
    quickTest: "Quick Test:",
  },
  es: {
    inputLabel: "Ingrese Título o Texto",
    placeholder: "Ej: Desarrollo de aplicaciones móviles y software en Estambul...",
    slugOutputLabel: "Slug Generado para SEO:",
    asciiOutputLabel: "Texto ASCII Transliterado:",
    separatorLabel: "Carácter Separador:",
    hyphen: "Guión (-)",
    underscore: "Guión bajo (_)",
    lowercaseLabel: "Convertir a minúsculas",
    copySlug: "Copiar Slug",
    copyAscii: "Copiar ASCII",
    copied: "¡Copiado!",
    copyFailed: "Error al copiar.",
    clear: "Limpiar",
    sampleText: "Cargar Ejemplo",
    statusReady: "Listo para convertir.",
    quickTest: "Pruebas Rápidas:",
  },
};

const samples = {
  tr: "Türkçe Büyük İ ve I Harfleri ile SEO Uyumlu URL Yapılandırması 2026",
  en: "Modern Web Development, Mobile Engineering & AI Integrations Explained",
  es: "Guía Completa de Desarrollo de Software y Optimización Web para Empresas",
};

const testPhrases = [
  "İstanbul ve Işık",
  "Çiçekçi Şükrü",
  "Ağaç & Gölge",
  "İlişki Yönetimi",
];

export function SlugGeneratorTool({ lang }: Props) {
  const t = labels[lang] || labels.tr;
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [lowercase, setLowercase] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [statusMessage, setStatusMessage] = useState(t.statusReady);

  const timeoutSlugRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutAsciiRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutSlugRef.current) clearTimeout(timeoutSlugRef.current);
      if (timeoutAsciiRef.current) clearTimeout(timeoutAsciiRef.current);
    };
  }, []);

  const slug = useMemo(() => {
    if (!text.trim()) return "";
    return toAsciiSlug(text, { separator, lowercase });
  }, [text, separator, lowercase]);

  const asciiText = useMemo(() => {
    if (!text.trim()) return "";
    return toAsciiText(text);
  }, [text]);

  const handleCopySlug = useCallback(async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopiedSlug(true);
      setStatusMessage(t.copied);
      if (timeoutSlugRef.current) clearTimeout(timeoutSlugRef.current);
      timeoutSlugRef.current = setTimeout(() => setCopiedSlug(false), 2500);
    } catch {
      setStatusMessage(t.copyFailed);
    }
  }, [slug, t.copied, t.copyFailed]);

  const handleCopyAscii = useCallback(async () => {
    if (!asciiText) return;
    try {
      await navigator.clipboard.writeText(asciiText);
      setCopiedAscii(true);
      setStatusMessage(t.copied);
      if (timeoutAsciiRef.current) clearTimeout(timeoutAsciiRef.current);
      timeoutAsciiRef.current = setTimeout(() => setCopiedAscii(false), 2500);
    } catch {
      setStatusMessage(t.copyFailed);
    }
  }, [asciiText, t.copied, t.copyFailed]);

  const handleClear = useCallback(() => {
    setText("");
    setStatusMessage(t.statusReady);
  }, [t.statusReady]);

  const handleLoadSample = useCallback(() => {
    setText(samples[lang] || samples.tr);
    setStatusMessage(t.statusReady);
  }, [lang, t.statusReady]);

  return (
    <div className="rounded-3xl border border-ink-950 bg-white p-6 shadow-sm sm:p-8">
      {/* Live accessibility status for screen readers */}
      <div className="sr-only" aria-live="polite" role="status">
        {statusMessage}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-950/10 pb-4">
        <label htmlFor="slug-input" className="font-mono text-mono-sm font-semibold text-ink-950">
          {t.inputLabel}
        </label>
        <button
          type="button"
          onClick={handleClear}
          disabled={!text}
          className="min-h-9 rounded-full border border-stone-300 bg-white px-4 font-mono text-xs text-stone-600 transition-colors hover:border-ink-950 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {t.clear}
        </button>
      </div>

      <div className="mt-4">
        <textarea
          id="slug-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          rows={3}
          className="w-full resize-y rounded-2xl border border-ink-950/20 bg-stone-50 p-4 font-mono text-base text-ink-950 transition-colors focus:border-ink-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal"
        />
      </div>

      {/* Options Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4 font-mono text-mono-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-stone-600">{t.separatorLabel}</span>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              value="-"
              checked={separator === "-"}
              onChange={() => setSeparator("-")}
              className="accent-ink-950"
            />
            <span>{t.hyphen}</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="separator"
              value="_"
              checked={separator === "_"}
              onChange={() => setSeparator("_")}
              className="accent-ink-950"
            />
            <span>{t.underscore}</span>
          </label>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="accent-ink-950"
          />
          <span>{t.lowercaseLabel}</span>
        </label>
      </div>

      {/* Generated Outputs */}
      <div className="mt-6 space-y-4">
        {/* Slug Output */}
        <div className="rounded-2xl border border-ink-950 bg-stone-50 p-4">
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className="font-mono text-mono-sm font-semibold text-ink-950">
              {t.slugOutputLabel}
            </span>
            <button
              type="button"
              onClick={handleCopySlug}
              disabled={!slug}
              className={`rounded-full px-4 py-1.5 font-archivo text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                copiedSlug
                  ? "border border-emerald-600 bg-emerald-600 text-white"
                  : "border border-ink-950 bg-white text-ink-950 hover:bg-signal"
              }`}
            >
              {copiedSlug ? `✓ ${t.copied}` : t.copySlug}
            </button>
          </div>
          <div
            className="min-h-12 break-all rounded-xl border border-ink-950/10 bg-white p-3 font-mono text-base font-semibold text-emerald-800"
            aria-live="polite"
          >
            {slug || <span className="font-normal text-stone-400">...</span>}
          </div>
        </div>

        {/* ASCII Plain Output */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className="font-mono text-mono-sm text-stone-600">
              {t.asciiOutputLabel}
            </span>
            <button
              type="button"
              onClick={handleCopyAscii}
              disabled={!asciiText}
              className={`rounded-full px-4 py-1.5 font-archivo text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                copiedAscii
                  ? "border border-emerald-600 bg-emerald-600 text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:border-ink-950 hover:text-ink-950"
              }`}
            >
              {copiedAscii ? `✓ ${t.copied}` : t.copyAscii}
            </button>
          </div>
          <div
            className="min-h-10 break-all rounded-xl bg-stone-50 p-3 font-mono text-sm text-stone-800"
            aria-live="polite"
          >
            {asciiText || <span className="text-stone-400">...</span>}
          </div>
        </div>
      </div>

      {/* Quick Test Phrases */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink-950/10 pt-4 font-mono text-mono-sm">
        <div className="flex flex-wrap items-center gap-2 text-stone-600">
          <span>{t.quickTest}</span>
          {testPhrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => setText(phrase)}
              className="rounded-md border border-stone-300 bg-stone-50 px-2.5 py-1 text-ink-950 hover:border-ink-950 hover:bg-signal"
            >
              {phrase}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-stone-600 underline underline-offset-4 hover:text-ink-950"
        >
          {t.sampleText}
        </button>
      </div>
    </div>
  );
}
