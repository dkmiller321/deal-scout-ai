import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Property } from "@/data/mockProperties";
import { Home, TrendingUp, DollarSign, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyDetailDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-muted-foreground";
};

const getScoreBadgeVariant = (score: number) => {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "outline";
};

export const PropertyDetailDialog = ({ property, open, onOpenChange }: PropertyDetailDialogProps) => {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{property.address}</DialogTitle>
              <p className="text-muted-foreground mt-1">
                {property.city}, {property.state} {property.zip}
              </p>
            </div>
            <Badge variant={getScoreBadgeVariant(property.score)} className="text-lg font-bold px-4 py-1">
              Score: {property.score}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Property Image */}
          <div className="relative">
            <img 
              src={property.photos[0]} 
              alt={property.address}
              className="w-full h-80 object-cover rounded-lg"
            />
            <Badge variant="outline" className="absolute top-3 left-3 bg-background/90">
              {property.source}
            </Badge>
          </div>

          {/* Price and Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold">${property.price.toLocaleString()}</p>
              <p className="text-muted-foreground mt-1">{property.propertyType}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="text-xl font-semibold">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="text-xl font-semibold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Square Feet</p>
                <p className="text-xl font-semibold">{property.sqft.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year Built</p>
                <p className="text-xl font-semibold">{property.yearBuilt}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Investment Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Investment Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Cap Rate</p>
                <p className={`text-2xl font-bold ${getScoreColor(property.score)}`}>
                  {property.capRate}%
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">CoC Return</p>
                <p className={`text-2xl font-bold ${getScoreColor(property.score)}`}>
                  {property.cocReturn}%
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">ARV Estimate</p>
                <p className="text-2xl font-bold">${(property.arvEstimate / 1000).toFixed(0)}k</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Rehab Cost</p>
                <p className="text-2xl font-bold">${(property.rehabEstimate / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Property Description</h3>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* AI Analysis */}
          {property.analysis && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <p className="text-foreground leading-relaxed">{property.analysis}</p>
                </div>
              </div>
            </>
          )}

          {/* Additional Details */}
          <Separator />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Days on Market</p>
                <p className="font-semibold">{property.daysOnMarket} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Lot Size</p>
                <p className="font-semibold">{property.lotSize.toLocaleString()} sqft</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Source</p>
                <p className="font-semibold">{property.source}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full" size="lg" asChild>
            <a href={property.listingUrl} target="_blank" rel="noopener noreferrer">
              View Original Listing
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
