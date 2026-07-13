import { cookies } from "next/headers";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n";

// Reads the active language from the `lang` cookie (server side). Usable in
// server components, server actions, and route handlers.
export function getLang(): Lang {
  const value = cookies().get("lang")?.value;
  return value === "he" ? "he" : DEFAULT_LANG;
}
