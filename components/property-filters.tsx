"use client";

import { usePropertyFilters } from "@/hooks/use-property-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlidersHorizontal, X } from "lucide-react";

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "single_family", label: "Single Family" },
  { value: "multi_family", label: "Multi Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
];

const sortOptions = [
  { value: "score-desc", label: "Highest Score" },
  { value: "score-asc", label: "Lowest Score" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "daysOnMarket-asc", label: "Newest Listings" },
  { value: "daysOnMarket-desc", label: "Oldest Listings" },
];

export function PropertyFilters() {
  const { filters, setFilter, resetFilters, activeTab, setActiveTab } =
    usePropertyFilters();

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    filters.minBeds ||
    filters.propertyType ||
    filters.city;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="hot">Hot Deals</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Active
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilter("minPrice", e.target.value ? +e.target.value : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilter("maxPrice", e.target.value ? +e.target.value : undefined)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minBeds || ""}
                    onChange={(e) =>
                      setFilter("minBeds", e.target.value ? +e.target.value : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBeds || ""}
                    onChange={(e) =>
                      setFilter("maxBeds", e.target.value ? +e.target.value : undefined)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Min Score</Label>
                <Input
                  type="number"
                  placeholder="0-100"
                  value={filters.minScore || ""}
                  onChange={(e) =>
                    setFilter("minScore", e.target.value ? +e.target.value : undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={filters.propertyType || "all"}
                  onValueChange={(v) =>
                    setFilter("propertyType", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="e.g., Tampa"
                  value={filters.city || ""}
                  onChange={(e) =>
                    setFilter("city", e.target.value || undefined)
                  }
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={`${filters.sortField || "score"}-${filters.sortOrder || "desc"}`}
          onValueChange={(v) => {
            const [field, order] = v.split("-") as [string, "asc" | "desc"];
            setFilter("sortField", field as any);
            setFilter("sortOrder", order);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
