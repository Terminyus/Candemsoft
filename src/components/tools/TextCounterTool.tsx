"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { analyzeText } from "@/lib/text-tools";

type Props = {
  lang: Locale;
};

const labels = {
  tr: {
    inputLabel: "İncelenecek Metni Girin",
    placeholder: "Saymak ve analiz etmek istediğiniz metni buraya yazın veya yapıştırın...",
    totalChars: "Toplam Karakter",
    charsNoSpaces: "Boşluksuz Karakter",
    wordCount: "Kelime Sayısı",
    sentenceCount: "Cümle Sayısı",
    paragraphCount: "Paragraf Sayısı",
    readingTime: "Okuma Süresi",
    speakingTime: "Konuşma Süresi",
    turkishChars: "Türkçe Harfler",
    vowels: "Sesli Harf",
    consonants: "Sessiz Harf",
    minuteUnit: "dk",
    copy: "Metni Kopyala",
    copied: "Kopyalandı!",
    copyFailed: "Kopyalama başarısız oldu.",
    clear: "Temizle",
    sampleText: "Örnek Metin Yükle",
    sampleLoaded: "Örnek metin yüklendi.",
    densityTitle: "Karakter ve Dil Dağılımı",
    summaryTitle: "Metin Özet Metrikleri",
  },
  en: {
    inputLabel: "Enter Text to Analyze",
    placeholder: "Type or paste your text here to count words, characters and metrics...",
    totalChars: "Total Characters",
    charsNoSpaces: "Characters (No Spaces)",
    wordCount: "Word Count",
    sentenceCount: "Sentence Count",
    paragraphCount: "Paragraph Count",
    readingTime: "Reading Time",
    speakingTime: "Speaking Time",
    turkishChars: "Turkish Letters",
    vowels: "Vowels",
    consonants: "Consonants",
    minuteUnit: "min",
    copy: "Copy Text",
    copied: "Copied!",
    copyFailed: "Failed to copy text.",
    clear: "Clear",
    sampleText: "Load Sample Text",
    sampleLoaded: "Sample text loaded.",
    densityTitle: "Letter & Language Distribution",
    summaryTitle: "Text Summary Metrics",
  },
  es: {
    inputLabel: "Ingrese el texto para analizar",
    placeholder: "Escriba o pegue su texto aquí para contar palabras, caracteres y métricas...",
    totalChars: "Total Caracteres",
    charsNoSpaces: "Caracteres (Sin Espacios)",
    wordCount: "Palabras",
    sentenceCount: "Oraciones",
    paragraphCount: "Párrafos",
    readingTime: "Tiempo de Lectura",
    speakingTime: "Tiempo de Voz",
    turkishChars: "Letras Turcas",
    vowels: "Vocales",
    consonants: "Consonantes",
    minuteUnit: "min",
    copy: "Copiar Texto",
    copied: "¡Copiado!",
    copyFailed: "Error al copiar texto.",
    clear: "Limpiar",
    sampleText: "Cargar Texto de Ejemplo",
    sampleLoaded: "Texto de ejemplo cargado.",
    densityTitle: "Distribución de Letras",
    summaryTitle: "Métricas del Texto",
  },
};

const sampleTexts = {
  tr: "Candemsoft, modern web ve mobil teknolojileri odağında yüksek performanslı yazılımlar üretir. Mühendislik yaklaşımımızda kullanıcı deneyimi, veri güvenliği ve erişilebilirlik ilkeleri her projenin temelini oluşturur. Kendi geliştirdiğimiz Orpigo, Seyyah ve Candemkey gibi ürünlerle gerçek kullanıcı ihtiyaçlarına çözüm sunuyoruz.",
  en: "Candemsoft delivers high-performance digital products and software engineering solutions based in Istanbul. Our focus spans mobile apps, responsive web platforms, and tailored AI systems built with clean code and uncompromising standards.",
  es: "Candemsoft desarrolla aplicaciones móviles y plataformas web de alto rendimiento. Con sede en Estambul, nuestro equipo combina ingeniería moderna con diseño centrado en el usuario.",
};

