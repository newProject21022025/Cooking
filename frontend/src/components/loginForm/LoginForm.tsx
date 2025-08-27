// src/components/loginForm/LoginForm.tsx

"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@/app/[locale]/login/page.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string().min(5, "Мінімум 5 символів").required("Пароль обов'язковий"),
});

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading: authLoading, error: authError } = useAppSelector((state) => state.auth);

  return (
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

          <button type="submit" className={styles.button} disabled={isSubmitting || authLoading}>
            {authLoading ? "Завантаження..." : "Увійти"}
          </button>

          {authError && <p className={styles.error}>{authError}</p>}
        </Form>
      )}
    </Formik>
  );
}
