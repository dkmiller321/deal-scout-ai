"use client";

import { trpc } from "@/lib/trpc/client";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { PropertyCard } from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyList() {
  const { filters, activeTab } = usePropertyFilters();

  const { data, isLoading, error } = trpc.properties.list.useQuery({
    limit: 20,
    filters: {
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minBeds: filters.minBeds,
      maxBeds: filters.maxBeds,
      minScore: activeTab === "hot" ? 80 : filters.minScore,
      propertyType: filters.propertyType,
      city: filters.city,
    },
    sort: filters.sortField
      ? {
          field: filters.sortField,
          order: filters.sortOrder || "desc",
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading properties</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.items.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
