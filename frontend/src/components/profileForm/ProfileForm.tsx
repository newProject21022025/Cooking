// src/components/profileForm/ProfileForm.tsx

"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./ProfileForm.module.scss";
import { User, UpdateUserProfileData } from "@/types/user";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import { useState, useMemo } from "react";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Ім'я обов'язкове")
    .max(50, "Ім'я занадто довге"),
  lastName: Yup.string()
    .required("Прізвище обов'язкове")
    .max(50, "Прізвище занадто довге"),
  phoneNumber: Yup.string()
    .matches(
      /^\+?380\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/,
      "Невірний формат телефону"
    )
    .nullable(),
  deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
});

const formatPhoneNumber = (input: string): string => {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length === 0) return "+380";

  const digits = cleaned.startsWith("380") ? cleaned.slice(3) : cleaned;
  let formatted = "+380";

  if (digits.length >= 1) formatted += ` (${digits.slice(0, 2)}`;
  if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
  if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
  if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;

  return formatted;
};

interface ProfileFormProps {
  user: User;
  onSubmit: (
    values: UpdateUserProfileData,
    helpers: FormikHelpers<UpdateUserProfileData>
  ) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProfileForm({
  user,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProfileFormProps) {
  const [uploading, setUploading] = useState(false);

  const initialValues: UpdateUserProfileData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "+380",
    deliveryAddress: user.deliveryAddress || "",
    photo: user.photo || "",
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadToCloudinary(file);
      setFieldValue("photo", result.secure_url);
    } catch (err) {
      console.error("Помилка завантаження фото:", err);
      alert("Не вдалося завантажити фото. Спробуйте ще раз.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ dirty, values, setFieldValue }) => (
        <Form className={styles.container}>
          <div className={styles.formGroupImage}>
            {values.photo && (
              <div>
                <img
                  src={values.photo}
                  alt="Avatar preview"
                  className={styles.previewImage}
                />
              </div>
            )}

            {/* Приховуємо стандартний інпут */}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFieldValue)}
              disabled={uploading}
              className={styles.hiddenInput}
            />

            {/* Створюємо власну кнопку */}
            <label htmlFor="photo" className={styles.customFileButton}>
              {uploading ? "Завантаження..." : "Обрати фото"}
            </label>

            <ErrorMessage
              name="photo"
              component="div"
              className={styles.errorText}
            />
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Ім&apos;я</label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className={styles.input}
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className={styles.errorText}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Прізвище</label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className={styles.input}
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className={styles.errorText}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Телефон</label>
              <Field
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={styles.input}
                placeholder="+380 (XX) XXX-XX-XX"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFieldValue("phoneNumber", formatted);
                }}
                value={values.phoneNumber || "+380"}
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className={styles.errorText}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deliveryAddress">Адреса доставки</label>
              <Field
                // as="textarea"
                id="deliveryAddress"
                name="deliveryAddress"
                className={styles.textarea}
                rows={3}
              />
              <ErrorMessage
                name="deliveryAddress"
                component="div"
                className={styles.errorText}
              />
            </div>

            {/* ✅ Фото-профиль с Cloudinary */}

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSubmitting || uploading || !dirty}
              >
                {isSubmitting ? "Збереження..." : "Зберегти"}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Скасувати
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
