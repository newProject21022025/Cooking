// src/app/partners/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
// import { useTranslations } from "next-intl"; // Раскомментируйте, если используете переводы

export default function PartnersPage() {
  // const t = useTranslations("Partners"); // Раскомментируйте, если используете переводы
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Личный кабинет партнёра</h1>
        <p className={styles.description}>
          {/* {t("description")} */} {/* Раскомментируйте, если используете переводы */}
          Здесь будет содержимое страницы для партнёров.
        </p>
      </main>
    </div>
  );
}
