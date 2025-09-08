// src/components/loginForm/LoginForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "@/app/[locale]/login/page.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { registerUser, CreateUserData } from "@/api/usersApi";

// Валідації
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string().min(5, "Мінімум 5 символів").required("Пароль обов'язковий"),
});

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("Ім'я обов'язкове"),
  lastName: Yup.string().required("Прізвище обов'язкове"),
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string().min(5, "Мінімум 5 символів").required("Пароль обов'язковий"),
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
  const { loading: authLoading, error: authError } = useAppSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormError("");
  };

  const handleRegister = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    try {
      const { firstName, lastName, email, password } = values;
      await registerUser({ firstName, lastName, email, password });
      alert("Реєстрація успішна! Тепер можна увійти.");
      setIsRegister(false);
    } catch (err: unknown) {
      // 🔹 Типізація error без any
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        const e = err as { response?: { data?: { message?: string } } };
        setFormError(e.response?.data?.message || "Сталася помилка при реєстрації");
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
      validationSchema={isRegister ? RegisterSchema : LoginSchema}
      onSubmit={(values, helpers) => {
        if (isRegister) {
          handleRegister(values, helpers);
        } else {
          dispatch(login({ email: values.email, password: values.password }));
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          {isRegister && (
            <>
              <div className={styles.formGroup}>
                <Field type="text" name="firstName" placeholder="Ім'я" className={styles.input} />
                <ErrorMessage name="firstName" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <Field type="text" name="lastName" placeholder="Прізвище" className={styles.input} />
                <ErrorMessage name="lastName" component="div" className={styles.error} />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <Field type="email" name="email" placeholder="Email" className={styles.input} />
            <ErrorMessage name="email" component="div" className={styles.error} />
          </div>
          <div className={styles.formGroup}>
            <Field type="password" name="password" placeholder="Пароль" className={styles.input} />
            <ErrorMessage name="password" component="div" className={styles.error} />
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting || authLoading}>
            {isSubmitting || authLoading ? "Завантаження..." : isRegister ? "Зареєструватися" : "Вхід"}
          </button>

          {(authError || formError) && <p className={styles.error}>{authError || formError}</p>}

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button type="button" className={styles.toggleButton} onClick={toggleForm}>
              {isRegister ? "Увійти" : "Реєстрація"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
