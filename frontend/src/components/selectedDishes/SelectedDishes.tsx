"use client";

import React, { useState, useEffect } from "react";
import styles from "./SelectedDishes.module.scss";
import { fetchSelectedDishesApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

export default function SelectedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSelectedDishes = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedDishes = await fetchSelectedDishesApi();
        console.log("fetchedDishes", fetchedDishes);
        setDishes(fetchedDishes);
      } catch (err) {
        // Тип тепер unknown (але ми знаємо, що кидаємо Error)
        console.error("Помилка при завантаженні вибраних страв:", err);

        // Перевіряємо, чи це об'єкт Error, щоб отримати access до .message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Виникла невідома помилка. Спробуйте оновити сторінку.");
        }
      } finally {
        setLoading(false);
      }
    };

    getSelectedDishes();
  }, []);

  if (loading) {
    return <p className={styles.loadingMessage}>Завантаження...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  if (dishes.length === 0) {
    return (
      <p className={styles.noResults}>Не знайдено жодної вибраної страви.</p>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Вибрані страви</h2>
      <div className={styles.dishList}>
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
