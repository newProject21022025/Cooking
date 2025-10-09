// src/app/admin/edit/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.scss";
import { useLocale } from "next-intl";
// Припускаємо, що ці імпорти API правильні
import {
  fetchDishesApi,
  deleteDishApi,
  selectDishApi,
  unselectDishApi,
} from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import Link from "next/link";

// Ключ для localStorage
const CATEGORY_STORAGE_KEY = "adminDishCategory";

// Категорії страв
const dishTypes = [
  { value: "all", label: "🍽️ Всі страви / All dishes" },
  { value: "soup", label: "🍲 Суп / Soup" },
  { value: "main_course", label: "🥩 Основне блюдо / Main course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

// Компонент картки страви
const DishCard = ({
  dish,
  onDelete,
  onToggleSelect,
}: {
  dish: Dish;
  onDelete: (id: number) => void;
  onToggleSelect: (id: number, isSelected: boolean) => void;
}) => {
  const locale = useLocale();

  const handleDelete = async () => {
    if (
      confirm(
        `Видалити страву "${locale === "uk" ? dish.name_ua : dish.name_en}"?`
      )
    ) {
      await onDelete(dish.id);
    }
  };

  const handleToggleSelect = () => {
    onToggleSelect(dish.id, dish.is_selected);
  };

  return (
    <div className={styles.dishCard}>
      <button
        className={`${styles.selectStar} ${
          dish.is_selected ? styles.selected : ""
        }`}
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
          <Link href={`/admin/edit/${dish.id}`} className={styles.editBtn}>
            ✏️ Редагувати
          </Link>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            🗑️ Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

// Основний компонент сторінки
export default function Edit() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Ініціалізація категорії: читання з localStorage або встановлення "all"
  const [category, setCategory] = useState<string>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY);
      // Перевірка, чи збережене значення є однією з доступних категорій
      const isCategoryValid = dishTypes.some(type => type.value === savedCategory);
      return isCategoryValid ? savedCategory! : "all";
    }
    return "all";
  });

  // Функція для завантаження страв (обгорнута в useCallback)
  const loadDishes = useCallback(
    async (query = "", pageNumber = 1, categoryValue = "all") => {
      setLoading(true);
      try {
        const response = await fetchDishesApi({
          query,
          page: pageNumber,
          limit,
          category: categoryValue !== "all" ? categoryValue : undefined,
        });

        setDishes(response.data);
        setTotalPages(Math.ceil(response.count / limit));
        setPage(response.page);
      } catch (error) {
        console.error("Помилка при завантаженні страв:", error);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // useEffect: Завантаження страв при зміні категорії
  useEffect(() => {
    // При зміні категорії завжди скидаємо на першу сторінку та застосовуємо поточний пошуковий запит
    loadDishes(searchQuery, 1, category);
  }, [category, loadDishes, searchQuery]); 

  // useEffect: Збереження категорії в localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, category);
    }
  }, [category]); 

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

  const handleToggleSelect = async (id: number, isSelected: boolean) => {
    try {
      const updatedDish = isSelected
        ? await unselectDishApi(id)
        : await selectDishApi(id);

      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.id === id ? { ...dish, is_selected: updatedDish.is_selected } : dish
        )
      );
    } catch (error) {
      console.error("Помилка при оновленні статусу вибраної страви:", error);
      alert("❌ Помилка при зміні статусу");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Просто оновлюємо стан category. 
    // loadDishes викличеться в useEffect, скинувши сторінку на 1.
    setCategory(e.target.value);
  };

  const handleSearch = () => {
    // При пошуку, застосовуємо поточну категорію і починаємо з першої сторінки
    loadDishes(searchQuery, 1, category); 
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // При очищенні пошуку, завантажуємо знову з поточною категорією і з першої сторінки
    loadDishes("", 1, category);
  };

  const handlePrevPage = () => {
    if (page > 1) loadDishes(searchQuery, page - 1, category);
  };

  const handleNextPage = () => {
    if (page < totalPages) loadDishes(searchQuery, page + 1, category);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* --- Фільтр за категоріями --- */}
        <div className={styles.filterContainer}>
          <select
            value={category}
            onChange={handleCategoryChange}
            className={styles.categorySelect}
          >
            {dishTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* --- Пошук --- */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введіть назву страви..."
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchBtn}>
            🔍 Пошук
          </button>
          {searchQuery && (
            <button onClick={handleClearSearch} className={styles.clearBtn}>
              ❌
            </button>
          )}
        </div>

        <div className={styles.dishList}>
          {loading ? (
            <p className={styles.loadingMessage}>Завантаження страв...</p>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
              />
            ))
          ) : (
            <p className={styles.errorMessage}>Немає доступних страв.</p>
          )}
        </div>

        {/* --- Пагінація --- */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              ◀️ Попередня
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Наступна ▶️
            </button>
          </div>
        )}
      </main>
    </div>
  );
}