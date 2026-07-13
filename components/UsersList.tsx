"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLang } from "@/components/LangProvider";
import type { Profile } from "@/lib/types";

export function UsersList({ profiles }: { profiles: Profile[] }) {
  const { t } = useLang();
  return (
    <Card>
      <CardTitle className="mb-4">
        {t("users.listTitle")}{" "}
        <span className="num text-fg-muted">({profiles.length})</span>
      </CardTitle>

      <ul className="flex flex-col divide-y divide-border">
        {profiles.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm font-semibold text-fg-secondary">
              {(p.full_name || "?").trim().charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-fg">
                {p.full_name || t("users.noName")}
              </div>
              {p.email && (
                <div className="num truncate text-xs text-fg-muted" dir="ltr">
                  {p.email}
                </div>
              )}
            </div>
            <Badge tone={p.role === "admin" ? "brand" : "neutral"}>
              {t(p.role === "admin" ? "role.admin" : "role.employee")}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
