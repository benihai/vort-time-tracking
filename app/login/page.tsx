"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { LogoMark, Wordmark } from "@/components/LogoMark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/components/LangProvider";
import { useAuth } from "@/components/AuthProvider";

// Split-block layout (§10.1): coral left, white right. Stacks on mobile.
export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const { loading, user } = useAuth();

  // Already signed in -> go to the app.
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <main className="relative min-h-screen md:grid md:grid-cols-[42%_1fr]">
      <div className="absolute end-4 top-4 z-10">
        <LanguageToggle />
      </div>

      <aside className="relative hidden flex-col justify-between bg-primary p-12 text-white md:flex">
        <Wordmark size={32} />
        <div>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight">
            {t("login.headline")}
          </h1>
          <p className="mt-4 max-w-xs text-md text-white/85">
            {t("login.tagline")}
          </p>
        </div>
        <p className="text-sm text-white/70">{t("login.brandFooter")}</p>
      </aside>

      <section className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <LogoMark size={44} />
            <span className="font-heading text-xl font-extrabold">Vort</span>
          </div>
          <h2 className="mb-1 text-2xl text-fg">{t("login.title")}</h2>
          <p className="mb-6 text-base text-fg-muted">{t("login.intro")}</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
