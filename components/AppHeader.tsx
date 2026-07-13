import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { Badge } from "@/components/ui/Badge";
import { SignOut } from "@/components/SignOut";
import { MainNav } from "@/components/MainNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import type { Profile } from "@/lib/types";

// Sticky top bar with role-aware nav, language toggle, user chip, sign-out.
export function AppHeader({ profile }: { profile: Profile }) {
  const lang = getLang();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark size={26} />
          <span className="hidden font-heading text-lg font-extrabold tracking-tight sm:inline">
            Vort
          </span>
        </Link>

        <MainNav role={profile.role} />

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden text-end sm:block">
            <div className="text-sm font-medium leading-tight text-fg">
              {profile.full_name || t(lang, "header.user")}
            </div>
            <Badge tone={profile.role === "admin" ? "brand" : "neutral"}>
              {t(lang, profile.role === "admin" ? "role.admin" : "role.employee")}
            </Badge>
          </div>
          <LanguageToggle />
          <SignOut />
        </div>
      </div>
    </header>
  );
}
