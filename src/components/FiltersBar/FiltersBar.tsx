"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useCarStore } from "../../store/carStore";
import { fetchBrands } from "../../services/api";
import { formatMileage } from "../../utils/formatMileage";
import css from "./FiltersBar.module.css";

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
      if (brandRef.current && !brandRef.current.contains(target)) setIsBrandOpen(false);
      if (priceRef.current && !priceRef.current.contains(target)) setIsPriceOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priceOptions = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  return (
    <Formik
      initialValues={filters}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => {
        setFilters(values);
        resetSearch();
        loadCars();
      }}
    >
      {({ values, setFieldValue, resetForm, errors, touched }) => {
        const handleReset = () => {
          const empty = { brand: "", price: "", minMileage: "", maxMileage: "" };
          setFilters(empty);
          resetSearch();
          resetForm({ values: empty });
          loadCars();
        };

        return (
          <Form className={css.form}>
            <div className={css.field} ref={brandRef}>
              <p className={css.label}>Car brand</p>
              <div
                className={`${css.customSelect} ${css.brandWidth} ${isBrandOpen ? css.focus : ""}`}
                onClick={() => {
                  setIsBrandOpen(!isBrandOpen);
                  setIsPriceOpen(false);
                }}
              >
                <span className={values.brand ? css.selectedText : css.placeholder}>
                  {values.brand || "Choose a brand"}
                </span>
                <svg className={css.icon} width="16" height="16">
                  <use href={`/Icons.svg#${isBrandOpen ? "chevron-Active" : "chevron -Default"}`} />
                </svg>

                {isBrandOpen && (
                  <ul className={css.optionsList}>
                    {brands.map((b) => (
                      <li key={b} className={css.option} onClick={() => setFieldValue("brand", b)}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={css.field} ref={priceRef}>
              <p className={css.label}>Price / 1 hour</p>
              <div
                className={`${css.customSelect} ${css.priceWidth} ${isPriceOpen ? css.focus : ""}`}
                onClick={() => {
                  setIsPriceOpen(!isPriceOpen);
                  setIsBrandOpen(false);
                }}
              >
                <span className={values.price ? css.selectedText : css.placeholder}>
                  {values.price ? `To ${values.price}$` : "Choose a price"}
                </span>
                <svg className={css.icon} width="16" height="16">
                  <use href={`/Icons.svg#${isPriceOpen ? "chevron-Active" : "chevron -Default"}`} />
                </svg>

                {isPriceOpen && (
                  <ul className={css.optionsList}>
                    {priceOptions.map((p) => (
                      <li key={p} className={css.option} onClick={() => setFieldValue("price", p.toString())}>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={css.field}>
              <p className={css.label}>Car mileage / km</p>
              <div className={`${css.mileageGroup} ${errors.maxMileage && touched.maxMileage ? css.errorBorder : ""}`}>
                <div className={css.inputBox}>
                  <span className={css.prefix}>From</span>
                  <Field
                    name="minMileage"
                    className={css.input}
                    value={values.minMileage ? formatMileage(Number(values.minMileage)) : ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFieldValue("minMileage", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <div className={css.inputBox}>
                  <span className={css.prefix}>To</span>
                  <Field
                    name="maxMileage"
                    className={css.input}
                    value={values.maxMileage ? formatMileage(Number(values.maxMileage)) : ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      setFieldValue("maxMileage", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>
              {errors.maxMileage && touched.maxMileage && <span className={css.errorText}>{errors.maxMileage}</span>}
            </div>

            <div className={css.btnGroup}>
  <button type="submit" className={css.searchBtn}>
    Search
  </button>
  <button 
    type="button" 
    onClick={handleReset} 
    className={css.searchBtn}
  >
    Reset
  </button>
</div>
          </Form>
        );
      }}
    </Formik>
  );
}