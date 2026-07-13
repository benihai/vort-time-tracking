"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarPlus, ListChecks, CalendarClock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import type { Role } from "@/lib/types";

// Role-aware primary nav. Everyone gets the employee tabs (log + my reports);
// admins additionally get the management tabs.
export function MainNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const { t } = useLang();

  const tabs = [
    { href: "/dashboard", label: t("nav.log"), icon: CalendarPlus },
    { href: "/dashboard/history", label: t("nav.myReports"), icon: ListChecks },
    ...(role === "admin"
      ? [
          { href: "/admin", label: t("nav.allReports"), icon: CalendarClock },
          { href: "/admin/users", label: t("nav.users"), icon: Users },
        ]
      : []),
  ];

  return (
    <nav className="flex items-center gap-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors duration-fast sm:px-3",
              active
                ? "bg-primary-light text-primary"
                : "text-fg-muted hover:bg-surface-alt hover:text-fg"
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
