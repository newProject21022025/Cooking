// src/app/[locale]/partners/allDishes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Dish } from "@/types/dish";
import { useLocale } from "next-intl";
import { createPartnerDish, fetchPartnerDishes } from "@/redux/slices/partnerDishesSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Категорії страв
const dishTypes = [
  { value: "all", label: "🍽️ Всі страви / All dishes" },
  { value: "soup", label: "🍲 Суп / Soup" },
  { value: "main_course", label: "🥩 Основне блюдо / Main course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

const getUserIdFromStorage = (): string | null => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) return storedUserId;

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch (e) {
      console.error("Помилка декодування токена:", e);
    }
  }

  const sessionUserId = sessionStorage.getItem("userId");
  if (sessionUserId) return sessionUserId;

  return null;
};

const DishCard = ({ dish, partnerId }: { dish: Dish; partnerId: string }) => {
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const handleAdd = async () => {
    await dispatch(
      createPartnerDish({
        partner_id: partnerId,
        dish_id: Number(dish.id),
        price: 0,
        discount: 0,
        availablePortions: 0,
      })
    ).unwrap();

    dispatch(fetchPartnerDishes(partnerId));
  };

  return (
    <div className={styles.dishCard}>
      <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
      <div className={styles.dishInfo}>
        <h3>{locale === "uk" ? dish.name_ua : dish.name_en}</h3>
        <p>{locale === "uk" ? dish.description_ua : dish.description_en}</p>
        <button onClick={handleAdd} className={styles.addButton}>
          Додати до меню
        </button>
      </div>
    </div>
  );
};

export default function AllDishesPage() {
  const dispatch = useAppDispatch();
  const { items: dishes, loading, error, count } = useAppSelector((state) => state.dishes);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // --- Фільтр за категоріями ---
  const [category, setCategory] = useState<string>("all");

  // --- Пагінація ---
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const totalPages = Math.ceil((count || 0) / limit);

  const loadDishes = () => {
    dispatch(fetchDishes({
      page,
      limit,
      category: category !== "all" ? category : undefined,
    }));
  };

  useEffect(() => {
    const id = getUserIdFromStorage();
    setPartnerId(id);
  }, []);

  // Завантажуємо дані при зміні сторінки або категорії
  useEffect(() => {
    if (partnerId) loadDishes();
  }, [page, category, partnerId]);

  if (!partnerId) {
    return <p className={styles.error}>Не вдалося отримати ID партнера</p>;
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <h1>Усі страви</h1>

      {/* --- Фільтр категорій --- */}
      <div className={styles.filterContainer}>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1); // Скидаємо на першу сторінку при зміні категорії
          }}
          className={styles.categorySelect}
        >
          {dishTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} partnerId={partnerId} />
        ))}
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
    </div>
  );
}
