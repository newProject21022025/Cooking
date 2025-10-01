// src/components/CategoryNavButtons/CategoryNavButtons.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { useLocale } from "next-intl";
import styles from "./CategoryNavButtons.module.scss"; 

const dishTypes = [
  { value: "all", label: "🍽️ Всі страви / All dishes" },
  { value: "soup", label: "🍲 Суп / Soup" },
  { value: "main_course", label: "🥩 Основне блюдо / Main course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

interface CategoryNavButtonsProps {
  // Пропс для додаткових стилів
  className?: string; 
  // activeCategory видалено, оскільки тепер береться з URL
}

// activeCategory прибрано з деструктуризації пропсів
export default function CategoryNavButtons({ className = '' }: CategoryNavButtonsProps) { 
  const router = useRouter();
  const locale = useLocale();
  // ✅ Зчитуємо параметри пошуку
  const searchParams = useSearchParams(); 

  // Встановлюємо цільовий шлях
  const menuPagePath = `/${locale}/menu`; 
  
  // ✅ Визначаємо активну категорію з URL. Якщо параметра немає, це "all".
  const currentCategory = searchParams.get('category') || 'all'; 

  const handleCategoryChange = (categoryValue: string) => {
    let targetUrl;
    
    // Формуємо URL: 
    if (categoryValue === "all") {
      // Якщо обрано "Всі страви", переходимо на чистий URL
      targetUrl = menuPagePath;
    } else {
      // Інакше додаємо параметр пошуку `category`
      targetUrl = `${menuPagePath}?category=${categoryValue}`;
    }
    
    // Виконуємо навігацію
    router.push(targetUrl);
  };

  return (
    <div className={`${styles.categoryButtonsContainer} ${className}`}>
      {dishTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => handleCategoryChange(type.value)}
          className={`${styles.categoryButton} ${
            // ✅ Підсвічуємо кнопку, якщо вона активна, використовуючи currentCategory
            currentCategory === type.value ? styles.active : "" 
          }`}
        >
          {locale === "uk"
            ? type.label.split("/")[0].trim()
            : type.label.split("/")[1].trim()}
        </button>
      ))}
    </div>
  );
}