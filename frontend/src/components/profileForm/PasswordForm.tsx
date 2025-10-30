// src/components/PasswordForm/PasswordForm.tsx
"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./ProfileForm.module.scss";

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Поточний пароль обов'язковий"),
  newPassword: Yup.string()
    .min(5, "Мінімум 5 символів")
    .required("Новий пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Паролі не співпадають")
    .required("Підтвердіть пароль"),
});

interface PasswordFormProps {
  onSubmit: (
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
  ) => void;
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
}

export default function PasswordForm({
  onSubmit,
  isSubmitting,
  success,
  error
}: PasswordFormProps) {
  return (
    <div className={styles.passwordCard}>
      <h2>Змінити пароль</h2>
      {success && (
        <div className={styles.success}>Пароль успішно змінено!</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={onSubmit}
      >
        {() => (
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
              <label htmlFor="confirmPassword">Підтвердіть пароль</label>
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
              className={styles.savePasswordButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Змінити пароль"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}