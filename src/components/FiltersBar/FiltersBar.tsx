"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useCarStore } from "../../store/carStore";
import { fetchBrands } from "../../services/api";
import { formatMileage } from "../../utils/formatMileage";
import css from "./FiltersBar.module.css";

interface FormValues {
  brand: string;
  price: string;
  minMileage: string;
  maxMileage: string;
}

const validationSchema = Yup.object().shape({
  minMileage: Yup.number().typeError("Numbers only").min(0),
  maxMileage: Yup.number()
    .typeError("Numbers only")
    .moreThan(Yup.ref("minMileage"), "Must be > From"),
});

export default function FiltersBar() {
  const [brands, setBrands] = useState<string[]>([]);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  const { filters, setFilters, loadCars, resetSearch } = useCarStore();

  useEffect(() => {
    fetchBrands().then(setBrands).catch(console.error);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (brandRef.current && !brandRef.current.contains(target))
        setIsBrandOpen(false);
      if (priceRef.current && !priceRef.current.contains(target))
        setIsPriceOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priceOptions = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  const initialValues: FormValues = {
    brand: filters.brand || "",
    price: filters.price || "",
    minMileage: filters.minMileage || "",
    maxMileage: filters.maxMileage || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        setFilters(values);
        resetSearch();
        loadCars();
        setFilters({
          brand: "",
          price: "",
          minMileage: "",
          maxMileage: "",
        });

        resetForm();
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className={css.form}>
          {/* Car brand */}
          <div className={css.field} ref={brandRef}>
            <p className={css.label}>Car brand</p>
            <div
              className={`${css.customSelect} ${css.brandWidth}`}
              onClick={() => {
                setIsBrandOpen(!isBrandOpen);
                setIsPriceOpen(false);
              }}
            >
              <span
                className={values.brand ? css.selectedText : css.placeholder}
              >
                {values.brand || "Choose a brand"}
              </span>
              <svg className={css.icon} width="16" height="16">
                <use
                  href={
                    isBrandOpen
                      ? "/Icons.svg#chevron-Active"
                      : "/Icons.svg#chevron -Default"
                  }
                />
              </svg>

              {isBrandOpen && (
                <ul className={css.optionsList}>
                  {brands.map((brand) => (
                    <li
                      key={brand}
                      className={css.option}
                      onClick={() => {
                        setFieldValue("brand", brand);
                        setIsBrandOpen(false);
                      }}
                    >
                      {brand}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={css.field} ref={priceRef}>
            <p className={css.label}>Price/ 1 hour</p>
            <div
              className={`${css.customSelect} ${css.priceWidth}`}
              onClick={() => {
                setIsPriceOpen(!isPriceOpen);
                setIsBrandOpen(false);
              }}
            >
              <span
                className={values.price ? css.selectedText : css.placeholder}
              >
                {values.price ? `To ${values.price}$` : "Choose a price"}
              </span>
              <svg className={css.icon} width="16" height="16">
                <use
                  href={
                    isPriceOpen
                      ? "/Icons.svg#chevron-Active"
                      : "/Icons.svg#chevron -Default"
                  }
                />
              </svg>

              {isPriceOpen && (
                <ul className={css.optionsList}>
                  {priceOptions.map((p) => (
                    <li
                      key={p}
                      className={css.option}
                      onClick={() => {
                        setFieldValue("price", p.toString());
                        setIsPriceOpen(false);
                      }}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={css.field}>
            <p className={css.label}>Car mileage / km</p>
            <div
              className={`${css.mileageGroup} ${errors.maxMileage && touched.maxMileage ? css.errorBorder : ""}`}
            >
              <div className={css.inputBox}>
                <span className={css.prefix}>From</span>
                <Field
                  name="minMileage"
                  className={css.input}
                  value={
                    values.minMileage
                      ? formatMileage(Number(values.minMileage))
                      : ""
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      "minMileage",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                />
              </div>
              <div className={css.inputBox}>
                <span className={css.prefix}>To</span>
                <Field
                  name="maxMileage"
                  className={css.input}
                  value={
                    values.maxMileage
                      ? formatMileage(Number(values.maxMileage))
                      : ""
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      "maxMileage",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                />
              </div>
            </div>
            {errors.maxMileage && touched.maxMileage && (
              <span className={css.errorText}>{errors.maxMileage}</span>
            )}
          </div>

          <button type="submit" className={css.searchBtn}>
            Search
          </button>
        </Form>
      )}
    </Formik>
  );
}
