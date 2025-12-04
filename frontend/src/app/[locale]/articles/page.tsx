// src/app/[locale]/articles/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { articlesApi } from "@/api/articleApi";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";


type Locale = "uk" | "en";

interface MultiLang {
  uk?: string;
  en?: string;
}

interface Article {
  id: number;
  title?: MultiLang;
  description?: MultiLang;
  photo?: string;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Articles() { 
  // Отримайте locale за допомогою useParams()
  const params = useParams();
  const locale = params.locale as string; 
  
  const currentLocale: Locale = locale === "en" ? "en" : "uk";
  
  // useTranslations тепер викликається коректно всередині Client Component
  const t = useTranslations("Articles"); 

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Використовуйте useEffect для отримання даних на клієнті
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articlesApi.getAll();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  const getText = (textObj?: MultiLang) => textObj?.[currentLocale] ?? "—";

  if (isLoading) {
    return <div className={styles.container}>Завантаження статей...</div>;
  }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")} </h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>
      {articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article) => {
            const title = getText(article.title);

            return (
              <div key={article.id} className={styles.cardWrapper}>
                <div className={styles.textContent}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDescription}>
                    {getText(article.description)}
                  </p>
                </div>
                {article.photo && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={article.photo}
                      alt={title}
                      className={styles.image}
                      loading="lazy"
                    />
                    <Link
                      key={article.id}
                      href={`/${currentLocale}/articles/${article.id}`}
                      className={styles.card}
                    >
                      <div className={styles.content}>
                        {/* Кнопка Читати статтю */}
                        <div className={styles.readMoreButton}>
                          {t("moreButton")}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>На жаль, статті поки відсутні.</div>
      )}
    </div>
  );
}
