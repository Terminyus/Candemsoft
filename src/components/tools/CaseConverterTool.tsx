"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Locale } from "@/i18n/config";
import {
  toTurkishUpper,
  toTurkishLower,
  toTurkishTitleCase,
  toTurkishSentenceCase,
} from "@/lib/text-tools";

type Props = {
  lang: Locale;
};

const labels = {
  tr: {
    inputLabel: "Dönüştürülecek Metni Girin",
    placeholder: "Dönüştürmek istediğiniz Türkçe metni buraya yazın veya yapıştırın...",
    uppercase: "BÜYÜK HARF",
    lowercase: "küçük harf",
    titlecase: "Baş Harfleri Büyüt",
    sentencecase: "Cümle Düzeni",
    copy: "Kopyala",
    copied: "Panoya kopyalandı!",
    copyFailed: "Kopyalama başarısız oldu.",
    clear: "Temizle",
    sampleText: "Örnek Metin Ekle",
    sampleLoaded: "Örnek metin yüklendi.",
    charCount: "Karakter",
    wordCount: "Kelime",
    statusReady: "Dönüşüme hazır.",
    statusConverted: "Metin dönüştürüldü.",
    quickSamplesTitle: "Hızlı Test Sözcükleri:",
    sentenceCaseHint: "Not: Cümle düzeni tüm metni küçülterek cümle başlarını büyütür; özel isimlerinizi kontrol ediniz.",
  },
  en: {
    inputLabel: "Enter Text to Convert",
    placeholder: "Type or paste your text here to convert casing...",
    uppercase: "UPPERCASE",
    lowercase: "lowercase",
    titlecase: "Title Case",
    sentencecase: "Sentence case",
    copy: "Copy",
    copied: "Copied to clipboard!",
    copyFailed: "Failed to copy to clipboard.",
    clear: "Clear",
    sampleText: "Load Sample Text",
    sampleLoaded: "Sample text loaded.",
    charCount: "Characters",
    wordCount: "Words",
    statusReady: "Ready for conversion.",
    statusConverted: "Text successfully converted.",
    quickSamplesTitle: "Quick Test Words:",
    sentenceCaseHint: "Note: Sentence case capitalizes sentence starts after lowercasing; verify proper nouns.",
  },
  es: {
    inputLabel: "Ingrese el texto a convertir",
    placeholder: "Escriba o pegue su texto aquí para convertir...",
    uppercase: "MAYÚSCULAS",
    lowercase: "minúsculas",
    titlecase: "Mayúsculas Iniciales",
    sentencecase: "Tipo oración",
    copy: "Copiar",
    copied: "¡Copiado al portapapeles!",
    copyFailed: "Error al copiar al portapapeles.",
    clear: "Limpiar",
    sampleText: "Cargar Texto de Ejemplo",
    sampleLoaded: "Texto de ejemplo cargado.",
    charCount: "Caracteres",
    wordCount: "Palabras",
    statusReady: "Listo para convertir.",
    statusConverted: "Texto convertido exitosamente.",
    quickSamplesTitle: "Palabras de Prueba Rápida:",
    sentenceCaseHint: "Nota: El formato tipo oración pone en mayúscula el inicio de las oraciones tras convertir a minúsculas; verifique los nombres propios.",
  },
};

const samples = {
  tr: "İstanbul'da yaşayanlar için ışık ve ilişki kelimeleri, Türkçe harf duyarlılığının en belirgin örnekleridir. Yazılımlarda doğru büyük harf dönüşümü yapılmadığında veri tabanında arama eşleşmeleri bozulabilir.",
  en: "Turkish text transformation requires strict locale awareness. For example, words like 'istanbul' must uppercase to 'İSTANBUL' with a dotted capital İ, while 'ışık' uppercases to 'IŞIK' with a dotless capital I.",
  es: "La transformación de texto en turco requiere prestar atención a las letras İ e ı. En turco, la 'i' minúscula se convierte en 'İ' con punto, mientras que 'ışık' pasa a 'IŞIK' sin punto.",
};

const testWords = ["ilişki", "ışık", "İstanbul", "fıstıkçı şahap"];

