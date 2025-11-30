// src/components/DishCard/DishCard.tsx

"use client";

import React, { useState } from "react";
import styles from "./DishCard.module.scss";
import { Dish } from "@/types/dish";
// ✅ Додаємо useTranslations
import { useLocale, useTranslations } from "next-intl"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const locale = useLocale();
  const router = useRouter(); 
  // ✅ Ініціалізація перекладу
  const t = useTranslations("DishCard"); 
  const [showIngredients, setShowIngredients] = useState(false);

  // ... (Функції navigateToDishPage та handleCookClick без змін) ...
  const navigateToDishPage = () => {
    router.push(`/dishes/${dish.id}`);
  };

  const handleIngredientsToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowIngredients(!showIngredients);
  };

  const handleCookClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigateToDishPage();
  };

  return (
    <div className={styles.dishCardContainer}> 
      {/* 1. БЛОК ФОТО */}
      <Link href={`/dishes/${dish.id}`} className={styles.dishPhotoLink}> 
        <img 
          src={dish.photo} 
          // Використовуємо локалізовану назву для alt
          alt={locale === "uk" ? dish.name_ua : dish.name_en} 
          className={styles.dishPhoto} 
        />
      </Link>
      
      {/* 2. БЛОК ІНФОРМАЦІЇ */}
      <div className={styles.dishInfo}>
        <h3 className={styles.dishTitle}>
          {locale === "uk" ? dish.name_ua : dish.name_en}
        </h3>
        <p className={styles.dishDescription}>
          {locale === "uk" ? dish.description_ua : dish.description_en}
        </p>
      </div>

      <div className={styles.buttonsContainer}>
        {/* ✅ Кнопка для відображення інгредієнтів: використовуємо t() */}
        <button 
          onClick={handleIngredientsToggle} 
          className={styles.ingredientsButton}
        >
          {/* Використовуємо тернарний оператор з перекладом */}
          {showIngredients ? t("hideIngredients") : t("showIngredients")}
        </button>
        
        {/* ✅ Кнопка "Приготувати" */}
        <button 
          onClick={handleCookClick} 
          className={`${styles.ingredientsButton} ${styles.cookButton}`}
        >
          {t("cookButton")}
        </button>
      </div>

      {/* Умовне відображення списку інгредієнтів */}
      {showIngredients && (
        <div className={styles.ingredientsList}>
          <ul>
            {/* ... (список інгредієнтів без змін) ... */}
            {dish.important_ingredients.map((ingredient, index) => (
              <li key={index}>
                {locale === "uk" ? ingredient.name_ua : ingredient.name_en}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}