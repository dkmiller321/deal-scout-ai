import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/data/mockProperties";
import { Home, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const getScoreBadgeVariant = (score: number) => {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "outline";
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-muted-foreground";
};

export const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50 hover:border-border animate-fade-in" onClick={onClick}>
      <div className="relative overflow-hidden">
        <img 
          src={property.photos[0]} 
          alt={property.address}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge 
            variant={getScoreBadgeVariant(property.score)} 
            className={cn(
              "font-bold text-sm px-3 py-1 shadow-lg backdrop-blur-sm",
              property.score >= 80 && "bg-success text-success-foreground shadow-success/50",
              property.score >= 60 && property.score < 80 && "bg-warning text-warning-foreground shadow-warning/50"
            )}
          >
            {property.score}
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border/50 shadow-sm">
            {property.source}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-5 pb-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{property.address}</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {property.city}, {property.state} {property.zip}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-3xl font-bold text-foreground tracking-tight">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{property.propertyType}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5" />
                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
              </div>
              <div className="text-xs">
                {property.sqft.toLocaleString()} sqft
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">Cap Rate</p>
              <p className={cn("font-bold text-lg", getScoreColor(property.score))}>
                {property.capRate}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">CoC Return</p>
              <p className={cn("font-bold text-lg", getScoreColor(property.score))}>
                {property.cocReturn}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">ARV</p>
              <p className="font-bold text-lg text-foreground">
                ${(property.arvEstimate / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4 bg-muted/20">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>{property.daysOnMarket} days</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <DollarSign className="h-3.5 w-3.5" />
          <span>Rehab: ${(property.rehabEstimate / 1000).toFixed(0)}k</span>
        </div>
      </CardFooter>
    </Card>
  );
};
