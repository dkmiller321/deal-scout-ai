"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { FavoritesList } from "@/components/favorites-list";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Saved Properties</h1>
          <p className="text-muted-foreground mt-1">
            Properties you've saved for later review
          </p>
        </div>

        <FavoritesList />
      </main>
    </div>
  );
}
