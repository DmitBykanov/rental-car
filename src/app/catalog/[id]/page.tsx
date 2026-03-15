"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchCarById } from "../../../services/api";
import { Car } from "../../../types/car";
import { formatMileage } from "../../../utils/formatMileage";
import BookingForm from "../../../components/BookingForm/BookingForm";
import css from "./page.module.css";

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    if (id)
      fetchCarById(id as string)
        .then(setCar)
        .catch(console.error);
  }, [id]);

  if (!car) return <div className={css.loader}>Loading...</div>;

  return (
    <div className={css.container}>
      <div className={css.leftColumn}>
        <div className={css.imageWrapper}>
          <Image
            src={car.img}
            alt={car.brand}
            fill
            className={css.mainImg}
            priority
          />
        </div>
        <div className={css.formWrapper}>
          <BookingForm />
        </div>
      </div>

      <div className={css.rightColumn}>
        <div className={css.headerInfo}>
          <h1 className={css.title}>
            {car.brand} {car.model}, {car.year}
            <span className={css.idText}>Id: {car.id.slice(0, 4)}</span>
          </h1>
          <div className={css.metaInfo}>
            <span className={css.metaItem}>
              <svg width="16" height="16" className={css.iconGray}>
                <use href="/Icons.svg#Location" />
              </svg>
              {car.address.split(",").slice(-2).join(", ")}
            </span>
            <span className={css.metaItem}>
              Mileage: {formatMileage(car.mileage)} km
            </span>
          </div>
          <div className={css.price}>${car.rentalPrice}</div>
        </div>

        <p className={css.description}>{car.description}</p>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>Rental Conditions:</h3>
          <ul className={css.conditionsList}>
            {car.rentalConditions.map((cond, i) => (
              <li key={i} className={css.checkItem}>
                <svg width="16" height="16" className={css.iconBlue}>
                  <use href="/Icons.svg#check-circle" />
                </svg>
                {cond}
              </li>
            ))}
          </ul>
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>Car Specifications:</h3>
          <ul className={css.specsList}>
            <li className={css.specItem}>
              <svg width="16" height="16" className={css.iconGray}>
                <use href="/Icons.svg#calendar" />
              </svg>
              Year: {car.year}
            </li>
            <li className={css.specItem}>
              <svg width="16" height="16" className={css.iconGray}>
                <use href="/Icons.svg#car" />
              </svg>
              Type: {car.type}
            </li>
            <li className={css.specItem}>
              <svg width="16" height="16" className={css.iconGray}>
                <use href="/Icons.svg#fuel-pump" />
              </svg>
              Fuel Consumption: {car.fuelConsumption}
            </li>
            <li className={css.specItem}>
              <svg width="16" height="16" className={css.iconGray}>
                <use href="/Icons.svg#gear" />
              </svg>
              Engine Size: {car.engineSize}
            </li>
          </ul>
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>Accessories and functionalities:</h3>
          <ul className={css.accessList}>
            {[...car.accessories, ...car.functionalities].map((item, i) => (
              <li key={i} className={css.checkItem}>
                <svg width="16" height="16" className={css.iconBlue}>
                  <use href="/Icons.svg#check-circle" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
