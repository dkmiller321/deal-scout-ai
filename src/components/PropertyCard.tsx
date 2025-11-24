import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/data/mockProperties";
import { Home, TrendingUp, DollarSign, Calendar } from "lucide-react";

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
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="relative">
        <img 
          src={property.photos[0]} 
          alt={property.address}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={getScoreBadgeVariant(property.score)} className="font-bold">
            Score: {property.score}
          </Badge>
          <Badge variant="outline" className="bg-background/90">
            {property.source}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg">{property.address}</h3>
            <p className="text-sm text-muted-foreground">
              {property.city}, {property.state} {property.zip}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{property.propertyType}</p>
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>{property.bedrooms} bed</span>
              <span>•</span>
              <span>{property.bathrooms} bath</span>
              <span>•</span>
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Cap Rate</p>
              <p className={`font-semibold ${getScoreColor(property.score)}`}>
                {property.capRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CoC Return</p>
              <p className={`font-semibold ${getScoreColor(property.score)}`}>
                {property.cocReturn}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ARV</p>
              <p className="font-semibold text-foreground">
                ${(property.arvEstimate / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{property.daysOnMarket} days on market</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          <span>Rehab: ${(property.rehabEstimate / 1000).toFixed(0)}k</span>
        </div>
      </CardFooter>
    </Card>
  );
};
