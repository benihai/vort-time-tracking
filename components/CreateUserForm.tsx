"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { useLang } from "@/components/LangProvider";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";

const empty = { full_name: "", email: "", password: "", role: "employee" as Role };

// Maps the RPC's raise-exception messages to localized dictionary keys.
const ERROR_KEYS: Record<string, string> = {
  forbidden: "users.errForbidden",
  invalid_email: "users.errEmail",
  weak_password: "users.errPassword",
  email_exists: "users.errExists",
};

export function CreateUserForm() {
  const router = useRouter();
  const { t } = useLang();
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<
    { type: "error" | "ok"; msg: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!form.full_name.trim()) {
      setStatus({ type: "error", msg: t("users.errName") });
      return;
    }
    setLoading(true);

    // Calls the SECURITY DEFINER RPC with the admin's own session — no
    // service-role key required. The function enforces is_admin() itself.
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_create_user", {
      p_email: form.email,
      p_password: form.password,
      p_full_name: form.full_name,
      p_role: form.role,
    });
    setLoading(false);

    if (error) {
      const key = ERROR_KEYS[error.message?.trim()] ?? "users.errFailed";
      setStatus({ type: "error", msg: t(key) });
      return;
    }
    setStatus({
      type: "ok",
      msg: t("users.created", { name: form.full_name }),
    });
    setForm(empty);
    router.refresh();
  }

  return (
    <Card>
      <CardTitle className="mb-4">{t("users.newTitle")}</CardTitle>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label={t("users.fullName")} htmlFor="full_name">
          <Input
            id="full_name"
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            placeholder={t("users.fullNamePlaceholder")}
            required
          />
        </Field>

        <Field label={t("users.email")} htmlFor="new_email">
          <Input
            id="new_email"
            type="email"
            dir="ltr"
            autoComplete="off"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="name@company.com"
            required
          />
        </Field>

        <Field
          label={t("users.password")}
          htmlFor="new_password"
          hint={t("users.passwordHint")}
        >
          <Input
            id="new_password"
            type="text"
            dir="ltr"
            autoComplete="off"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder={t("users.passwordPlaceholder")}
            required
          />
        </Field>

        <Field label={t("users.role")} htmlFor="role">
          <div className="grid grid-cols-2 gap-2">
            {(["employee", "admin"] as Role[]).map((r) => {
              const active = form.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("role", r)}
                  aria-pressed={active}
                  className={
                    "focus-ring h-10 rounded-md border text-sm font-medium transition-colors duration-fast " +
                    (active
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-surface text-fg-secondary hover:bg-surface-alt")
                  }
                >
                  {t(r === "admin" ? "role.admin" : "role.employee")}
                </button>
              );
            })}
          </div>
        </Field>

        {status && (
          <div
            role={status.type === "error" ? "alert" : "status"}
            className={
              status.type === "error"
                ? "flex items-center gap-2 rounded-sm bg-[#fef2f2] px-3 py-2 text-sm text-destructive"
                : "flex items-center gap-2 rounded-sm bg-[#f0fdf4] px-3 py-2 text-sm text-[#15803d]"
            }
          >
            {status.type === "error" ? (
              <AlertCircle size={16} strokeWidth={1.75} />
            ) : (
              <CheckCircle2 size={16} strokeWidth={1.75} />
            )}
            {status.msg}
          </div>
        )}

        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading ? (
            <Loader2 size={16} className="animate-spin" strokeWidth={1.75} />
          ) : (
            <UserPlus size={16} strokeWidth={1.75} />
          )}
          {loading ? t("users.creating") : t("users.create")}
        </Button>
      </form>
    </Card>
  );
}
