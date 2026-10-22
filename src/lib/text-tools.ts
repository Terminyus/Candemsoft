/* -------------------------------------------------------------------------- */
/* Turkish Typography & String Manipulation Algorithms (Pure - Client & Server)*/
/* -------------------------------------------------------------------------- */

/**
 * Converts text to uppercase strictly respecting Turkish rules:
 * - 'i' -> 'İ' (U+0130)
 * - 'ı' -> 'I' (U+0049)
 * Example: 'ilişki' -> 'İLİŞKİ'
 */
export function toTurkishUpper(text: string): string {
  return text.toLocaleUpperCase("tr");
}

/**
 * Converts text to lowercase strictly respecting Turkish rules:
 * - 'İ' -> 'i' (U+0069)
 * - 'I' -> 'ı' (U+0131)
 * Example: 'IŞIK' -> 'ışık'
 */
export function toTurkishLower(text: string): string {
  return text.toLocaleLowerCase("tr");
}

/**
 * Capitalizes the first letter of every word using Turkish locale casing.
 * Example: 'istanbul ve ışık' -> 'İstanbul Ve Işık'
 */
export function toTurkishTitleCase(text: string): string {
  if (!text) return "";
  return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
    const first = word.slice(0, 1).toLocaleUpperCase("tr");
    const rest = word.slice(1).toLocaleLowerCase("tr");
    return first + rest;
  });
}

/**
 * Formats text into sentence case, capitalizing the first letter of each sentence
 * according to Turkish rules while converting the rest to lowercase.
 * Handles leading whitespace, quotes, and punctuation correctly.
 */
export function toTurkishSentenceCase(text: string): string {
  if (!text) return "";
  const lower = text.toLocaleLowerCase("tr");
  // Matches start of text or terminal punctuation (. ! ? or newline)
  // followed by optional whitespace, quotes, parentheses, brackets, then the first letter
  const sentenceStartRegex = /(^[\s"'“‘«(\[]*|[.!?\n]+[\s"'“‘»)\/\]]*)([\p{L}])/gu;
  return lower.replace(sentenceStartRegex, (match, prefix, char) => {
    return prefix + char.toLocaleUpperCase("tr");
  });
}

/* -------------------------------------------------------------------------- */
/* Text Analysis & Metrics                                                    */
/* -------------------------------------------------------------------------- */

export type TextAnalysisResult = {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  turkishCharCount: number;
  vowelCount: number;
  consonantCount: number;
};

// Turkish vowels plus common accented European vowels (Spanish, etc.)
const ALL_VOWELS = new Set([
  "a", "e", "ı", "i", "o", "ö", "u", "ü",
  "á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "â", "ê", "î", "ô", "û", "ä", "ë", "ï",
  "A", "E", "I", "İ", "O", "Ö", "U", "Ü",
  "Á", "É", "Í", "Ó", "Ú", "À", "È", "Ì", "Ò", "Ù", "Â", "Ê", "Î", "Ô", "Û", "Ä", "Ë", "Ï",
]);

/**
 * Counts sentences accurately, guarding against numbers with decimals (e.g. 3.14),
 * multiple dots (ellipsis ...), and common abbreviations (Dr., Prof., vb., etc.).
 */
export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Protect decimal numbers like 3.14 or 1.000 so the dot is not a sentence split
  let sanitized = trimmed.replace(/\b\d+\.\d+\b/g, (m) => m.replace(".", "@"));

  // Protect common Turkish and English abbreviations
  sanitized = sanitized.replace(/\b(dr|prof|av|vb|vs|org|cad|sok|apt|no|sf|bkz|al|mr|mrs|ms)\./gi, "$1@");

  // Collapse consecutive dots (ellipsis ...) to a single period
  sanitized = sanitized.replace(/\.{2,}/g, ".");

  // Split on terminal punctuation (. ! ?) followed by whitespace, end-of-line, or newlines
  const segments = sanitized
    .split(/(?:[.!?]+(?:\s+|$)|[\n\r]+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /\p{L}|\p{N}/u.test(s));

  return segments.length;
}

export function analyzeText(text: string): TextAnalysisResult {
  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, "").length;
  const trimmed = text.trim();

  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const sentenceCount = countSentences(text);

  const paragraphs = trimmed
    ? text.split(/\n+/).filter((p) => p.trim().length > 0)
    : [];
  const paragraphCount = paragraphs.length;

  // Average reading speed: ~200 words per minute
  const readingTimeMinutes = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;
  // Average speaking speed: ~130 words per minute
  const speakingTimeMinutes = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 130)) : 0;

  let turkishCharCount = 0;
  let vowelCount = 0;
  let consonantCount = 0;

  for (const char of text) {
    // Only genuine Turkish-specific non-ASCII letters (do not include standard ASCII 'I')
    if (/[çÇğĞıİöÖşŞüÜ]/.test(char)) {
      turkishCharCount++;
    }
    if (ALL_VOWELS.has(char)) {
      vowelCount++;
    } else if (/\p{L}/u.test(char)) {
      consonantCount++;
    }
  }

  return {
    characterCount,
    characterCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
    speakingTimeMinutes,
    turkishCharCount,
    vowelCount,
    consonantCount,
  };
}

/* -------------------------------------------------------------------------- */
/* ASCII Transliteration & Slug Generation                                    */
/* -------------------------------------------------------------------------- */

const TURKISH_ASCII_MAP: Record<string, string> = {
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  I: "I",
  İ: "I",
  i: "i",
  ö: "o",
  Ö: "O",
  ş: "s",
  Ş: "S",
  ü: "u",
  Ü: "U",
};

/**
 * Transliterates Turkish special characters into plain ASCII equivalents
 * while preserving formatting, spaces, and punctuation.
 */
export function toAsciiText(text: string): string {
  let res = text.replace(/[çÇğĞıIİöÖşŞüÜ]/g, (m) => TURKISH_ASCII_MAP[m] || m);
  res = res.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return res;
}

export type SlugOptions = {
  separator?: "-" | "_";
  lowercase?: boolean;
};

/**
 * Generates clean, SEO-friendly, ASCII URL slugs from any text containing Turkish characters.
 * Handles 'I' and 'İ' accurately:
 * 'IŞIK' -> 'isik'
 * 'İLİŞKİ' -> 'iliski'
 */
export function toAsciiSlug(text: string, options: SlugOptions = {}): string {
  const separator = options.separator === "_" ? "_" : "-";
  const lowercase = options.lowercase !== false;

  let str = text;
  if (lowercase) {
    str = str.toLocaleLowerCase("tr");
    const trSlugMap: Record<string, string> = {
      ç: "c",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
    };
    str = str.replace(/[çğışöü]/g, (m) => trSlugMap[m] || m);
  } else {
    str = toAsciiText(str);
  }

  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remove quotes, apostrophes and backticks before replacing non-alphanumeric
  str = str.replace(/['"`´’‘]/g, "");

  const sepEscaped = separator === "-" ? "\\-" : separator;
  const regexNonAlphanumeric = new RegExp(`[^a-zA-Z0-9${sepEscaped}]+`, "g");
  str = str.replace(regexNonAlphanumeric, separator);

  const regexMultiSep = new RegExp(`${sepEscaped}+`, "g");
  str = str.replace(regexMultiSep, separator);

  const regexTrimSep = new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, "g");
  str = str.replace(regexTrimSep, "");

  return str;
}
