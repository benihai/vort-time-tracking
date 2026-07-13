import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

/**
 * Loads the current user + profile on the server. Redirects to /login if not
 * signed in. If `requiredRole` is given and doesn't match, sends the user to
 * their own home instead.
 */
export async function requireProfile(requiredRole?: Role): Promise<{
  userId: string;
  email: string | undefined;
  profile: Profile;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // No profile row (shouldn't happen — trigger creates it). Treat as employee.
  if (!profile) redirect("/login");

  if (requiredRole && profile.role !== requiredRole) {
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  return { userId: user.id, email: user.email, profile: profile as Profile };
}
