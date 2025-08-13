
"use client";

import React from "react";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";



export default function Home() {
  const t = useTranslations("Home");
  return (
    <div className={styles.page}>
      <main className={styles.main}> 
      <h1 className={styles.title}>{t("title")}</h1> 
      <p className={styles.description}> {t("text")}       
      </p>      
      </main>     
    </div>
  );
}
