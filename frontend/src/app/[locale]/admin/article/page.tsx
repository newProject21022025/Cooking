// src/app/[locale]/admin/article/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ArticleCreator } from "@/components/articleCreator/ArticleCreator";
import { articlesApi, Article } from "@/api/articleApi";

export default function AdminArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Завантаження статей
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

  // Видалення статті
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      {/* === Форма створення статті === */}
      <section>
        <h1 className="text-3xl font-bold mb-6">✍️ Створити нову статтю</h1>
        <ArticleCreator />
      </section>

      {/* === Список статей === */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📚 Усі статті</h2>

        {loading ? (
          <p>Завантаження...</p>
        ) : articles.length === 0 ? (
          <p>Статей поки немає.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(article => (
              <div key={article.id} className="p-4 bg-white rounded shadow">
                <img
                  src={article.photo}
                  alt={article.title.uk}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h3 className="text-xl font-semibold">{article.title.uk}</h3>
                <p className="text-gray-600">
                  {article.description.uk.slice(0, 100)}...
                </p>

                <div className="flex justify-between mt-4">
                  <a
                    href={`/articles/${article.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    Переглянути
                  </a>

                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
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

