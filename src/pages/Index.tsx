import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";
import { PropertyFilters, PropertyFilterState } from "@/components/PropertyFilters";
import { mockProperties, Property } from "@/data/mockProperties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultFilters: PropertyFilterState = {
  minPrice: "",
  maxPrice: "",
  minBedrooms: "any",
  minScore: "any",
  propertyType: "all",
  city: "all",
  sortBy: "score-desc",
};

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilterState>(defaultFilters);

  const filteredAndSortedProperties = useMemo(() => {
    let result = [...mockProperties];

    // Apply filters
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    if (filters.minBedrooms !== "any") {
      result = result.filter(p => p.bedrooms >= parseInt(filters.minBedrooms));
    }
    if (filters.minScore !== "any") {
      result = result.filter(p => p.score >= parseInt(filters.minScore));
    }
    if (filters.propertyType !== "all") {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.city !== "all") {
      result = result.filter(p => p.city === filters.city);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "score-desc":
        result.sort((a, b) => b.score - a.score);
        break;
      case "score-asc":
        result.sort((a, b) => a.score - b.score);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "dom-asc":
        result.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      case "dom-desc":
        result.sort((a, b) => b.daysOnMarket - a.daysOnMarket);
        break;
    }

    return result;
  }, [filters]);

  const hotDeals = filteredAndSortedProperties.filter(p => p.score >= 80);
  const recentDeals = filteredAndSortedProperties.filter(p => p.daysOnMarket <= 7);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="hot" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hot">🔥 Hot Deals ({hotDeals.length})</TabsTrigger>
            <TabsTrigger value="recent">🆕 Recent ({recentDeals.length})</TabsTrigger>
            <TabsTrigger value="all">📋 All Properties ({filteredAndSortedProperties.length})</TabsTrigger>
          </TabsList>

          <PropertyFilters 
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />

          <TabsContent value="hot" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Top Scoring Deals</h2>
              <p className="text-muted-foreground mb-6">Properties with investment score ≥ 80</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotDeals.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recently Listed</h2>
              <p className="text-muted-foreground mb-6">Properties added in the last 7 days</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDeals.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">All Properties</h2>
              <p className="text-muted-foreground mb-6">Complete property inventory across all markets</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PropertyDetailDialog 
        property={selectedProperty}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Index;
