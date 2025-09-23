// src/app/admin/edit/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl";
import { fetchDishesApi, deleteDishApi, selectDishApi, unselectDishApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import Link from "next/link";

// Компонент для відображення однієї страви
const DishCard = ({
  dish,
  onDelete,
  onToggleSelect, // ✅ Новий пропс для обробки події
}: {
  dish: Dish;
  onDelete: (id: number) => void;
  onToggleSelect: (id: number, isSelected: boolean) => void; // ✅ Новий пропс
}) => {
  const locale = useLocale();

  const handleDelete = async () => {
    if (confirm(`Видалити страву "${locale === "uk" ? dish.name_ua : dish.name_en}"?`)) {
      await onDelete(dish.id);
    }
  };

  const handleToggleSelect = () => {
    // ✅ Викликаємо функцію, передаючи поточний стан is_selected
    onToggleSelect(dish.id, dish.is_selected);
  };

  return (
    <div className={styles.dishCard}>
      {/* ✅ Кнопка-зірочка для вибраного */}
      <button 
        className={`${styles.selectStar} ${dish.is_selected ? styles.selected : ''}`}
        onClick={handleToggleSelect}
      >
        ★
      </button>

      <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
      <div className={styles.dishInfo}>
        <h3 className={styles.dishTitle}>
          {locale === "uk" ? dish.name_ua : dish.name_en}
        </h3>
        <p className={styles.dishDescription}>
          {locale === "uk" ? dish.description_ua : dish.description_en}
        </p>

        <div className={styles.actions}>
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
  
  // ✅ Нова функція для обробки вибору страви
  const handleToggleSelect = async (id: number, isSelected: boolean) => {
    try {
      const updatedDish = isSelected 
        ? await unselectDishApi(id) // Скасувати вибір, якщо вибрано
        : await selectDishApi(id);   // Вибрати, якщо не вибрано
        
      setDishes(prevDishes => prevDishes.map(dish => 
        dish.id === id ? { ...dish, is_selected: updatedDish.is_selected } : dish
      ));
    } catch (error) {
      console.error("Помилка при оновленні статусу вибраної страви:", error);
      alert("❌ Помилка при зміні статусу");
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
              <DishCard 
                key={dish.id} 
                dish={dish} 
                onDelete={handleDelete} 
                onToggleSelect={handleToggleSelect} // ✅ Передаємо функцію
              />
            ))
          ) : (
            <p className={styles.errorMessage}>Немає доступних страв.</p>
          )}
        </div>
      </main>
    </div>
  );
}