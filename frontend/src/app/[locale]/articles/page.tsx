// src/app/[locale]/articles/page.tsx
import React from "react";
import Link from "next/link";
import { articlesApi, Article } from "@/api/articleApi"; 
import styles from "./page.module.scss";

type Locale = "uk" | "en";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Articles(props: PageProps) {
  const params = await props.params;
  const { locale } = params;

  // используем локаль из routing
  const currentLocale: Locale = locale === "en" ? "en" : "uk";

  let articles: Article[] = [];
  try {
    articles = await articlesApi.getAll();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Корисні статті</h1>
        <p className={styles.subtitle}>Читайте про найцікавіше зі світу кулінарії</p>
      </header>

      <div className={styles.grid}>
        {articles.map((article) => {
          const title = article.title[currentLocale];

          return (
            <Link
              key={article.id}
              href={`/${currentLocale}/articles/${article.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={article.photo}
                  alt={title}
                  className={styles.image}
                  loading="lazy"
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{title}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {articles.length === 0 && (
        <div className={styles.empty}>На жаль, статті поки відсутні.</div>
      )}
    </div>
  );
}
