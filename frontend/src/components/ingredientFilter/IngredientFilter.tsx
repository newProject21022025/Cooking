"use client";

import React, { useState, useEffect } from "react";
import styles from "./IngredientFilter.module.scss";
import { useLocale } from "next-intl";
import { mainCategories, ingredientsByCategory } from "@/components/createDishForm/constants/ingredientsData";
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
 
  const [searchQuery, setSearchQuery] = useState('');  
  
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const getDishes = async () => {
      setLoading(true);
      try {
        let allDishes = [];
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
    getDishes();
  }, [selectedIngredients, searchQuery]);

  const handleCheckboxChange = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
  };
  
  const handleCategoryToggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const filterClasses = styles.filterWrapper; 

  return (
    <div className={styles.page}>
      <h2 className={styles.filterName}>Пошук страв</h2>
      
      <input
        type="text"
        placeholder="Пошук за назвою страви..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      
      <div className={styles.filterHeader}>
        <h2 className={styles.filterName}>Фільтр за інгредієнтами</h2>    
      </div>

      <div className={filterClasses}>
        <div className={styles.dropdownContainer}>
          {mainCategories.map((category) => (
            <div key={category} className={styles.dropdownWrapper}>
              <button 
                className={styles.dropdownHeader} 
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                <span className={`${styles.arrow} ${openCategory === category ? styles.arrowUp : ''}`}>▼</span>
              </button>
              <div 
                className={`${styles.dropdownContent} ${openCategory === category ? styles.open : ''}`}
              >
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