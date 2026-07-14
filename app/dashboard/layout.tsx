"use client";

import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

// Employee area shell (also available to admins). Auth-gated client-side; the
// header's role-aware nav adds admin tabs when relevant.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </RequireAuth>
  );
}
