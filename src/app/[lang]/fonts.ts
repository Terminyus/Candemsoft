import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

// latin-ext carries ğ ü ş ı İ ö ç.
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--ff-display",
  display: "swap",
});

export const body = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--ff-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-mono",
  display: "swap",
});
