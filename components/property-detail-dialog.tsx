"use client";

import Image from "next/image";
import { trpc } from "@/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import {
  Heart,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyDetailDialogProps {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyDetailDialog({
  propertyId,
  open,
  onOpenChange,
}: PropertyDetailDialogProps) {
  const { isSignedIn } = useAuth();

  const { data: property, isLoading } = trpc.properties.getById.useQuery(
    { id: propertyId },
    { enabled: open }
  );

  const { data: favoriteStatus } = trpc.favorites.check.useQuery(
    { propertyId },
    { enabled: open && isSignedIn }
  );

  const utils = trpc.useUtils();

  const addFavorite = trpc.favorites.add.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ propertyId });
      utils.favorites.list.invalidate();
    },
  });

  const removeFavorite = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ propertyId });
      utils.favorites.list.invalidate();
    },
  });

  const handleFavoriteClick = () => {
    if (!isSignedIn) return;

    if (favoriteStatus?.isFavorite) {
      removeFavorite.mutate({ propertyId });
    } else {
      addFavorite.mutate({ propertyId });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading || !property) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{formatPrice(property.price)}</span>
            {property.score !== null && (
              <Badge
                className={cn(
                  property.score >= 80
                    ? "bg-green-500"
                    : property.score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                )}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Score: {property.score}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
          <Image
            src={property.primaryPhoto || "/placeholder-property.svg"}
            alt={property.address}
            fill
            className="object-cover"
            unoptimized={!property.primaryPhoto}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{property.address}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {property.city}, {property.state} {property.zip}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{property.bathrooms} Baths</span>
            </div>
            {property.sqft && (
              <div className="flex items-center">
                <Square className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            )}
            {property.yearBuilt && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Built {property.yearBuilt}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.capRate && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cap Rate</p>
                <p className="text-xl font-semibold">
                  {property.capRate.toFixed(1)}%
                </p>
              </div>
            )}
            {property.cashOnCash && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cash on Cash</p>
                <p className="text-xl font-semibold">
                  {property.cashOnCash.toFixed(1)}%
                </p>
              </div>
            )}
            {property.monthlyRentEstimate && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Est. Rent</p>
                <p className="text-xl font-semibold">
                  {formatPrice(property.monthlyRentEstimate)}/mo
                </p>
              </div>
            )}
            {property.arvEstimate && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">ARV</p>
                <p className="text-xl font-semibold">
                  {formatPrice(property.arvEstimate)}
                </p>
              </div>
            )}
          </div>

          {property.aiAnalysis && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">AI Analysis</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.aiAnalysis}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-3">
            {isSignedIn && (
              <Button
                variant={favoriteStatus?.isFavorite ? "default" : "outline"}
                onClick={handleFavoriteClick}
                className="flex-1"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 mr-2",
                    favoriteStatus?.isFavorite && "fill-current"
                  )}
                />
                {favoriteStatus?.isFavorite ? "Saved" : "Save Property"}
              </Button>
            )}
            {property.listingUrl && (
              <Button variant="outline" asChild className="flex-1">
                <a
                  href={property.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Listing
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
