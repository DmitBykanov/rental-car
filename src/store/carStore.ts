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

  // Методи
  setFilters: (newFilters: Partial<Filters>) => void;
  toggleFavorite: (id: string) => void;
  loadCars: (isNextPage?: boolean) => Promise<void>;
  resetSearch: () => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      cars: [], // Ініціалізація порожнім масивом, щоб .map працював відразу
      favorites: [],
      filters: { brand: "", price: "", minMileage: "", maxMileage: "" },
      page: 1,
      isLoading: false,
      hasMore: true,

      // Оновлення фільтрів (не викликає запит автоматично)
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Додавання/видалення з обраного (ТЗ пункт 5)
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),

      // Скидання результатів перед новим пошуком (ТЗ пункт 4)
      resetSearch: () =>
        set({
          cars: [],
          page: 1,
          hasMore: true,
        }),

      // Головна функція завантаження з бекенд-фільтрацією
      loadCars: async (isNextPage = false) => {
        const { page, filters, cars: existingCars, isLoading } = get();

        if (isLoading) return;
        set({ isLoading: true });

        const targetPage = isNextPage ? page + 1 : 1;

        try {
          // Виклик API з параметрами
          const data = await fetchCars({
            page: targetPage,
            limit: 12,
            brand: filters.brand || undefined,
            rentalPrice: filters.price || undefined,
            minMileage: filters.minMileage || undefined,
            maxMileage: filters.maxMileage || undefined,
          });

          // ВАЖЛИВО: Бекенд повертає { cars: [...], totalPages: X }
          // Перевіряємо наявність масиву, щоб уникнути помилки .map
          const newCars = Array.isArray(data.cars) ? data.cars : [];

          set({
            cars: isNextPage ? [...existingCars, ...newCars] : newCars,
            page: targetPage,
            // Перевіряємо чи є наступна сторінка згідно з даними бекенду
            hasMore: data.page < data.totalPages,
          });
        } catch (error) {
          console.error("Failed to load cars:", error);
          set({ cars: isNextPage ? existingCars : [] });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "car-storage",
      // Зберігаємо ТІЛЬКИ список ID обраних авто, щоб стан фільтрів та машин не кешувався
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
