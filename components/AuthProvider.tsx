"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type AuthState = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile(u: User | null) {
    if (!u) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", u.id)
      .single();
    setProfile((data as Profile) ?? null);
  }

  async function refresh() {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);
    await loadProfile(u);
  }

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      setUser(session?.user ?? null);
      await loadProfile(session?.user ?? null);
      if (active) setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      user,
      profile,
      refresh,
      signOut: async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, user, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
