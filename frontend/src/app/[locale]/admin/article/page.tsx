// src/app/[locale]/admin/article/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ArticleCreator } from "@/components/articleCreator/ArticleCreator";
// Імпортуємо Article, оскільки він потрібен для нового стану
import { articlesApi, Article } from "@/api/articleApi";
import styles from "./page.module.scss";

export default function AdminArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  // 1. Новий стан для статті, яку ми редагуємо
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

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

  // Функція оновлення списку статей після створення/редагування
  const handleArticleSaved = (newArticle: Article) => {
    // Якщо стаття вже існує (редагування), оновлюємо її в списку
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) => (a.id === newArticle.id ? newArticle : a))
      );
    } else {
      // Інакше додаємо нову
      setArticles((prev) => [newArticle, ...prev]);
    }
    setEditingArticle(null); // Скидаємо режим редагування
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити статтю?")) return;

    setDeleteLoading(id);
    try {
      await articlesApi.remove(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Форма створення/редагування статті */}
      <section>
        <h1>
          {editingArticle
            ? `✏️ Редагувати статтю #${editingArticle.id}`
            : "✍️ Створити нову статтю"}
        </h1>
        {/* Передаємо статтю для редагування та функцію оновлення списку */}

        <ArticleCreator
          articleToEdit={editingArticle}
          onArticleSaved={handleArticleSaved}
        />
        {/* Кнопка скасування редагування */}
        {editingArticle && (
          <button
            onClick={() => setEditingArticle(null)}
            className={styles.cancelEdit}
          >
            Скасувати редагування
          </button>
        )}
      </section>
      <hr /> {/* Список статей */}
      <section>
        <h2>📚 Усі статті</h2>
        {loading ? (
          <p className={styles.loading}>Завантаження...</p>
        ) : articles.length === 0 ? (
          <p className={styles.empty}>Статей поки немає.</p>
        ) : (
          <div className={styles.articleList}>
            {articles.map((article) => (
              <div key={article.id} className={styles.articleCard}>
                <img src={article.photo} alt={article.title.uk} />
                <h3>{article.title.uk}</h3>
                <p>{article.description?.uk?.slice(0, 100) || "Немає опису"}</p>

                <div className={styles.actions}>
                  <a
                    href={`/articles/${article.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Переглянути
                  </a>
                  {/* 2. Кнопка Редагувати */}
                  <button
                    onClick={() => setEditingArticle(article)}
                    className={styles.editButton}
                    disabled={!!editingArticle} // Вимикаємо, якщо вже щось редагуємо
                  >
                    ✏️ Редагувати
                  </button>

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
