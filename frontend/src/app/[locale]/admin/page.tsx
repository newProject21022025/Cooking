// src/app/admin/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
// import { useTranslations } from "next-intl";

export default function AdminPage() {
  // const t = useTranslations("Admin"); 
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Панель Адміністратора</h1>
        <p className={styles.description}>
          {/* {t("description")} */} 
          Тут буде вміст сторінки адміністратора. Доступ лише для авторизованих адміністраторів.
        </p>
      </main>
    </div>
  );
}
