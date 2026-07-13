import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/CreateUserForm";
import { UsersList } from "@/components/UsersList";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = createClient();
  const lang = getLang();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t(lang, "users.title")}</h1>
        <p className="text-base text-fg-muted">{t(lang, "users.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <CreateUserForm />
        <UsersList profiles={(profiles ?? []) as Profile[]} />
      </div>
    </div>
  );
}
