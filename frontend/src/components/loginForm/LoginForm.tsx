// src/components/loginForm/LoginForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@/app/[locale]/login/page.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { registerUser } from "@/api/usersApi";

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

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading: authLoading, error: authError } = useAppSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formError, setFormError] = useState("");

  // Чекаємо, поки компонент змонтується, щоб уникнути hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormError("");
  };

  const handleRegister = async (values: any, setSubmitting: (val: boolean) => void) => {
    try {
      await registerUser(values);
      alert("Реєстрація успішна! Тепер можна увійти.");
      setIsRegister(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Сталася помилка при реєстрації");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null; // або можна показати лоадер

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", password: "" }} // завжди один об'єкт
      validationSchema={isRegister ? RegisterSchema : LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (isRegister) {
          handleRegister(values, setSubmitting);
        } else {
          dispatch(login({ email: values.email, password: values.password }));
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          {/* Поля для реєстрації */}
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

          {/* Поля email/password */}
          <div className={styles.formGroup}>
            <Field type="email" name="email" placeholder="Email" className={styles.input} />
            <ErrorMessage name="email" component="div" className={styles.error} />
          </div>
          <div className={styles.formGroup}>
            <Field type="password" name="password" placeholder="Пароль" className={styles.input} />
            <ErrorMessage name="password" component="div" className={styles.error} />
          </div>

          {/* Кнопка сабміту */}
          <button type="submit" className={styles.button} disabled={isSubmitting || authLoading}>
            {isSubmitting || authLoading ? "Завантаження..." : isRegister ? "Зареєструватися" : "Вхід"}
          </button>

          {/* Помилки */}
          {(authError || formError) && <p className={styles.error}>{authError || formError}</p>}

          {/* Перемикач під формою */}
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
