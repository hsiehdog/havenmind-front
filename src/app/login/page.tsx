"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
  const { data } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.session) {
      router.replace("/dashboard");
    }
  }, [data?.session, router]);

  if (data?.session) {
    return null;
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted/40 px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            HavenMind
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Sign in to your home maintenance co-pilot
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stay informed about upcoming maintenance, open work orders, and the latest additions to your Home Journal—HavenMind keeps every detail in sync.
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </section>
  );
}
