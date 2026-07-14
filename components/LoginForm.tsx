"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { useLang } from "@/components/LangProvider";
import { useAuth } from "@/components/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const { t } = useLang();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(t("login.error"));
      setLoading(false);
      return;
    }

    // Session is persisted; sync the auth context, then enter the app.
    await refresh();
    router.replace("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field label={t("login.email")} htmlFor="email">
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          dir="ltr"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>

      <Field label={t("login.password")} htmlFor="password">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading && <Loader2 size={16} className="animate-spin" strokeWidth={1.75} />}
        {loading ? t("login.submitting") : t("login.submit")}
      </Button>
    </form>
  );
}
