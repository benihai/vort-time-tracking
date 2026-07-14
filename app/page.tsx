"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Static host: redirect happens client-side. Everyone starts at /dashboard.
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={28} strokeWidth={1.75} />
    </div>
  );
}
