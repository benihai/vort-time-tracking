"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  dirFor,
  t as translate,
  type Lang,
} from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = "lang";

function apply(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = dirFor(lang);
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore the saved language on mount (client-only; no server/cookies on
  // a static host).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "he" || saved === "en") {
      setLangState(saved);
      apply(saved);
    }
  }, []);

  const value = useMemo<LangContextValue>(() => {
    function setLang(next: Lang) {
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
      setLangState(next);
    }
    return {
      lang,
      dir: dirFor(lang),
      t: (key, vars) => translate(lang, key, vars),
      setLang,
      toggle: () => setLang(lang === "he" ? "en" : "he"),
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
