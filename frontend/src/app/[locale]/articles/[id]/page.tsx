// src/app/[locale]/articles/[id]/page.tsx
import React from "react";
import { articlesApi } from "@/api/articleApi";
import styles from "./page.module.scss";

type Locale = "uk" | "en";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ArticlePage(props: PageProps) {
  const { locale, id } = await props.params;

  const currentLocale: Locale = locale === "en" ? "en" : "uk";

  let article = null;
  try {
    article = await articlesApi.getOne(Number(id));
  } catch (e) {
    console.error("Failed to load article:", e);
  }

  if (!article) {
    return <div className={styles.notFound}>Статтю не знайдено</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={article.photo}
          alt={article.title[currentLocale]}
          className={styles.image}
        />
      </div>

      <h1 className={styles.title}>{article.title[currentLocale]}</h1>

      <p className={styles.description}>
        {article.description[currentLocale]}
      </p>

      <div className={styles.blocks}>
        {article.blocks.map((block, idx) => (
          <div key={idx} className={styles.block}>
            <h3 className={styles.blockTitle}>{block.title[currentLocale]}</h3>
            <p className={styles.blockDescription}>
              {block.description[currentLocale]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
