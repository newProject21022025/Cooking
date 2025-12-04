// src/app/[locale]/articles/[id]/page.tsx

import React from "react";
import { articlesApi } from "@/api/articleApi";
import styles from "./page.module.scss";
import Link from "next/link";
import { getTranslations } from "next-intl/server"; // <-- ДОДАЙТЕ ЦЕЙ ІМПОРТ

type Locale = "uk" | "en";

interface MultiLang {
  uk?: string;
  en?: string;
}

interface ArticleBlock {
  title?: MultiLang;
  description?: MultiLang;
}

interface Article {
  id: number;
  title?: MultiLang;
  description?: MultiLang;
  photo?: string;
  blocks?: ArticleBlock[];
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ArticlePage(props: PageProps) {
  const { locale, id } = await props.params; // 1. Отримання функції перекладу (t)

  const t = await getTranslations({ locale, namespace: "ArticlePage" });

  const currentLocale: Locale = locale === "en" ? "en" : "uk";

  let article: Article | null = null;
  try {
    article = await articlesApi.getOne(Number(id));
  } catch (e) {
    console.error("Failed to load article:", e);
  }

  if (!article) {
    // Використовуємо переклад для "Статтю не знайдено"
    return <div className={styles.notFound}>{t("notFound")}</div>;
  }

  const getText = (textObj?: MultiLang) => textObj?.[currentLocale] ?? "—";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{getText(article.title)}</h1> 
        <p className={styles.description}>{getText(article.description)}</p> 
      </div>

      {article.photo && (
        <div className={styles.imageWrapper}>
          <img
            src={article.photo}
            alt={getText(article.title)}
            className={styles.image}
          />
        </div>
      )}

      {article.blocks && article.blocks.length > 0 && (
        <div className={styles.blocks}>
          {article.blocks.map((block, idx) => (
            <div key={idx} className={styles.block}>
              <h3 className={styles.blockTitle}>{getText(block.title)}</h3> 
              <p className={styles.blockDescription}>
                {getText(block.description)} 
              </p>
            </div>
          ))}
        </div>
      )}

      <Link
        key={article.id}
        href={`/${currentLocale}/articles`}
        className={styles.card}
      >
        <div className={styles.content}>
          <div className={styles.readMoreButton}>
            {t("backButton")}
            {/* <-- ВИКОРИСТАННЯ ПЕРЕКЛАДУ ТУТ */} 
          </div>
        </div>
      </Link>
    </div>
  );
}
