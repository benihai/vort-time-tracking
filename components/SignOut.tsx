"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { Button } from "@/components/ui/Button";

export function SignOut() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { t } = useLang();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await signOut();
        router.replace("/login");
      }}
    >
      <LogOut size={16} strokeWidth={1.75} />
      <span className="hidden sm:inline">{t("header.signout")}</span>
    </Button>
  );
}
