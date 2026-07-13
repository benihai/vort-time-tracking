"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/components/LangProvider";

export function SignOut() {
  const router = useRouter();
  const { t } = useLang();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/login");
        router.refresh();
      }}
    >
      <LogOut size={16} strokeWidth={1.75} />
      <span className="hidden sm:inline">{t("header.signout")}</span>
    </Button>
  );
}
