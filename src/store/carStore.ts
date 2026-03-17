import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchCars } from "../services/api";
import { Car } from "../types/car";

interface Filters {
  brand: string;
  price: string;
  minMileage: string;
  maxMileage: string;
}

interface CarState {
  cars: Car[];
  favorites: string[];
  filters: Filters;
  page: number;
  isLoading: boolean;
  hasMore: boolean;

  setFilters: (newFilters: Partial<Filters>) => void;
  toggleFavorite: (id: string) => void;
  loadCars: (isNextPage?: boolean) => Promise<void>;
  resetSearch: () => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      cars: [],
      favorites: [],
      filters: { brand: "", price: "", minMileage: "", maxMileage: "" },
      page: 1,
      isLoading: false,
      hasMore: true,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),

      resetSearch: () =>
        set({
          cars: [],
          page: 1,
          hasMore: true,
        }),

      loadCars: async (isNextPage = false) => {
        const { page, filters, isLoading } = get();

        if (isLoading) return;
        set({ isLoading: true });

        const targetPage = isNextPage ? page + 1 : 1;

        try {
          const data = await fetchCars({
            page: targetPage,
            limit: 12,
            brand: filters.brand || undefined,
            rentalPrice: filters.price || undefined,
            minMileage: filters.minMileage || undefined,
            maxMileage: filters.maxMileage || undefined,
          });

          const newCars = Array.isArray(data.cars) ? data.cars : [];

          set((state) => ({
            cars: isNextPage ? [...state.cars, ...newCars] : newCars,
            page: data.page,
            hasMore: data.page < data.totalPages,
          }));
        } catch (error) {
          console.error("Failed to load cars:", error);
          if (!isNextPage) set({ cars: [] });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "car-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
