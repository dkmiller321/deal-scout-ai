import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { PropertyAnalyzer } from "@/components/property-analyzer";
import { PropertyList } from "@/components/property-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Deal Analyzer</h1>
          <p className="text-muted-foreground text-lg">
            Enter any property to get instant investment analysis
          </p>
        </div>

        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="analyze">Analyze Property</TabsTrigger>
            <TabsTrigger value="saved">Saved Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="max-w-2xl mx-auto">
            <PropertyAnalyzer />
          </TabsContent>

          <TabsContent value="saved">
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              <DashboardStats />
            </Suspense>

            <div className="mt-6">
              <Suspense fallback={<PropertyListSkeleton />}>
                <PropertyList />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-xl" />
      ))}
    </div>
  );
}
