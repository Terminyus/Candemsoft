import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

// latin-ext carries ğ ü ş ı İ ö ç.
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  // wdth drives the condensed display cut (font-display-tight); opsz was dropped to keep the file small.
  axes: ["wdth"],
  variable: "--ff-display",
  display: "swap",
});

export const body = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-mono",
  display: "swap",
  // Labels and the terminal read fine in the system monospace for the first moment; don't compete with LCP.
  preload: false,
});
