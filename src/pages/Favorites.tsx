import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";
import { mockProperties, Property } from "@/data/mockProperties";
import { Heart } from "lucide-react";

const Favorites = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Mock favorites - in real app, this would come from user data
  const favoriteProperties = mockProperties.slice(0, 3);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold">Saved Properties</h1>
          </div>
          <p className="text-muted-foreground">
            Properties you've marked for further review
          </p>
        </div>

        {favoriteProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved properties yet</h3>
            <p className="text-muted-foreground">
              Start browsing deals and save your favorites for quick access
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        )}
      </div>

      <PropertyDetailDialog 
        property={selectedProperty}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Favorites;