export function TextCounterTool({ lang }: Props) {
  const t = labels[lang] || labels.tr;
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const stats = useMemo(() => analyzeText(text), [text]);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setStatusMessage(t.copied);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        setStatusMessage("");
      }, 2500);
    } catch {
      setStatusMessage(t.copyFailed);
    }
  }, [text, t.copied, t.copyFailed]);

  const handleClear = useCallback(() => {
    setText("");
    setStatusMessage("");
  }, []);

  const handleLoadSample = useCallback(() => {
    setText(sampleTexts[lang] || sampleTexts.tr);
    setStatusMessage(t.sampleLoaded);
  }, [lang, t.sampleLoaded]);

  return (
    <div className="space-y-6">
      {/* Live screen reader feedback */}
      <div className="sr-only" aria-live="polite" role="status">
        {statusMessage}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label={t.summaryTitle}>
        <div className="rounded-2xl border border-ink-950 bg-white p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-500">{t.wordCount}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-ink-950 sm:text-4xl">
            {stats.wordCount}
          </span>
        </div>
        <div className="rounded-2xl border border-ink-950 bg-white p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-500">{t.totalChars}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-signal sm:text-4xl">
            {stats.characterCount}
          </span>
        </div>
        <div className="rounded-2xl border border-ink-950 bg-white p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-500">{t.charsNoSpaces}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-ink-950 sm:text-4xl">
            {stats.characterCountNoSpaces}
          </span>
        </div>
        <div className="rounded-2xl border border-ink-950 bg-white p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-500">{t.sentenceCount}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-ink-950 sm:text-4xl">
            {stats.sentenceCount}
          </span>
        </div>
        <div className="rounded-2xl border border-ink-950 bg-white p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-500">{t.paragraphCount}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-ink-950 sm:text-4xl">
            {stats.paragraphCount}
          </span>
        </div>
        <div className="rounded-2xl border border-ink-950 bg-signal/20 p-4 text-center">
          <span className="block font-mono text-mono-sm text-stone-600">{t.readingTime}</span>
          <span className="v2-display mt-1 block text-3xl font-bold text-ink-950 sm:text-4xl">
            ~{stats.readingTimeMinutes} <span className="text-base font-normal">{t.minuteUnit}</span>
          </span>
        </div>
      </div>

      {/* Editor Box */}
      <div className="rounded-3xl border border-ink-950 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-950/10 pb-4">
          <label htmlFor="counter-input" className="font-mono text-mono-sm font-semibold text-ink-950">
            {t.inputLabel}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className={`min-h-9 rounded-full px-4 font-archivo text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-signal disabled:cursor-not-allowed disabled:opacity-40 ${
                copied
                  ? "border border-emerald-600 bg-emerald-600 text-white"
                  : "border border-ink-950 bg-white text-ink-950 hover:bg-signal"
              }`}
            >
              {copied ? `✓ ${t.copied}` : t.copy}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="min-h-9 rounded-full border border-stone-300 bg-white px-3 font-mono text-xs text-stone-600 transition-colors hover:border-ink-950 hover:text-ink-950 focus:outline-none focus:ring-2 focus:ring-signal disabled:cursor-not-allowed disabled:opacity-30"
            >
              {t.clear}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <textarea
            id="counter-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            rows={8}
            className="w-full resize-y rounded-2xl border border-ink-950/20 bg-stone-50 p-4 font-mono text-base text-ink-950 transition-colors focus:border-ink-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal"
          />
        </div>

        {/* Extended linguistic stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-950/10 pt-4 sm:grid-cols-4 font-mono text-mono-sm">
          <div className="rounded-xl bg-stone-50 p-3">
            <span className="text-stone-500">{t.turkishChars}:</span>{" "}
            <strong className="text-ink-950">{stats.turkishCharCount}</strong>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <span className="text-stone-500">{t.vowels}:</span>{" "}
            <strong className="text-ink-950">{stats.vowelCount}</strong>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <span className="text-stone-500">{t.consonants}:</span>{" "}
            <strong className="text-ink-950">{stats.consonantCount}</strong>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <span className="text-stone-500">{t.speakingTime}:</span>{" "}
            <strong className="text-ink-950">~{stats.speakingTimeMinutes} {t.minuteUnit}</strong>
          </div>
        </div>

        <div className="mt-4 flex justify-end font-mono text-mono-sm">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-stone-600 underline underline-offset-4 hover:text-ink-950"
          >
            {t.sampleText}
          </button>
        </div>
      </div>
    </div>
  );
}
