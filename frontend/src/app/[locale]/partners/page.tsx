// src/app/partners/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
// import { useTranslations } from "next-intl"; 

export default function PartnersPage() {
  // const t = useTranslations("Partners"); 
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Особистий кабінет партнера</h1>
        <p className={styles.description}>
          {/* {t("description")} */} 
          Тут буде вміст сторінки партнерів.
        </p>
      </main>
    </div>
  );
}
