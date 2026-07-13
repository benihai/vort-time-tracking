"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { dirFor, t as translate, type Lang } from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  initial,
  children,
}: {
  initial: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initial);

  // Stay in sync with the server-provided value after a refresh.
  useEffect(() => setLangState(initial), [initial]);

  const value = useMemo<LangContextValue>(() => {
    function setLang(next: Lang) {
      document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
      // Update <html> immediately for a snappy flip, then refresh so server
      // components re-render in the new language.
      document.documentElement.lang = next;
      document.documentElement.dir = dirFor(next);
      setLangState(next);
      router.refresh();
    }

    return {
      lang,
      dir: dirFor(lang),
      t: (key, vars) => translate(lang, key, vars),
      setLang,
      toggle: () => setLang(lang === "he" ? "en" : "he"),
    };
  }, [lang, router]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
