"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyDetailDialog } from "@/components/property-detail-dialog";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { Heart, Bed, Bath, Square, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  score: number | null;
  capRate: number | null;
  cashOnCash: number | null;
  propertyType: string;
  daysOnMarket: number | null;
  primaryPhoto: string | null;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const utils = trpc.useUtils();

  const { data: favoriteStatus } = trpc.favorites.check.useQuery(
    { propertyId: property.id },
    { enabled: isSignedIn }
  );

  const addFavorite = trpc.favorites.add.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ propertyId: property.id });
      utils.favorites.list.invalidate();
    },
  });

  const removeFavorite = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ propertyId: property.id });
      utils.favorites.list.invalidate();
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) return;

    if (favoriteStatus?.isFavorite) {
      removeFavorite.mutate({ propertyId: property.id });
    } else {
      addFavorite.mutate({ propertyId: property.id });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setDetailOpen(true)}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
          <Image
            src={property.primaryPhoto || "/placeholder-property.svg"}
            alt={property.address}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            unoptimized={!property.primaryPhoto}
          />
          {property.score !== null && (
            <Badge
              className={cn(
                "absolute top-3 left-3",
                getScoreColor(property.score)
              )}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {property.score}
            </Badge>
          )}
          {property.daysOnMarket !== null && property.daysOnMarket <= 3 && (
            <Badge className="absolute top-3 right-12 bg-blue-500">New</Badge>
          )}
          {isSignedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  favoriteStatus?.isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                )}
              />
            </Button>
          )}
        </div>

        <CardContent className="pt-4">
          <p className="font-semibold text-lg">{formatPrice(property.price)}</p>
          <p className="text-sm text-muted-foreground truncate">
            {property.address}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {property.city}, {property.state}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms}
            </span>
            <span className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </span>
            {property.sqft && (
              <span className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.sqft.toLocaleString()} sqft
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="flex gap-4 text-sm">
            {property.capRate && (
              <div>
                <span className="text-muted-foreground">Cap Rate: </span>
                <span className="font-medium">{property.capRate.toFixed(1)}%</span>
              </div>
            )}
            {property.cashOnCash && (
              <div>
                <span className="text-muted-foreground">CoC: </span>
                <span className="font-medium">{property.cashOnCash.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <PropertyDetailDialog
        propertyId={property.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
