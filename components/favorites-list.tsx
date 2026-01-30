"use client";

import { trpc } from "@/lib/trpc/client";
import { PropertyCard } from "@/components/property-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export function FavoritesList() {
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved properties yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the heart icon on any property to save it for later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
