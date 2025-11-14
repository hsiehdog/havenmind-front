"use client";

import { Sparkles } from "lucide-react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { ProjectsCard } from "@/components/dashboard/projects-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export function DashboardView() {
  const { data } = authClient.useSession();
  const isAuthenticated = Boolean(data?.session);
  const { usageQuery, projectQuery, activityQuery } = useDashboardData(isAuthenticated);

  return (
    <div className="space-y-6">
      <Card className="border-muted bg-gradient-to-br from-background via-background to-muted/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              Hey {data?.user?.name || "there"},
            </CardTitle>
            <CardDescription>
              Track maintenance plans, repair requests, and collaboration threads without leaving your HavenMind cockpit.
            </CardDescription>
          </div>
          <div className="hidden rounded-full border px-4 py-2 text-sm font-medium md:flex md:items-center md:gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Home Health Score
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Connect your HavenMind API by setting{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code>. Every request reuses the secure auth session so property data stays in sync.
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="space-y-4">
          <MetricCards metrics={usageQuery.data} isLoading={usageQuery.isPending} />
          <ProjectsCard
            projects={projectQuery.data}
            isLoading={projectQuery.isPending}
          />
          <ActivityFeed
            activity={activityQuery.data}
            isLoading={activityQuery.isPending}
          />
        </div>
        <div className="space-y-4 lg:sticky lg:top-24">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
