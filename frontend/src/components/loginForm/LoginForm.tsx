// src/components/loginForm/LoginForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { registerUser, CreateUserData, resetPassword } from "@/api/usersApi";
import { AxiosError } from "axios";
import styles from "./LoginForm.module.scss";

// Валідації
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string()
    .min(5, "Мінімум 5 символів")
    .required("Пароль обов'язковий"),
});

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("Ім'я обов'язкове"),
  lastName: Yup.string().required("Прізвище обов'язкове"),
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string()
    .min(5, "Мінімум 5 символів")
    .required("Пароль обов'язковий"),
});

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
});

// Типи для форми
interface FormValues extends CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading: authLoading, error: authError } = useAppSelector(
    (state) => state.auth
  );

  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setIsResetPassword(false);
    setFormError("");
    setResetMessage("");
  };

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword);
    setIsRegister(false);
    setFormError("");
    setResetMessage("");
  };

  const handleRegister = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    try {
      const { firstName, lastName, email, password } = values;
      await registerUser({ firstName, lastName, email, password });
      alert("Реєстрація успішна! Тепер можна увійти.");
      setIsRegister(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        const e = err as { response?: { data?: { message?: string } } };
        setFormError(
          e.response?.data?.message || "Сталася помилка при реєстрації"
        );
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const handleResetPassword = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    try {
      await resetPassword({ email: values.email });
      setResetMessage("Інструкція для відновлення пароля надіслана на email");
      setFormError("");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setFormError(
          (err.response.data.message as string) ||
            "Сталася помилка при відновленні пароля"
        );
      } else {
        setFormError("Сталася невідома помилка");
      }
      setResetMessage("");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
      validationSchema={
        isRegister
          ? RegisterSchema
          : isResetPassword
          ? ResetPasswordSchema
          : LoginSchema
      }
      onSubmit={(values, helpers) => {
        if (isRegister) handleRegister(values, helpers);
        else if (isResetPassword) handleResetPassword(values, helpers);
        else {
          dispatch(login({ email: values.email, password: values.password }));
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>
            {isRegister
              ? "Реєстрація"
              : isResetPassword
              ? "Відновлення пароля"
              : "Вхід"}
          </h2>

          {isRegister && (
            <>
              <div className={styles.formGroup}>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  className={styles.input}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.formGroup}>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  className={styles.input}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className={styles.error}
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <Field
              type="email"
              name="email"
              placeholder="Ел. пошта"
              className={styles.input}
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />
          </div>

          {!isResetPassword && (
            <div className={styles.formGroup}>
              <Field
                type="password"
                name="password"
                placeholder="Пароль"
                className={styles.input}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting || authLoading
              ? "Завантаження..."
              : isRegister
              ? "Зареєструватися"
              : isResetPassword
              ? "Відновити пароль"
              : "Увійти"}
          </button>

          {(authError || formError) && (
            <p className={styles.error}>{authError || formError}</p>
          )}

          {resetMessage && (
            <p className={styles.success}>{resetMessage}</p>
          )}

          <div className={styles.links}>
            {!isResetPassword ? (
              <>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={toggleResetPassword}
                >
                  Забули пароль?
                </button>
                <p className={styles.text}>
                  Немає облікового запису?{" "}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={toggleForm}
                  >
                    Зареєструватися
                  </button>
                </p>
              </>
            ) : (
              <button
                type="button"
                className={styles.linkButton}
                onClick={toggleResetPassword}
              >
                Повернутись до входу
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
