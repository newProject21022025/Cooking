// src/components/CategoryNavButtons/CategoryNavButtons.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import styles from "./CategoryNavButtons.module.scss";

// ✅ Оновлений список усіх 6 категорій з шляхами до зображень
const dishCategories = [
  // ПРИМІТКА: Шляхи до зображень припускаються. Виправте їх, якщо вони інші.
  { value: "all", label_uk: "Всі страви", label_en: "All Dishes", image_url: "/photo/AllDishes.jpg" },
  { value: "soup", label_uk: "Супи", label_en: "Soups", image_url: "/photo/Soups.jpg" },
  { value: "main_course", label_uk: "Основні страви", label_en: "Main Courses", image_url: "/photo/MainDishes.jpg" },
  { value: "side_dish", label_uk: "Гарніри", label_en: "Side Dishes", image_url: "/photo/SideDishes.jpg" },
  { value: "salad", label_uk: "Салати", label_en: "Salads", image_url: "/photo/Salads.jpg" },
  { value: "appetizer", label_uk: "Закуски", label_en: "Appetizers", image_url: "/photo/Appetizers.jpg" },
];

interface CategoryNavButtonsProps {
  className?: string;
}

export default function CategoryNavButtons({ className = '' }: CategoryNavButtonsProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  const menuPagePath = `/${locale}/menu`;
  // ✅ currentCategory буде використовуватися лише для підсвічування активної картки
  const currentCategory = searchParams.get('category') || 'all'; 

  const handleCategoryChange = (categoryValue: string) => {
    let targetUrl;

    if (categoryValue === "all") {
      targetUrl = menuPagePath;
    } else {
      targetUrl = `${menuPagePath}?category=${categoryValue}`;
    }

    router.push(targetUrl);
  };

  return (
    // Змінено назву контейнера, якщо плануєте використовувати його для всіх категорій
    <div className={`${styles.categoryCardsGrid} ${className}`}>
      {dishCategories.map((type) => {
        // Визначаємо відображувані тексти
        const mainLabel = locale === "uk" ? type.label_uk : type.label_en;
        const subLabel = locale === "uk" ? type.label_en : type.label_uk;

        return (
          <button
            key={type.value}
            onClick={() => handleCategoryChange(type.value)}
            className={`${styles.categoryCard} ${
              currentCategory === type.value ? styles.active : ""
            }`}
          >
            {/* Контейнер для зображення */}
            <div 
              className={styles.imageContainer}
              style={{ backgroundImage: `url(${type.image_url})` }}
            >
              {/* Оверлей, щоб текст на зображенні був читабельнішим (якщо потрібно) */}
            </div>
            
            {/* Текстовий блок */}
            <div className={styles.textBlock}>
              <span className={styles.mainLabel}>{mainLabel}</span>
              <span className={styles.subLabel}>{subLabel}</span>
            </div>
          </button>
        );
      })}     
    </div>
  );
}