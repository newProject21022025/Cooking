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
import { fetchDishesApi } from "@/api/dishesApi";
import { Dish, Ingredient, PaginatedDishesResponse } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

interface IngredientOption {
  name_ua: string;
  name_en: string;
}

const DISHES_PER_PAGE = 7;

// Константа для контролю кількості відображуваних сторінок навколо поточної
const MAX_VISIBLE_PAGES = 3; 

// ----------------------------------------------------------------------
// ✅ ДОПОМІЖНА ФУНКЦІЯ: ГЕНЕРАЦІЯ СКОРОЧЕНОГО СПИСКУ НОМЕРІВ СТОРІНОК
// ----------------------------------------------------------------------
const renderPageNumbers = (currentPage: number, totalPages: number, goToPage: (page: number) => void) => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = MAX_VISIBLE_PAGES;

    if (totalPages <= maxPagesToShow + 2) {
        // Якщо сторінок мало, відображаємо всі
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        const boundary = 1; // Завжди показуємо першу та останню сторінки
        const visibleRange = Math.floor(maxPagesToShow / 2);

        let start = Math.max(2, currentPage - visibleRange);
        let end = Math.min(totalPages - 1, currentPage + visibleRange);

        // Коригування, якщо діапазон прилипає до початку/кінця
        if (currentPage <= MAX_VISIBLE_PAGES) { // ✅ ВИПРАВЛЕНО
          end = MAX_VISIBLE_PAGES + 1; // ✅ ВИПРАВЛЕНО (Використовуємо MAX_VISIBLE_PAGES)
      } else if (currentPage > totalPages - MAX_VISIBLE_PAGES) { // ✅ ВИПРАВЛЕНО
          start = totalPages - MAX_VISIBLE_PAGES; // ✅ ВИПРАВЛЕНО
      }

        pageNumbers.push(1); // Перша сторінка

        // Пропуск на початку
        if (start > boundary + 1) {
            pageNumbers.push("...");
        }

        // Середній діапазон
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        // Пропуск в кінці
        if (end < totalPages - boundary) {
            pageNumbers.push("...");
        }

        // Остання сторінка (якщо вона не 1)
        if (totalPages > 1 && pageNumbers[pageNumbers.length - 1] !== totalPages) {
            pageNumbers.push(totalPages);
        }
    }

    return pageNumbers.map((pageNumber, index) => {
        if (pageNumber === "...") {
            return <span key={`dots-${index}`} className={styles.dots}>...</span>;
        }

        const pageNum = pageNumber as number; // TypeScript fix

        return (
            <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={
                    pageNum === currentPage
                        ? styles.activePage
                        : styles.pageButton
                }
            >
                {pageNum}
            </button>
        );
    });
};

// ----------------------------------------------------------------------
// ОСНОВНИЙ КОМПОНЕНТ
// ----------------------------------------------------------------------

const dishTypes = [
    {
      value: "all",
      label: "Всі страви / All dishes",
      image_url: "/photo/AllDishes.jpg",
    },
    { value: "soup", label: "Суп / Soup", image_url: "/photo/Soups.jpg" },
    {
      value: "main_course",
      label: "Основне блюдо / Main course",
      image_url: "/photo/MainDishes.jpg",
    },
    {
      value: "side_dish",
      label: "Гарнір / Side dish",
      image_url: "/photo/SideDishes.jpg",
    },
    { value: "salad", label: "Салат / Salad", image_url: "/photo/Salads.jpg" },
    {
      value: "appetizer",
      label: "Закуска / Appetizer",
      image_url: "/photo/Appetizers.jpg",
    },
];

export default function IngredientFilter() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [paginatedResponse, setPaginatedResponse] =
    useState<PaginatedDishesResponse>({
      data: [],
      count: 0,
      page: 1,
      limit: DISHES_PER_PAGE,
    });

  const dishes = paginatedResponse.data;

  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();

  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    setSelectedCategory(categoryFromUrl);

    setSelectedIngredients([]);
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1);
  }, [searchParams]);

  const getDishes = useCallback(async () => {
    setLoading(true);

    const backendParams = {
      page: currentPage,
      limit: DISHES_PER_PAGE,
      query: submittedSearchQuery,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      ingredients:
        selectedIngredients.length > 0 ? selectedIngredients : undefined,
    };

    try {
      const response = await fetchDishesApi(backendParams);
      const totalCount = response.count;

      setPaginatedResponse(response);
      setTotalPages(Math.ceil(totalCount / DISHES_PER_PAGE));
    } catch (err) {
      // Обробка помилок
      console.error("Помилка завантаження страв:", err);
      setPaginatedResponse({ data: [], count: 0, page: 1, limit: DISHES_PER_PAGE });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    submittedSearchQuery,
    selectedCategory,
    selectedIngredients,
  ]);

  useEffect(() => {
    getDishes();
  }, [getDishes]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCheckboxChange = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCategoryToggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSubmittedSearchQuery(searchQuery);
    setSelectedCategory("all");
    setSelectedIngredients([]);
    setCurrentPage(1);
  };

  const filterClasses = styles.filterWrapper;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p>svg</p>
        <div className={styles.boxTitle}>
          <h2 className={styles.filterTitle}>Наше меню</h2>
          <p className={styles.filterSubTitle}>
            Дивіться наше меню і обирайте найулюбленіші страви для себе.
          </p>
        </div>
      </div>
      <h2 className={styles.filterTitleSearch}>Пошук за назвою страви</h2>

      <div className={styles.searchContainer}>
        <p>svg</p>
        <input
          type="text"
          placeholder="Введіть назву страви, яку б ви хотіли знайти"
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
          Знайти страву
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
            <div
              className={styles.imageContainer}
              style={{ backgroundImage: `url(${type.image_url})` }}
            />
            <span className={styles.buttonLabel}>
              {locale === "uk"
                ? type.label.split("/")[0].trim()
                : type.label.split("/")[1].trim()}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.filterHeader}>
        <div className={styles.header}>
          <p>svg</p>
          <div className={styles.BoxTitle}>
            <h2 className={styles.filterTitle}>Фільтр за інгредієнтами</h2>
            <p className={styles.filterSubTitle}>
              Обирайте свою вишукану страву з наявних інгредієнтів, які ви
              маєте, готуйте з задоволенням та насолоджуйтесь своєю кулінарною
              майстерністю.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.filterClasses}>
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

      <h3 className={styles.resultsHeader}>
        Результати фільтрації (Знайдено: {paginatedResponse.count})
      </h3>

      {loading ? (
        <p className={styles.filterText}>Завантаження страв...</p>
      ) : dishes.length > 0 ? (
        <>
          <div className={styles.dishList}>
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          {/* ✅ ОНОВЛЕНИЙ БЛОК ПАГІНАЦІЇ (Варіант 1: Скорочена) */}
          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt; Попередня
              </button>

              {/* ✅ ВИКЛИК НОВОЇ ФУНКЦІЇ ДЛЯ СКОРОЧЕНОГО СПИСКУ */}
              {renderPageNumbers(currentPage, totalPages, goToPage)}

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