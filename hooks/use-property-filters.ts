import { create } from "zustand";

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minScore?: number;
  propertyType?: string;
  city?: string;
  sortField?: "score" | "price" | "daysOnMarket" | "createdAt";
  sortOrder?: "asc" | "desc";
}

interface PropertyFiltersStore {
  filters: PropertyFilters;
  activeTab: string;
  setFilter: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  setActiveTab: (tab: string) => void;
  resetFilters: () => void;
}

const defaultFilters: PropertyFilters = {
  sortField: "score",
  sortOrder: "desc",
};

export const usePropertyFilters = create<PropertyFiltersStore>((set) => ({
  filters: defaultFilters,
  activeTab: "all",
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
