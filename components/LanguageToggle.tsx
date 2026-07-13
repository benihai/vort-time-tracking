"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/components/LangProvider";
import { Button } from "@/components/ui/Button";

// Shows the language you'd switch TO (English label while in Hebrew, and
// vice-versa), per the dictionary key "lang.switchTo".
export function LanguageToggle() {
  const { t, toggle } = useLang();
  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle language">
      <Languages size={16} strokeWidth={1.75} />
      {t("lang.switchTo")}
    </Button>
  );
}
