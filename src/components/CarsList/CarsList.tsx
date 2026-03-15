"use client";

import { useCarStore } from "../../store/carStore";
import CarCard from "@/components/CarCard/CarCard";
import css from "./CarsList.module.css";

export default function CarsList() {
  const { cars, isLoading, hasMore, loadCars } = useCarStore();

  return (
    <section className={css.container}>
      <ul className={css.list}>
        {cars.map((car) => (
          <li key={car.id}>
            <CarCard car={car} />
          </li>
        ))}
      </ul>

      {isLoading && <p className={css.status}>Loading cars...</p>}

      {hasMore && !isLoading && cars.length > 0 && (
        <button className={css.loadMore} onClick={() => loadCars(true)}>
          Load more
        </button>
      )}

      {!isLoading && cars.length === 0 && (
        <p className={css.status}>No cars found by your criteria.</p>
      )}
    </section>
  );
}
