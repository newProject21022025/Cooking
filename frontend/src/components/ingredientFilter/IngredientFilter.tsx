// src/components/IngredientFilter/IngredientFilter.tsx

"use client";

import React, { useState, useEffect } from "react";
import styles from "./IngredientFilter.module.scss";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation"; 
import {
  mainCategories,
  ingredientsByCategory,
} from "@/components/createDishForm/constants/ingredientsData";
import { fetchDishesApi, searchDishesApi } from "@/api/dishesApi";
import { Dish, Ingredient } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

interface IngredientOption {
  name_ua: string;
  name_en: string;
}

// dishTypes для внутрішніх кнопок
const dishTypes = [
  { value: "all", label: "🍽️ Всі страви / All dishes" },
  { value: "soup", label: "🍲 Суп / Soup" },
  { value: "main_course", label: "🥩 Основне блюдо / Main course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

export default function IngredientFilter() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();

  const searchParams = useSearchParams(); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); 

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // ✅ Ефект для синхронізації стану категорії з URL (від CategoryNavButtons)
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    // Встановлюємо стан, отриманий з URL
    setSelectedCategory(categoryFromUrl);

    // Скидаємо інші фільтри, щоб застосувати лише категорію з URL
    setSelectedIngredients([]);
    setSubmittedSearchQuery("");
    setSearchQuery("");
  }, [searchParams]); // Залежність від searchParams

  // Основний useEffect для отримання та фільтрації страв (без змін)
  useEffect(() => {
    const getDishes = async () => {
      setLoading(true);
      try {
        let allDishes = [];
        if (submittedSearchQuery) {
          allDishes = await searchDishesApi(submittedSearchQuery);
        } else {
          allDishes = await fetchDishesApi();
        }

        let filteredDishes = allDishes;

        // Фільтрація за станом
        if (selectedCategory !== "all") {
          filteredDishes = filteredDishes.filter(
            (dish) => dish.type === selectedCategory
          );
        }

        if (selectedIngredients.length > 0) {
          const filteredByIngredients = filteredDishes.filter((dish) =>
            selectedIngredients.every((ing) =>
              dish.important_ingredients.some(
                (dishIng: Ingredient) => dishIng.name_ua === ing
              )
            )
          );
          setDishes(filteredByIngredients);
        } else {
          setDishes(filteredDishes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getDishes();
  }, [selectedIngredients, submittedSearchQuery, selectedCategory]);

  // Функція для зміни інгредієнтів (без змін)
  const handleCheckboxChange = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
    setSubmittedSearchQuery("");
    setSearchQuery("");
  };

  const handleCategoryToggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  
  // ✅ Відновлена функція, яка змінює внутрішній стан
  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue); 
    setSubmittedSearchQuery("");
    setSearchQuery("");
  };

  // Функція для пошуку (без змін)
  const handleSearch = () => {
    setSubmittedSearchQuery(searchQuery);
    // Скидаємо інші фільтри при пошуку
    setSelectedCategory("all");
    setSelectedIngredients([]);
  };

  const filterClasses = styles.filterWrapper;

  return (
    <div className={styles.page}>
      <h2 className={styles.filterName}>Пошук страв</h2>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Пошук за назвою страви..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Пошук
        </button>
      </div>

      {/* ✅ БЛОК КНОПОК КАТЕГОРІЙ ВІДНОВЛЕНО */}
      <div className={styles.categoryButtonsContainer}>
        {dishTypes.map((type) => (
          <button
            key={type.value}
            // Викликаємо внутрішню функцію зміни стану
            onClick={() => handleCategoryChange(type.value)}
            className={`${styles.categoryButton} ${
              selectedCategory === type.value ? styles.active : ""
            }`}
          >
            {locale === "uk"
              ? type.label.split("/")[0].trim()
              : type.label.split("/")[1].trim()}
          </button>
        ))}
      </div>

      <div className={styles.filterHeader}>
        <h2 className={styles.filterName}>Фільтр за інгредієнтами</h2>
      </div>
      {/* ... Решта компонента без змін */}
      <div className={filterClasses}>
        <div className={styles.dropdownContainer}>
          {mainCategories.map((category) => (
            <div key={category} className={styles.dropdownWrapper}>
              <button
                className={styles.dropdownHeader}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                <span
                  className={`${styles.arrow} ${
                    openCategory === category ? styles.arrowUp : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`${styles.dropdownContent} ${
                  openCategory === category ? styles.open : ""
                }`}
              >
                {ingredientsByCategory[category].map(
                  (ingredient: IngredientOption) => (
                    <label
                      key={ingredient.name_ua}
                      className={styles.ingredientLabel}
                    >
                      <input
                        type="checkbox"
                        value={ingredient.name_ua}
                        checked={selectedIngredients.includes(
                          ingredient.name_ua
                        )}
                        onChange={() =>
                          handleCheckboxChange(ingredient.name_ua)
                        }
                      />
                      {locale === "uk"
                        ? ingredient.name_ua
                        : ingredient.name_en}
                    </label>
                  )
                )}
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
        <p className={styles.noResults}>
          Не знайдено страв за обраними критеріями
        </p>
      )}
    </div>
  );
}