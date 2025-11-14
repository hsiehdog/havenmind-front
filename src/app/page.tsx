"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";

const features = [
  {
    title: "Smart document intake",
    description:
      "Upload inspections, receipts, or manuals and HavenMind extracts systems, service dates, and warranty periods automatically.",
  },
  {
    title: "Proactive maintenance plans",
    description:
      "AI turns raw data into a personalized upkeep schedule, sends reminders, and boosts your Home Health Score before things break.",
  },
  {
    title: "Collaboration in one place",
    description:
      "Assign work to pros or tenants, share photos, and track every receipt or approval from the same dashboard.",
  },
];

export default function Home() {
  const router = useRouter();
  const { data } = authClient.useSession();

  useEffect(() => {
    if (data?.session) {
      router.replace("/dashboard");
    }
  }, [data?.session, router]);

  if (data?.session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20">
        <section className="space-y-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            AI-powered home maintenance
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Keep every property organized, maintained, and worry-free
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              HavenMind combines document intelligence, proactive reminders, and simple collaboration tools so homeowners and property
              managers can prevent breakdowns, control costs, and preserve long-term value.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-muted bg-background/80">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border bg-background/70 p-6 shadow-lg">
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>How HavenMind works</CardTitle>
              <CardDescription>
                Upload documents, log repairs, or message a pro and HavenMind automatically updates the Home Journal, schedules tasks, and raises reminders before deadlines slip.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <div>
                <p className="font-semibold text-foreground">Document intelligence</p>
                <p>Send HavenMind inspections, warranties, or receipts. The AI extracts systems, warranty windows, and service history so nothing gets lost.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Coordinated upkeep</p>
                <p>Plan recurring tasks, assign techs, share photos, and build a searchable Home Journal that powers the Home Health Score.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
