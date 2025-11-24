// src/app/[locale]/admin/article/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ArticleCreator } from "@/components/articleCreator/ArticleCreator";
import { articlesApi, Article } from "@/api/articleApi";
import styles from './page.module.scss';

export default function AdminArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getAll();
      setArticles(data);
    } catch (err) {
      console.error("Помилка завантаження статей", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити статтю?")) return;

    setDeleteLoading(id);
    try {
      await articlesApi.remove(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Форма створення статті */}
      <section>
        <h1>✍️ Створити нову статтю</h1>
        <ArticleCreator />
      </section>

      {/* Список статей */}
      <section>
        <h2>📚 Усі статті</h2>

        {loading ? (
          <p className={styles.loading}>Завантаження...</p>
        ) : articles.length === 0 ? (
          <p className={styles.empty}>Статей поки немає.</p>
        ) : (
          <div className={styles.articleList}>
            {articles.map(article => (
              <div key={article.id} className={styles.articleCard}>
                <img src={article.photo} alt={article.title.uk} />
                <h3>{article.title.uk}</h3>
                <p>{article.description?.uk?.slice(0, 100) || "Немає опису"}</p>

                <div className={styles.actions}>
                  <a href={`/articles/${article.id}`}>Переглянути</a>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deleteLoading === article.id}
                  >
                    {deleteLoading === article.id ? "Видалення..." : "Видалити"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
