import type { Metadata } from "next";
import { Heebo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { getLang } from "@/lib/lang-server";
import { dirFor } from "@/lib/i18n";

// Body / UI (§5.1). Heebo carries Hebrew + English equally — Vort is RTL-native.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-heebo",
  display: "swap",
});

// Display fallback for TelAviv Brutalist (the doc's approved fallback is Inter Bold).
const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Numeric / technical surfaces (§5.1).
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vort — Work Hours",
  description: "Employee time tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getLang();
  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${heebo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <LangProvider initial={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
