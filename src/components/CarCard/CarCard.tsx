"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types/car";
import { useCarStore } from "../../store/carStore";
import { formatMileage } from "@/utils/formatMileage";
import css from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const { favorites, toggleFavorite } = useCarStore();
  const isFavorite = favorites.includes(car.id);
  const addressParts = car.address.split(", ");
  const city = addressParts[addressParts.length - 2];
  const country = addressParts[addressParts.length - 1];

  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="274px"
          className={css.img}
        />
        {/* Кнопка Favorite (серце) */}
        <button
          className={`${css.favoriteBtn} ${isFavorite ? css.active : ""}`}
          onClick={() => toggleFavorite(car.id)}
          aria-label="favorite"
        >
          <svg width="16" height="16">
            {isFavorite ? (
              <use href="/Icons.svg#heart-Active"></use>
            ) : (
              <use href="/Icons.svg#heart-Default"></use>
            )}
          </svg>
        </button>
      </div>

      <div className={css.content}>
        <div className={css.header}>
          <h2 className={css.title}>
            {car.brand} <span className={css.modelAccent}>{car.model}</span>,{" "}
            {car.year}
          </h2>
          <span className={css.price}>${car.rentalPrice}</span>
        </div>

        <div className={css.tagsList}>
          <span>{city}</span>
          <span>{country}</span>
          <span>{car.rentalCompany}</span>
          <span>{car.type}</span>
          <span>{car.model}</span>
          <span>{formatMileage(car.mileage)} km</span>
        </div>
      </div>

      <Link href={`/catalog/${car.id}`} className={css.readMoreBtn}>
        Read more
      </Link>
    </div>
  );
}
