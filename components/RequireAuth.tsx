"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import type { Role } from "@/lib/types";

// Client-side route guard (there is no server on GitHub Pages). Data is still
// protected by Supabase RLS regardless of this — this is for UX/navigation.
export function RequireAuth({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, user, profile } = useAuth();

  const wrongRole = !!role && !!profile && profile.role !== role;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (wrongRole) {
      router.replace("/dashboard");
    }
  }, [loading, user, wrongRole, router]);

  if (loading || !user || (role && !profile) || wrongRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} strokeWidth={1.75} />
      </div>
    );
  }

  return <>{children}</>;
}
