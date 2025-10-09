// src/components/selectedDishes/SelectedDishes.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectedDishes.module.scss";
import { fetchSelectedDishesApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";
import Icon_right from "@/svg/arrows/Icon_right";
import Icon_left from "@/svg/arrows/Icon_left";

export default function SelectedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Створюємо Ref для доступу до контейнера зі стравами
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Крок прокручування
  const SCROLL_STEP = 300; // Прокручуємо на 300px за один клік

  useEffect(() => {
    const getSelectedDishes = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedDishes = await fetchSelectedDishesApi();
        console.log("fetchedDishes", fetchedDishes);
        setDishes(fetchedDishes);
      } catch (err) {
        console.error("Помилка при завантаженні вибраних страв:", err);

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

  // 2. Функції для прокручування
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -SCROLL_STEP,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: SCROLL_STEP,
        behavior: "smooth",
      });
    }
  };
  
  // --- Відображення станів ---
  
  if (loading) {
    // Стилі для завантаження тепер краще розмістити в основному контейнері
    return (
      <div className={styles.carouselContainer}>
        <p className={styles.loadingMessage}>Завантаження...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.carouselContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className={styles.carouselContainer}>
        <p className={styles.noResults}>Не знайдено жодної вибраної страви.</p>
      </div>
    );
  }

  // --- Основний рендер ---
  
  return (
    <div className={styles.carouselWrapper}>    
      
      <div className={styles.carouselContainer}>
        {/* Кнопка "Вліво" */}
        <button 
          className={`${styles.scrollButton} ${styles.left}`} 
          onClick={scrollLeft}
          aria-label="Прокрутити вліво"
        >
          <Icon_left />
        </button>
        
        {/* Список страв, що прокручується */}
        <div className={styles.dishList} ref={scrollRef}>
          {dishes.map((dish) => (
            <div key={dish.id} className={styles.dishItem}>
                <DishCard dish={dish} />
            </div>
          ))}
        </div>

        {/* Кнопка "Вправо" */}
        <button 
          className={`${styles.scrollButton} ${styles.right}`} 
          onClick={scrollRight}
          aria-label="Прокрутити вправо"
        >
          <Icon_right/>
        </button>
      </div>
    </div>
  );
}