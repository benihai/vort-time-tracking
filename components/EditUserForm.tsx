"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { useLang } from "@/components/LangProvider";
import { setPassword, updateUser } from "@/lib/api";
import type { Profile, Role } from "@/lib/types";

// Inline editor for one user: name, email, role, and an optional password
// reset. The admin types the new password here; it goes straight to Supabase.
export function EditUserForm({
  user,
  onDone,
  onCancel,
}: {
  user: Profile;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { t } = useLang();
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [role, setRole] = useState<Role>(user.role);
  const [password, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setError(null);

    if (!fullName.trim()) return setError(t("users.errName"));
    if (password && password.length < 6) return setError(t("users.errPassword"));

    setLoading(true);
    const res = await updateUser({
      userId: user.id,
      full_name: fullName.trim(),
      email,
      role,
    });
    if (!res.ok) {
      setLoading(false);
      return setError(t(res.key));
    }
    if (password) {
      const pw = await setPassword(user.id, password);
      if (!pw.ok) {
        setLoading(false);
        return setError(t(pw.key));
      }
    }
    setLoading(false);
    onDone();
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-md border border-border bg-surface-alt/60 p-4">
      <div className="text-sm font-semibold text-fg-secondary">
        {t("users.editTitle")}
      </div>

      <Field label={t("users.fullName")} htmlFor={`name-${user.id}`}>
        <Input
          id={`name-${user.id}`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </Field>

      <Field label={t("users.email")} htmlFor={`email-${user.id}`}>
        <Input
          id={`email-${user.id}`}
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label={t("users.role")}>
        <div className="grid grid-cols-2 gap-2">
          {(["employee", "admin"] as Role[]).map((r) => {
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
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

      <Field
        label={t("users.newPassword")}
        htmlFor={`pwd-${user.id}`}
        hint={t("users.newPasswordHint")}
      >
        <Input
          id={`pwd-${user.id}`}
          type="text"
          dir="ltr"
          autoComplete="off"
          value={password}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="••••••"
        />
      </Field>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-sm bg-[#fef2f2] px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle size={16} strokeWidth={1.75} />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={onSave} disabled={loading} size="sm">
          {loading && <Loader2 size={16} className="animate-spin" strokeWidth={1.75} />}
          {loading ? t("users.saving") : t("users.save")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          {t("users.cancel")}
        </Button>
      </div>
    </div>
  );
}
