// src/app/[locale]/login/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
// import { useTranslations } from "next-intl"; // Раскомментируйте, если используете переводы

export default function LoginPage() {
  // const t = useTranslations("Login"); // Раскомментируйте, если используете переводы
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Войти</h1>
        <p className={styles.description}>
          {/* {t("description")} */} {/* Раскомментируйте, если используете переводы */}
          Пожалуйста, введите ваши данные для входа.
        </p>
        {/* Здесь будет ваша форма входа */}
        <form className={styles.form}>
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="password" placeholder="Пароль" className={styles.input} />
          <button type="submit" className={styles.button}>Войти</button>
        </form>
      </main>
    </div>
  );
}
