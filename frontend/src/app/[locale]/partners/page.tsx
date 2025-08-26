// src/app/partners/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./page.module.scss";
import { Partner } from "@/types/partner";
import { api } from "@/api/partnersApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Валідація
const validationSchema = Yup.object({
  firstName: Yup.string().required("Ім'я обов'язкове").max(50),
  lastName: Yup.string().required("Прізвище обов'язкове").max(50),
  email: Yup.string().email("Невірний email").required("Email обов'язковий"),
  photo: Yup.string().url("Невірний URL фото").nullable(),
  phoneNumber: Yup.string().nullable(),
  deliveryAddress: Yup.string().nullable(),
  password: Yup.string()
    .nullable()
    .min(6, "Пароль має містити мінімум 6 символів"),
});

export default function PartnerAdminPage() {
  const user = useSelector((state: RootState) => state.user);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadPartner = async () => {
      if (!user?.id) {
        setError("Користувач не знайдений");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // якщо є API getPartnerById
        const res = await api.getPartnerById(user.id);
        setPartner(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Помилка завантаження партнера");
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, [user?.id]);

  const handleSubmit = async (
    values: Partial<Partner>,
    { setSubmitting }: any
  ) => {
    try {
      if (!partner) return;
      setError(null);

      const updated = await api.updatePartner(partner.id, values);
      setPartner(updated.data);
      setIsEditing(false);
      setUpdateSuccess(true);

      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Помилка оновлення партнера");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Завантаження...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!partner)
    return <div className={styles.container}>Партнер не знайдений</div>;

  const initialValues: Partial<Partner> = {
    firstName: partner.firstName || "",
    lastName: partner.lastName || "",
    email: partner.email || "",
    photo: partner.photo || "",
    phoneNumber: partner.phoneNumber || "",
    deliveryAddress: partner.deliveryAddress || "",
    password: "", // порожній для редагування
  };

  return (
    <div className={styles.container}>
      <h3>Редагування партнера</h3>

      {updateSuccess && (
        <div className={styles.success}>Партнер успішно оновлено!</div>
      )}

      {!isEditing ? (
        <div className={styles.card}>
          <div className={styles.avatarContainer}>
            {partner.photo ? (
              <img
                src={partner.photo}
                alt="Фото партнера"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.placeholderAvatar}>Немає фото</div>
            )}
          </div>
          <p>
            <strong>ID:</strong> {partner.id}
          </p>
          <p>
            <strong>Ім'я:</strong> {partner.firstName}
          </p>
          <p>
            <strong>Прізвище:</strong> {partner.lastName}
          </p>
          <p>
            <strong>Email:</strong> {partner.email}
          </p>
          {partner.phoneNumber && (
            <p>
              <strong>Телефон:</strong> {partner.phoneNumber}
            </p>
          )}
          {partner.deliveryAddress && (
            <p>
              <strong>Адреса:</strong> {partner.deliveryAddress}
            </p>
          )}
          <p>
            <strong>Роль:</strong> {partner.role}
          </p>
          {partner.rating !== undefined && (
            <p>
              <strong>Рейтинг:</strong> {partner.rating}
            </p>
          )}
          <button onClick={() => setIsEditing(true)}>
            Редагувати партнера
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Ім'я</label>
                <Field
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
                <Field id="lastName" name="lastName" className={styles.input} />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <Field
                  id="email"
                  name="email"
                  className={styles.input}
                  type="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="photo">Фото (URL)</label>
                <Field id="photo" name="photo" className={styles.input} />
                <ErrorMessage
                  name="photo"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Телефон</label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  className={styles.input}
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
                  as="textarea"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  className={styles.textarea}
                />
                <ErrorMessage
                  name="deliveryAddress"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  Пароль (залиште порожнім, якщо не змінювати)
                </label>
                <Field
                  id="password"
                  name="password"
                  className={styles.input}
                  type="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button type="submit" disabled={isSubmitting || !dirty}>
                  {isSubmitting ? "Збереження..." : "Зберегти"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Скасувати
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
