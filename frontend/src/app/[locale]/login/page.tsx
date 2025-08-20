// src/app/[locale]/login/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./page.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";

// Схема валідації
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string().min(6, "Мінімум 6 символів").required("Пароль обов'язковий"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, user, loading, error } = useAppSelector((state) => state.auth);

  // Редірект після успішного логіну
  useEffect(() => {
    if (!token || !user) return;

    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "partner":
        router.push("/partners");
        break;
      default:
        router.push("/profile");
        break;
    }
  }, [token, user, router]);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Увійти</h1>
        <p className={styles.description}>Будь ласка, введіть дані для входу.</p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => dispatch(login(values))}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <Field type="email" name="email" placeholder="Email" className={styles.input} />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <Field type="password" name="password" placeholder="Пароль" className={styles.input} />
                <ErrorMessage name="password" component="div" className={styles.error} />
              </div>

              <button type="submit" className={styles.button} disabled={isSubmitting || loading}>
                {loading ? "Завантаження..." : "Увійти"}
              </button>

              {error && <p className={styles.error}>{error}</p>}
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
}
