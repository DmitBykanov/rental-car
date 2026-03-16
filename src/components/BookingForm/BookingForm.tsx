"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from "./BookingForm.module.css";

interface BookingFormValues {
  name: string;
  email: string;
  bookingDate: [Date | null, Date | null];
  comment: string;
}

const bookingSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name is too short!").required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  bookingDate: Yup.mixed().nullable(),
  comment: Yup.string(),
});

export default function BookingForm() {
  const initialValues: BookingFormValues = {
    name: "",
    email: "",
    bookingDate: [null, null],
    comment: "",
  };

  const handleSubmit = (
    values: BookingFormValues,
    { resetForm }: FormikHelpers<BookingFormValues>,
  ) => {
    toast.success("Car booked successfully!");
    resetForm();
  };

  return (
    <div className={css.bookingCard}>
      <h3 className={css.FormTitle}>Book your car now</h3>
      <p className={css.text}>
        Stay connected! We are always ready to help you.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={bookingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={css.form} autoComplete="off">
            <div className={css.fieldWrapper}>
              <Field
                name="name"
                placeholder="Name*"
                className={`${css.input} ${errors.name && touched.name ? css.errorInput : ""}`}
              />
              <ErrorMessage
                name="name"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.fieldWrapper}>
              <Field
                name="email"
                type="email"
                placeholder="Email*"
                className={`${css.input} ${errors.email && touched.email ? css.errorInput : ""}`}
              />
              <ErrorMessage
                name="email"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.fieldWrapper}>
              <DatePicker
                selectsRange={true}
                startDate={values.bookingDate[0]}
                endDate={values.bookingDate[1]}
                onChange={(dates: [Date | null, Date | null]) =>
                  setFieldValue("bookingDate", dates)
                }
                placeholderText="Booking date"
                dateFormat="dd.MM.yyyy"
                minDate={new Date()}
                className={`${css.input} ${errors.bookingDate && touched.bookingDate ? css.errorInput : ""}`}
                calendarClassName={css.customCalendar}
                popperClassName={css.customPopper}
                popperPlacement="bottom-start"
              />
              <ErrorMessage
                name="bookingDate"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.fieldWrapper}>
              <Field
                as="textarea"
                name="comment"
                placeholder="Comment"
                className={css.textarea}
              />
            </div>

            <button type="submit" className={css.submitBtn}>
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
