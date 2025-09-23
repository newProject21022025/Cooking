// src/components/SelectedDishes/SelectedDishes.tsx

"use client";

import React, { useState, useEffect } from "react";
import styles from "./SelectedDishes.module.scss";
import { fetchSelectedDishesApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

export default function SelectedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSelectedDishes = async () => {
      setLoading(true);
      try {
        const fetchedDishes = await fetchSelectedDishesApi();
        setDishes(fetchedDishes);
      } catch (err) {
        console.error("Помилка при завантаженні вибраних страв:", err);
      } finally {
        setLoading(false);
      }
    };

    getSelectedDishes();
  }, []);

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Вибрані страви</h2>
      
      {loading ? (
        <p className={styles.loadingMessage}>Завантаження...</p>
      ) : dishes.length > 0 ? (
        <div className={styles.dishList}>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>Не знайдено жодної вибраної страви.</p>
      )}
    </div>
  );
}