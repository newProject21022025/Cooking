// src/app/admin/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl";
import { fetchDishesApi, deleteDishApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import Link from "next/link";

// Компонент для відображення однієї страви
const DishCard = ({
  dish,
  onDelete,
}: {
  dish: Dish;
  onDelete: (id: number) => void;
}) => {
  const locale = useLocale();

  const handleDelete = async () => {
    if (confirm(`Видалити страву "${locale === "uk" ? dish.name_ua : dish.name_en}"?`)) {
      await onDelete(dish.id);
    }
  };

  return (
    <div className={styles.dishCard}>
      <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
      <div className={styles.dishInfo}>
        <h3 className={styles.dishTitle}>
          {locale === "uk" ? dish.name_ua : dish.name_en}
        </h3>
        <p className={styles.dishDescription}>
          {locale === "uk" ? dish.description_ua : dish.description_en}
        </p>

        {/* Кнопка редагування */}
        <Link href={`/admin/edit/${dish.id}`} className={styles.editBtn}>
          ✏️ Редагувати
        </Link>

        {/* Кнопка видалення */}
        <button onClick={handleDelete} className={styles.deleteBtn}>
          🗑️ Видалити
        </button>
      </div>
    </div>
  );
};

export default function Edit() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDishes = async () => {
    setLoading(true);
    try {
      const fetchedDishes = await fetchDishesApi();
      setDishes(fetchedDishes);
    } catch (error) {
      console.error("Помилка при завантаженні страв:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDishes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDishApi(id);
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
      alert("✅ Страву видалено");
    } catch (error) {
      console.error(error);
      alert("❌ Помилка при видаленні");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}></h1>
        <p className={styles.description}></p>

        <div className={styles.dishList}>
          {loading ? (
            <p className={styles.loadingMessage}>Завантаження страв...</p>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onDelete={handleDelete} />
            ))
          ) : (
            <p className={styles.errorMessage}>Немає доступних страв.</p>
          )}
        </div>
      </main>
    </div>
  );
}
