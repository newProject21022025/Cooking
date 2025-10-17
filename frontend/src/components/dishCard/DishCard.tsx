// src/components/DishCard/DishCard.tsx

"use client";

import React, { useState } from "react";
import styles from "./DishCard.module.scss";
import { Dish } from "@/types/dish";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Додаємо useRouter для програмного переходу

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const locale = useLocale();
  const router = useRouter(); // ✅ Ініціалізуємо роутер
  const [showIngredients, setShowIngredients] = useState(false);

  // Функція для переходу на сторінку страви
  const navigateToDishPage = () => {
    router.push(`/dishes/${dish.id}`);
  };

  const handleIngredientsToggle = (e: React.MouseEvent) => {
    // Зупиняємо розповсюдження події (хоча це вже не обов'язково),
    // але це добра практика, якщо кнопка знаходиться всередині іншого інтерактивного елемента.
    e.stopPropagation(); 
    setShowIngredients(!showIngredients);
  };

  // ✅ Функція для обробки кліку на кнопку "Приготувати"
  const handleCookClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Важливо, щоб клік не впливав на батьківські елементи
    navigateToDishPage();
  };

  return (
    <div className={styles.dishCardContainer}>      
      {/* 1. БЛОК ФОТО: Тепер це окремий Link */}
      <Link href={`/dishes/${dish.id}`} className={styles.dishPhotoLink}> 
        <img 
          src={dish.photo} 
          alt={dish.name_ua} 
          className={styles.dishPhoto} 
        />
      </Link>
      
      {/* 2. БЛОК ІНФОРМАЦІЇ: Тепер це звичайний div, без Link */}
      <div className={styles.dishInfo}>
        <h3 className={styles.dishTitle}>
          {locale === "uk" ? dish.name_ua : dish.name_en}
        </h3>
        <p className={styles.dishDescription}>
          {locale === "uk" ? dish.description_ua : dish.description_en}
        </p>
      </div>

      <div className={styles.buttonsContainer}>
        {/* ✅ Кнопка для відображення інгредієнтів */}
        <button 
          onClick={handleIngredientsToggle} 
          className={styles.ingredientsButton}
        >
          {showIngredients ? "Приховати" : "Інгредієнти"}
        </button>
        
        {/* ✅ Кнопка "Приготувати": викликає функцію переходу */}
        <button 
          onClick={handleCookClick} // ✅ Викликаємо функцію переходу
          className={`${styles.ingredientsButton} ${styles.cookButton}`}
        >
          Приготувати
        </button>
      </div>

      {/* ✅ Умовне відображення списку інгредієнтів */}
      {showIngredients && (
        <div className={styles.ingredientsList}>
          <ul>
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