export function CaseConverterTool({ lang }: Props) {
  const t = labels[lang] || labels.tr;
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState(t.statusReady);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  const handleTransform = useCallback(
    (transformFn: (s: string) => string, modeName: string) => {
      setText((prev) => transformFn(prev));
      setStatusMessage(`${modeName}: ${t.statusConverted}`);
    },
    [t.statusConverted],
  );

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setStatusMessage(t.copied);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setStatusMessage(t.copyFailed);
    }
  }, [text, t.copied, t.copyFailed]);

  const handleClear = useCallback(() => {
    setText("");
    setStatusMessage(t.statusReady);
  }, [t.statusReady]);

  const handleLoadSample = useCallback(() => {
    setText(samples[lang] || samples.tr);
    setStatusMessage(t.sampleLoaded);
  }, [lang, t.sampleLoaded]);

  const handleAppendWord = useCallback((word: string) => {
    setText((prev) => (prev ? `${prev} ${word}` : word));
  }, []);

  return (
    <div className="rounded-3xl border border-ink-950 bg-white p-6 shadow-sm sm:p-8">
      {/* Live accessibility status for screen readers */}
      <div className="sr-only" aria-live="polite" role="status">
        {statusMessage}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-950/10 pb-4">
        <label htmlFor="case-input" className="font-mono text-mono-sm font-semibold text-ink-950">
          {t.inputLabel}
        </label>
        <div className="flex items-center gap-3 font-mono text-mono-sm text-stone-500">
          <span>
            {charCount} {t.charCount}
          </span>
          <span>·</span>
          <span>
            {wordCount} {t.wordCount}
          </span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="mt-4">
        <textarea
          id="case-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          rows={7}
          className="w-full resize-y rounded-2xl border border-ink-950/20 bg-stone-50 p-4 font-mono text-base text-ink-950 transition-colors focus:border-ink-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal"
          aria-describedby="case-actions case-hint"
        />
      </div>

      <p id="case-hint" className="mt-2 font-mono text-xs text-stone-500">
        {t.sentenceCaseHint}
      </p>

      {/* Action Buttons */}
      <div id="case-actions" className="mt-5 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleTransform(toTurkishUpper, t.uppercase)}
          className="min-h-11 rounded-full border border-ink-950 bg-ink-950 px-5 font-archivo text-sm font-semibold text-white transition-colors hover:bg-signal hover:text-ink-950 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          {t.uppercase}
        </button>
        <button
          type="button"
          onClick={() => handleTransform(toTurkishLower, t.lowercase)}
          className="min-h-11 rounded-full border border-ink-950 bg-white px-5 font-archivo text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          {t.lowercase}
        </button>
        <button
          type="button"
          onClick={() => handleTransform(toTurkishTitleCase, t.titlecase)}
          className="min-h-11 rounded-full border border-ink-950 bg-white px-5 font-archivo text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          {t.titlecase}
        </button>
        <button
          type="button"
          onClick={() => handleTransform(toTurkishSentenceCase, t.sentencecase)}
          className="min-h-11 rounded-full border border-ink-950 bg-white px-5 font-archivo text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          {t.sentencecase}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className={`min-h-11 rounded-full px-5 font-archivo text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-signal disabled:cursor-not-allowed disabled:opacity-40 ${
              copied
                ? "border border-emerald-600 bg-emerald-600 text-white"
                : "border border-ink-950 bg-paper-100 text-ink-950 hover:bg-signal"
            }`}
          >
            {copied ? `✓ ${t.copied}` : t.copy}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            className="min-h-11 rounded-full border border-stone-300 bg-white px-4 font-mono text-mono-sm text-stone-600 transition-colors hover:border-ink-950 hover:text-ink-950 focus:outline-none focus:ring-2 focus:ring-signal disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.clear}
          </button>
        </div>
      </div>

      {/* Quick Test Words and Sample Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink-950/10 pt-4 font-mono text-mono-sm">
        <div className="flex flex-wrap items-center gap-2 text-stone-600">
          <span>{t.quickSamplesTitle}</span>
          {testWords.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handleAppendWord(word)}
              className="rounded-md border border-stone-300 bg-stone-50 px-2.5 py-1 text-ink-950 hover:border-ink-950 hover:bg-signal"
            >
              +{word}
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
