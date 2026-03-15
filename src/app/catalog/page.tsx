"use client";

import { useEffect } from "react";
import { useCarStore } from "../../store/carStore";
import FiltersBar from "../../components/FiltersBar/FiltersBar";
import CarsList from "../../components/CarsList/CarsList";

export default function CatalogPage() {
  const { loadCars, resetSearch } = useCarStore();

  useEffect(() => {
    resetSearch();
    loadCars();
  }, [loadCars, resetSearch]);

  return (
    <div>
      <FiltersBar />
      <CarsList />
    </div>
  );
}
