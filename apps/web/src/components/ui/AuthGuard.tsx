"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/store/useSessionStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasSession = useSessionStore((state) => state.hasSession);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasSession && pathname !== '/welcome') {
      router.push('/welcome');
    }
  }, [mounted, hasSession, pathname, router]);

  // Show nothing while checking session to prevent hydration flicker
  if (!mounted) return null;
  
  if (!hasSession && pathname !== '/welcome') {
    return null;
  }

  return <>{children}</>;
}
