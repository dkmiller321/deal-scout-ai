import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface PropertyFilterState {
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  minScore: string;
  propertyType: string;
  city: string;
  sortBy: string;
}

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  onFilterChange: (filters: PropertyFilterState) => void;
  onReset: () => void;
}

export const PropertyFilters = ({ filters, onFilterChange, onReset }: PropertyFiltersProps) => {
  const updateFilter = (key: keyof PropertyFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Filters & Sort</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset} className="hover:bg-accent/50 transition-colors">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-sm font-medium">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="h-10 rounded-lg border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-sm font-medium">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="$1,000,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="h-10 rounded-lg border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minBedrooms" className="text-sm font-medium">Min Bedrooms</Label>
            <Select value={filters.minBedrooms} onValueChange={(v) => updateFilter("minBedrooms", v)}>
              <SelectTrigger id="minBedrooms" className="h-10 rounded-lg border-border/50">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minScore" className="text-sm font-medium">Min Score</Label>
            <Select value={filters.minScore} onValueChange={(v) => updateFilter("minScore", v)}>
              <SelectTrigger id="minScore" className="h-10 rounded-lg border-border/50">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="60">60+</SelectItem>
                <SelectItem value="70">70+</SelectItem>
                <SelectItem value="80">80+</SelectItem>
                <SelectItem value="90">90+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType" className="text-sm font-medium">Property Type</Label>
            <Select value={filters.propertyType} onValueChange={(v) => updateFilter("propertyType", v)}>
              <SelectTrigger id="propertyType" className="h-10 rounded-lg border-border/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Single Family">Single Family</SelectItem>
                <SelectItem value="Multifamily">Multifamily</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">City</Label>
            <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
              <SelectTrigger id="city" className="h-10 rounded-lg border-border/50">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Tampa">Tampa</SelectItem>
                <SelectItem value="Orlando">Orlando</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sortBy" className="text-sm font-medium">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
              <SelectTrigger id="sortBy" className="h-10 rounded-lg border-border/50">
                <SelectValue placeholder="Score (High to Low)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Score (High to Low)</SelectItem>
                <SelectItem value="score-asc">Score (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="dom-asc">Days on Market (New First)</SelectItem>
                <SelectItem value="dom-desc">Days on Market (Old First)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
