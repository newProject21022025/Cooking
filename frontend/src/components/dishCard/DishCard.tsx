// src/components/DishCard/DishCard.tsx

"use client";

import React, { useState } from "react";
import styles from "./DishCard.module.scss";
import { Dish } from "@/types/dish";
import { useLocale } from "next-intl";
import Link from "next/link";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const locale = useLocale();
  // ✅ Додаємо стан для керування видимістю інгредієнтів
  const [showIngredients, setShowIngredients] = useState(false);

  const handleIngredientsToggle = (e: React.MouseEvent) => {
    // Зупиняємо розповсюдження події, щоб не спрацювало Link
    e.preventDefault();
    setShowIngredients(!showIngredients);
  };

  return (
    <div className={styles.dishCardContainer}>
      <Link href={`/dishes/${dish.id}`} className={styles.dishCard}>
        <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
        <div className={styles.dishInfo}>
          <h3 className={styles.dishTitle}>
            {locale === "uk" ? dish.name_ua : dish.name_en}
          </h3>
          <p className={styles.dishDescription}>
            {locale === "uk" ? dish.description_ua : dish.description_en}
          </p>
        </div>
      </Link>
      {/* ✅ Кнопка для відображення інгредієнтів */}
      <button 
        onClick={handleIngredientsToggle} 
        className={styles.ingredientsButton}
      >
        {showIngredients ? "Приховати інгредієнти" : "Інгредієнти"}
      </button>

      {/* ✅ Умовне відображення списку інгредієнтів */}
      {showIngredients && (
        <div className={styles.ingredientsList}>
          {/* <h4>Основні інгредієнти:</h4> */}
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