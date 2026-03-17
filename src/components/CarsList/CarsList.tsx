"use client";

import { useEffect, useRef } from "react";
import { useCarStore } from "../../store/carStore";
import CarCard from "@/components/CarCard/CarCard";
import css from "./CarsList.module.css";

export default function CarsList() {
  const { cars, isLoading, hasMore, loadCars } = useCarStore();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (useCarStore.getState().cars.length === 0) loadCars();
  }, [loadCars]);

  const slowScroll = (distance: number, duration: number) => {
    const start = window.pageYOffset;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, start + distance * ease);
      if (elapsed < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const handleLoadMore = async () => {
    const currentCount = cars.length;
    await loadCars(true);
    setTimeout(() => {
      if (useCarStore.getState().cars.length > currentCount && listRef.current?.firstElementChild) {
        const height = listRef.current.firstElementChild.getBoundingClientRect().height;
        slowScroll(height * 2, 1500);
      }
    }, 150);
  };

  return (
    <section className={css.container}>
      <ul className={css.list} ref={listRef}>
        {cars.map((car, index) => <li key={`${car.id}-${index}`}><CarCard car={car} /></li>)}
      </ul>
      {isLoading && <p className={css.status}>Loading...</p>}
      {!isLoading && hasMore && cars.length > 0 && (
        <button className={css.loadMore} onClick={handleLoadMore}>Load more</button>
      )}
      {!isLoading && cars.length === 0 && <p className={css.status}>No results found.</p>}
    </section>
  );
}