// src/app/admin/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
// import { useTranslations } from "next-intl"; // Раскомментируйте, если используете переводы

export default function AdminPage() {
  // const t = useTranslations("Admin"); // Раскомментируйте, если используете переводы
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Панель Администратора</h1>
        <p className={styles.description}>
          {/* {t("description")} */} {/* Раскомментируйте, если используете переводы */}
          Здесь будет содержимое страницы администратора. Доступ только для авторизованных администраторов.
        </p>
      </main>
    </div>
  );
}
