// src/components/IngredientFilter/IngredientFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./IngredientFilter.module.scss";
import { useLocale } from "next-intl";
import { mainCategories, ingredientsByCategory } from "@/components/createDishForm/constants/ingredientsData";
// ✅ Імпортуємо обидва методи з API
import { fetchDishesApi, searchDishesApi } from "@/api/dishesApi";
import { Dish, Ingredient } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

interface IngredientOption {
  name_ua: string;
  name_en: string;
}

export default function IngredientFilter() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();

  const [isFilterVisible, setIsFilterVisible] = useState(true);
  // ✅ Додаємо стан для пошуку за назвою
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getDishes = async () => {
      setLoading(true);
      try {
        let allDishes = [];
        // ✅ Виконуємо запит залежно від того, чи є пошуковий рядок
        if (searchQuery) {
          allDishes = await searchDishesApi(searchQuery);
        } else {
          allDishes = await fetchDishesApi();
        }

        if (selectedIngredients.length > 0) {
          const filtered = allDishes.filter((dish) =>
            selectedIngredients.every((ing) =>
              dish.important_ingredients.some((dishIng: Ingredient) => dishIng.name_ua === ing)
            )
          );
          setDishes(filtered);
        } else {
          setDishes(allDishes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    // ✅ Додаємо searchQuery в залежності useEffect, щоб він реагував на зміну запиту
    getDishes();
  }, [selectedIngredients, searchQuery]);

  const handleCheckboxChange = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
  };
  
  const filterClasses = `${styles.filterWrapper} ${isFilterVisible ? styles.visible : ''}`;

  return (
    <div className={styles.page}>
      <h2 className={styles.filterName}>Пошук страв</h2>
      
      {/* ✅ Поле для пошуку */}
      <input
        type="text"
        placeholder="Пошук за назвою страви..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      
      <div className={styles.filterHeader}>
        <h2 className={styles.filterName}>Фільтр за інгредієнтами</h2>
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={styles.toggleButton}
        >
          {isFilterVisible ? 'Згорнути' : 'Розгорнути'}
        </button>
      </div>

      <div className={filterClasses}>
        <div className={styles.filterContainer}>
          {mainCategories.map((category) => (
            <div key={category} className={styles.categoryBlock}>
              <h4>{category}</h4>
              <div className={styles.ingredientsList}>
                {ingredientsByCategory[category].map((ingredient: IngredientOption) => (
                  <label key={ingredient.name_ua} className={styles.ingredientLabel}>
                    <input
                      type="checkbox"
                      value={ingredient.name_ua}
                      checked={selectedIngredients.includes(ingredient.name_ua)}
                      onChange={() => handleCheckboxChange(ingredient.name_ua)}
                    />
                    {locale === "uk" ? ingredient.name_ua : ingredient.name_en}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className={styles.resultsHeader}>Результати фільтрації</h3>
      {loading ? (
        <p className={styles.filterText}>Завантаження страв...</p>
      ) : dishes.length > 0 ? (
        <div className={styles.dishList}>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>Не знайдено страв за обраними критеріями</p>
      )}
    </div>
  );
}