"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Clock, TrendingUp, MapPin } from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading } = trpc.properties.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-8 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Hot Deals",
      value: stats?.hotDealsCount ?? 0,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "New Listings",
      value: stats?.recentCount ?? 0,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Avg Score",
      value: stats?.avgScore ? Math.round(stats.avgScore) : 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Properties",
      value: stats?.totalCount ?? 0,
      icon: MapPin,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
                <Icon className={cn("h-8 w-8", item.color)} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
