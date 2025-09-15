// src/app/[locale]/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./page.module.scss";
import { User, UpdateUserProfileData } from "@/types/user";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/api/usersApi";
import UserHistory from "@/components/userHistory/UserHistory";
import { AxiosError } from "axios";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Ім'я обов'язкове")
    .max(50, "Ім'я занадто довге"),
  lastName: Yup.string()
    .required("Прізвище обов'язкове")
    .max(50, "Прізвище занадто довге"),
  phoneNumber: Yup.string()
    // Оновлена валідація, що враховує відформатований номер
    .matches(
      /^\+?380\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/,
      "Невірний формат телефону"
    )
    .nullable(),
  deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
});

// ✅ Оновлена функція форматування
const formatPhoneNumber = (input: string): string => {
  const cleaned = input.replace(/\D/g, "");

  if (cleaned.length === 0) {
    return "+380";
  }

  // Якщо номер вже починається з 380, працюємо з ним, інакше просто повертаємо
  const digits = cleaned.startsWith("380") ? cleaned.slice(3) : cleaned;
  let formatted = "+380";

  if (digits.length >= 1) formatted += ` (${digits.slice(0, 2)}`;
  if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
  if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
  if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;

  return formatted;
};

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Поточний пароль обов'язковий"),
  newPassword: Yup.string()
    .min(5, "Мінімум 5 символів")
    .required("Новий пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Паролі не співпадають")
    .required("Підтвердіть пароль"),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUserProfile();
      setUser(userData);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { status?: number } };
      console.error("Помилка завантаження профілю:", e);
      setError(e.message || "Помилка завантаження профілю");
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: UpdateUserProfileData,
    { setSubmitting, setErrors }: FormikHelpers<UpdateUserProfileData>
  ) => {
    try {
      setError(null);
      setUpdateSuccess(false);
      if (!user) throw new Error("Дані користувача відсутні");

      const updatedUser = await updateCurrentUserProfile(values);
      setUser(updatedUser);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as {
        message?: string;
        response?: { data?: { errors?: Record<string, string[]> } };
      };
      console.error("Помилка оновлення профілю:", e);
      if (e.response?.data?.errors) {
        const backendErrors: Record<string, string[]> = e.response.data.errors;
        const formikErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach((key) => {
          formikErrors[key] = backendErrors[key].join(", ");
        });
        setErrors(formikErrors);
      } else {
        setError(e.message || "Помилка оновлення профілю");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження профілю...</div>;
  }

  if (error && !user) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>Дані користувача відсутні</div>;
  }

  // ✅ Оновлення: якщо номер телефону порожній, встановлюємо +380
  const initialValues: UpdateUserProfileData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "+380",
    deliveryAddress: user.deliveryAddress || "",
    photo: user.photo || "",
  };

  const handlePasswordChange = async (
    values: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    helpers: FormikHelpers<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  ) => {
    try {
      setPasswordError(null);
      if (!user) throw new Error("Дані користувача відсутні");

      // Виклик API для зміни пароля
      await updateCurrentUserProfile({ password: values.newPassword }); // якщо хочеш через окремий метод updatePassword
      setPasswordSuccess(true);
      helpers.resetForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      // Перевірка, чи є об'єкт помилки AxiosError
      if (err instanceof AxiosError && err.response) {
        setPasswordError(
          err.response.data.message || "Сталася помилка при зміні пароля"
        );
      } else {
        // Обробка інших типів помилок
        setPasswordError("Сталася невідома помилка");
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профіль користувача</h1>

      {updateSuccess && (
        <div className={styles.success}>Профіль успішно оновлено!</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          {user.photo ? (
            <img
              src={user.photo}
              alt="Аватар користувача"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.placeholderAvatar}>Немає фото</div>
          )}
        </div>

        {!isEditing ? (
          <>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Ім&apos;я:</strong> {user.firstName}
            </p>
            <p>
              <strong>Прізвище:</strong> {user.lastName}
            </p>
            {user.phoneNumber && (
              <p>
                <strong>Телефон:</strong> {user.phoneNumber}
              </p>
            )}
            {user.deliveryAddress && (
              <p>
                <strong>Адреса доставки:</strong> {user.deliveryAddress}
              </p>
            )}
            <p>
              <strong>Роль:</strong> {user.role}
            </p>
            {user.averageRating !== null && (
              <p>
                <strong>Середній рейтинг:</strong> {user.averageRating}
              </p>
            )}

            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Редагувати профіль
            </button>
          </>
        ) : (
          <>
            {/* Форма редагування профілю */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, dirty, values, setFieldValue }) => (
                <Form className={styles.form}>
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
                      as="textarea"
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

                  <div className={styles.formGroup}>
                    <label htmlFor="photo">Посилання на фото</label>
                    <Field
                      type="text"
                      id="photo"
                      name="photo"
                      className={styles.input}
                      placeholder="Вставте URL фото"
                    />
                    <ErrorMessage
                      name="photo"
                      component="div"
                      className={styles.errorText}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      type="submit"
                      className={styles.saveButton}
                      disabled={isSubmitting || !dirty}
                    >
                      {isSubmitting ? "Збереження..." : "Зберегти"}
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                    >
                      Скасувати
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Форма зміни пароля */}
            <div className={styles.passwordCard}>
              <h2>Змінити пароль</h2>
              {passwordSuccess && (
                <div className={styles.success}>Пароль успішно змінено!</div>
              )}
              {passwordError && (
                <div className={styles.error}>{passwordError}</div>
              )}

              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword">Поточний пароль</label>
                      <Field
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className={styles.errorText}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword">Новий пароль</label>
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className={styles.errorText}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">
                        Підтвердіть пароль
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className={styles.errorText}
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.saveButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Збереження..." : "Змінити пароль"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
      </div>

      {/* Історія користувача */}
      <UserHistory userId={user.id} />
    </div>
  );
}
