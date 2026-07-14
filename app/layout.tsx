import type { Metadata } from "next";
import { Heebo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { AuthProvider } from "@/components/AuthProvider";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-heebo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

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

// Defaults to English/LTR; LangProvider restores the saved language on mount.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${heebo.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <LangProvider>
          <AuthProvider>{children}</AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
