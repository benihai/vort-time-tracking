import { LoginForm } from "@/components/LoginForm";
import { LogoMark, Wordmark } from "@/components/LogoMark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";

// Split-block layout (§10.1): coral left, white right. Stacks on mobile.
export default function LoginPage() {
  const lang = getLang();
  return (
    <main className="relative min-h-screen md:grid md:grid-cols-[42%_1fr]">
      <div className="absolute end-4 top-4 z-10">
        <LanguageToggle />
      </div>

      {/* Coral block — hidden on mobile to keep the login dead simple */}
      <aside className="relative hidden flex-col justify-between bg-primary p-12 text-white md:flex">
        <Wordmark size={32} />
        <div>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight">
            {t(lang, "login.headline")}
          </h1>
          <p className="mt-4 max-w-xs text-md text-white/85">
            {t(lang, "login.tagline")}
          </p>
        </div>
        <p className="text-sm text-white/70">{t(lang, "login.brandFooter")}</p>
      </aside>

      {/* Form block */}
      <section className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <LogoMark size={44} />
            <span className="font-heading text-xl font-extrabold">Vort</span>
          </div>
          <h2 className="mb-1 text-2xl text-fg">{t(lang, "login.title")}</h2>
          <p className="mb-6 text-base text-fg-muted">{t(lang, "login.intro")}</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
