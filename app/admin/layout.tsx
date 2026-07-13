import { requireProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

export const dynamic = "force-dynamic";

// Management area shell — admin only (employees are bounced to /dashboard).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireProfile("admin");
  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
