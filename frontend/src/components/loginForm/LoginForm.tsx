// src/components/loginForm/LoginForm.tsx

"use client";

import React, { useState } from "react";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { registerUser, CreateUserData, resetPassword } from "@/api/usersApi";
import { AxiosError } from "axios";
import styles from "./LoginForm.module.scss";

// ➡️ NEXT-INTL IMPORTS
import { useLocale, useTranslations } from "next-intl";

// ====================== ВАЛІДАЦІЯ (З ВИКОРИСТАННЯМ t()) ======================

// Функції для створення схем валідації, що приймають функцію t для перекладів
const createLoginSchema = (t: ReturnType<typeof useTranslations>) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    password: Yup.string()
      .min(5, t("validation.passwordMin"))
      .required(t("validation.passwordRequired")),
  });

const createRegisterSchema = (t: ReturnType<typeof useTranslations>) =>
  Yup.object().shape({
    firstName: Yup.string().required(t("validation.firstNameRequired")),
    lastName: Yup.string().required(t("validation.lastNameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    password: Yup.string()
      .min(5, t("validation.passwordMin"))
      .required(t("validation.passwordRequired")),
  });

const createResetPasswordSchema = (t: ReturnType<typeof useTranslations>) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
  });

// ====================== ТИПИ ФОРМИ ======================
interface FormValues extends CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function LoginForm() {
  // ➡️ Ініціалізація перекладів з простором імен "LoginForm"
  const t = useTranslations("LoginForm");
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { loading: authLoading, error: authError } = useAppSelector(
    (state) => state.auth
  );

  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Створюємо схеми валідації, передаючи функцію t
  const LoginSchema = createLoginSchema(t);
  const RegisterSchema = createRegisterSchema(t);
  const ResetPasswordSchema = createResetPasswordSchema(t);


  // ====================== ПЕРЕМИКАЧІ ======================
  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setIsResetPassword(false);
    setFormError("");
    setResetMessage("");
  };

  const toggleResetPassword = () => {
    setIsResetPassword((prev) => !prev);
    setIsRegister(false);
    setFormError("");
    setResetMessage("");
  };

  // ====================== РЕЄСТРАЦІЯ ======================
  const handleRegister = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    try {
      const { firstName, lastName, email, password } = values;
      await registerUser({ firstName, lastName, email, password });
      // ➡️ Використовуємо t() для alert
      alert(t("register.successAlert"));
      setIsRegister(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        const e = err as { response?: { data?: { message?: string } } };
        setFormError(
          // ➡️ Використовуємо t() для повідомлення про помилку
          e.response?.data?.message || t("register.defaultError")
        );
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // ====================== ВІДНОВЛЕННЯ ПАРОЛЯ ======================
  const handleResetPassword = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    try {
      await resetPassword({ email: values.email });
      // ➡️ Використовуємо t() для повідомлення про успіх
      setResetMessage(t("reset.successMessage"));
      setFormError("");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setFormError(
          (err.response.data.message as string) ||
            // ➡️ Використовуємо t() для повідомлення про помилку
            t("reset.defaultError")
        );
      } else {
        // ➡️ Використовуємо t() для невідомої помилки
        setFormError(t("reset.unknownError"));
      }
      setResetMessage("");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // ====================== РЕНДЕР ======================
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
        console.log("Submit fired", values); // Проверка
        if (isRegister) handleRegister(values, helpers);
        else if (isResetPassword) handleResetPassword(values, helpers);
        else {
          dispatch(login({ email: values.email, password: values.password }));
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <FormikForm className={styles.form}>
          <h2 className={styles.title}>
            {/* ➡️ Переклад заголовка форми */}
            {isRegister
              ? t("titleRegister")
              : isResetPassword
              ? t("titleReset")
              : t("titleLogin")}
          </h2>

          {/* Ім'я та Прізвище */}
          {isRegister && (
            <>
              <div className={styles.formGroup}>
                <Field
                  type="text"
                  name="firstName"
                  // ➡️ Переклад плейсхолдера
                  placeholder={t("placeholderFirstName")}
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
                  // ➡️ Переклад плейсхолдера
                  placeholder={t("placeholderLastName")}
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

          {/* Email */}
          <div className={styles.formGroup}>
            <Field
              type="email"
              name="email"
              // ➡️ Переклад плейсхолдера
              placeholder={t("placeholderEmail")}
              className={styles.input}
            />
            <ErrorMessage name="email" component="div" className={styles.error} />
          </div>

          {/* Пароль (якщо не reset) */}
          {!isResetPassword && (
            <div className={styles.formGroup}>
              <Field
                type="password"
                name="password"
                // ➡️ Переклад плейсхолдера
                placeholder={t("placeholderPassword")}
                className={styles.input}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>
          )}

          {/* Кнопка */}
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting || authLoading}
          >
            {/* ➡️ Переклад тексту кнопки */}
            {isSubmitting || authLoading
              ? t("buttonLoading")
              : isRegister
              ? t("buttonRegister")
              : isResetPassword
              ? t("buttonReset")
              : t("buttonLogin")}
          </button>

          {/* Повідомлення */}
          {(authError || formError) && (
            <p className={styles.error}>{authError || formError}</p>
          )}
          {resetMessage && <p className={styles.success}>{resetMessage}</p>}

          {/* Посилання */}
          <div className={styles.links}>
            {!isResetPassword ? (
              <>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={toggleResetPassword}
                >
                  {/* ➡️ Переклад посилання */}
                  {t("linkForgotPassword")}
                </button>
                <p className={styles.text}>
                  {/* ➡️ Переклад тексту посилання */}
                  {t("textNoAccount")}{" "}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={toggleForm}
                  >
                    {t("linkRegister")}
                  </button>
                </p>
              </>
            ) : (
              <button
                type="button"
                className={styles.linkButton}
                onClick={toggleResetPassword}
              >
                {/* ➡️ Переклад посилання */}
                {t("linkBackToLogin")}
              </button>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}