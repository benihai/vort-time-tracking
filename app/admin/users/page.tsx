"use client";

import { useCallback, useEffect, useState } from "react";
import { CreateUserForm } from "@/components/CreateUserForm";
import { UsersList } from "@/components/UsersList";
import { useLang } from "@/components/LangProvider";
import { fetchProfiles } from "@/lib/api";
import type { Profile } from "@/lib/types";

export default function UsersPage() {
  const { t } = useLang();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const load = useCallback(() => {
    fetchProfiles().then(setProfiles);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t("users.title")}</h1>
        <p className="text-base text-fg-muted">{t("users.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <CreateUserForm onCreated={load} />
        <UsersList profiles={profiles} />
      </div>
    </div>
  );
}
