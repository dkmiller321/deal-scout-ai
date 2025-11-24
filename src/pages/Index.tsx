import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";
import { mockProperties, Property } from "@/data/mockProperties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hotDeals = mockProperties.filter(p => p.score >= 80);
  const recentDeals = mockProperties.filter(p => p.daysOnMarket <= 7);

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
            <TabsTrigger value="all">📋 All Properties ({mockProperties.length})</TabsTrigger>
          </TabsList>

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
                {mockProperties.map(property => (
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
