// src/components/IngredientFilter/IngredientFilter.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./IngredientFilter.module.scss";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation"; 
import {
  mainCategories,
  ingredientsByCategory,
} from "@/components/createDishForm/constants/ingredientsData";
import { 
  fetchDishesApi,
} from "@/api/dishesApi";
import { 
  Dish, 
  Ingredient, 
  PaginatedDishesResponse 
} from "@/types/dish"; // ✅ Імпорт нового типу відповіді
import DishCard from "@/components/dishCard/DishCard";

interface IngredientOption {
  name_ua: string;
  name_en: string;
}

const DISHES_PER_PAGE = 10; // ✅ Константа для розміру сторінки

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
  
  // ✅ Нові стани для пагінації
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Оновлений стан для зберігання повної пагінованої відповіді
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedDishesResponse>({
    data: [],
    count: 0,
    page: 1,
    limit: DISHES_PER_PAGE,
  });

  const dishes = paginatedResponse.data; // Витягуємо страви з відповіді

  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();

  const searchParams = useSearchParams(); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); 

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // ✅ 1. Ефект для синхронізації стану категорії з URL (та скидання пагінації)
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    setSelectedCategory(categoryFromUrl);

    // Скидаємо інші фільтри та пагінацію
    setSelectedIngredients([]);
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1); // ✅ Скидаємо пагінацію при зміні категорії з URL
  }, [searchParams]); 

  
  // ✅ 2. Функція для отримання та фільтрації страв (Бекенд + Клієнт)
  const getDishes = useCallback(async () => {
    setLoading(true);
    
    // ✅ НОВЕ: Додаємо Category та Ingredients до параметрів
    const backendParams = {
      page: currentPage,
      limit: DISHES_PER_PAGE,
      query: submittedSearchQuery,
      // Фільтрація за типом страви ('all' = undefined для бекенду)
      category: selectedCategory !== "all" ? selectedCategory : undefined, 
      ingredients: selectedIngredients.length > 0 ? selectedIngredients : undefined, // Додаємо інгредієнти
    };

    try {
      // 💡 1. Отримання даних з бекенду (з УСІМА фільтрами)
      const response = await fetchDishesApi(backendParams);

      // ❌ ВИДАЛЯЄМО: КЛІЄНТСЬКУ ФІЛЬТРАЦІЮ ЗА КАТЕГОРІЄЮ
      /* if (selectedCategory !== "all") {
          filteredDishes = filteredDishes.filter(
              (dish) => dish.type === selectedCategory
          );
      }
      */
      
      // ❌ ВИДАЛЯЄМО: КЛІЄНТСЬКУ ФІЛЬТРАЦІЮ ЗА ІНГРЕДІЄНТАМИ
      /*
      if (selectedIngredients.length > 0) {
        // ... (вся логіка клієнтської фільтрації)
        totalCount = filteredDishes.length; 
      }
      */
      
      // ✅ 2. Використовуємо дані та count, які повернув бекенд після фільтрації
      const totalCount = response.count;
      
      // 💡 3. Оновлення стану пагінації
      setPaginatedResponse(response); // Вся відповідь уже відфільтрована
      setTotalPages(Math.ceil(totalCount / DISHES_PER_PAGE));


    } catch (err) {
        // ...
    } finally {
        setLoading(false);
    }
}, [currentPage, submittedSearchQuery, selectedCategory, selectedIngredients]); 
  // ✅ Залежності: зміна будь-якого фільтра чи сторінки викликає новий запит

  // 💡 3. Виклик основного ефекту
  useEffect(() => {
    getDishes();
  }, [getDishes]);

  // ✅ Функції-обробники для зміни сторінки
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Функція для зміни інгредієнтів (з скиданням пагінації)
  const handleCheckboxChange = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
    // ✅ Скидаємо пагінацію та пошук
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1); 
  };

  const handleCategoryToggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  
  // Відновлена функція, яка змінює внутрішній стан (з скиданням пагінації)
  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue); 
    // ✅ Скидаємо пагінацію
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1); 
  };

  // Функція для пошуку (з скиданням пагінації)
  const handleSearch = () => {
    setSubmittedSearchQuery(searchQuery);
    // ✅ Скидаємо пагінацію та інші фільтри
    setSelectedCategory("all");
    setSelectedIngredients([]);
    setCurrentPage(1); 
  };

  const filterClasses = styles.filterWrapper;

  return (
    <div className={styles.page}>
      {/* ... (ІНПУТ ПОШУКУ ТА КНОПКИ КАТЕГОРІЙ ЗАЛИШАЮТЬСЯ БЕЗ ЗМІН) ... */}
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

      <div className={styles.categoryButtonsContainer}>
        {dishTypes.map((type) => (
          <button
            key={type.value}
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
      {/* ... (ФІЛЬТР ІНГРЕДІЄНТІВ ЗАЛИШАЄТЬСЯ БЕЗ ЗМІН) ... */}
      
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
      
      
      <h3 className={styles.resultsHeader}>Результати фільтрації (Знайдено: {paginatedResponse.count})</h3>
      
      {loading ? (
        <p className={styles.filterText}>Завантаження страв...</p>
      ) : dishes.length > 0 ? (
        <>
          <div className={styles.dishList}>
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          {/* ✅ БЛОК ПАГІНАЦІЇ */}
          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                &lt; Попередня
              </button>
              
              {/* Відображення номерів сторінок (простий варіант) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={pageNumber === currentPage ? styles.activePage : styles.pageButton}
                >
                  {pageNumber}
                </button>
              ))}

              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Наступна &gt;
              </button>
            </div>
          )}
        </>
      ) : (
        <p className={styles.noResults}>
          Не знайдено страв за обраними критеріями
        </p>
      )}
    </div>
  );
}