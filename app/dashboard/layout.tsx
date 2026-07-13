import { requireProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

export const dynamic = "force-dynamic";

// Employee area shell (also available to admins). Auth-gated; the header's
// role-aware nav adds admin tabs when relevant.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireProfile();
  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
