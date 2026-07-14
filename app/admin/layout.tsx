"use client";

import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

// Management area shell — admin only (employees are bounced to /dashboard).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth role="admin">
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </RequireAuth>
  );
}
