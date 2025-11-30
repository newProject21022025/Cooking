// src/components/IngredientFilter/IngredientFilter.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./IngredientFilter.module.scss";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import {
  mainCategories,
  ingredientsByCategory,
} from "@/components/createDishForm/constants/ingredientsData";

import { fetchDishesApi } from "@/api/dishesApi";
import { Dish, Ingredient, PaginatedDishesResponse } from "@/types/dish";
import DishCard from "@/components/dishCard/DishCard";

// -----------------------------
// TYPES
// -----------------------------
interface IngredientOption {
  name_ua: string;
  name_en: string;
}

const DISHES_PER_PAGE = 7;
const MAX_VISIBLE_PAGES = 3;

// -----------------------------
// PAGINATION
// -----------------------------
const renderPageNumbers = (
  currentPage: number,
  totalPages: number,
  goToPage: (page: number) => void
) => {
  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = MAX_VISIBLE_PAGES;

  if (totalPages <= maxPagesToShow + 2) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    const boundary = 1;
    const visibleRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(2, currentPage - visibleRange);
    let end = Math.min(totalPages - 1, currentPage + visibleRange);

    if (currentPage <= MAX_VISIBLE_PAGES) {
      end = MAX_VISIBLE_PAGES + 1;
    } else if (currentPage > totalPages - MAX_VISIBLE_PAGES) {
      start = totalPages - MAX_VISIBLE_PAGES;
    }

    pageNumbers.push(1);

    if (start > boundary + 1) pageNumbers.push("...");

    for (let i = start; i <= end; i++) pageNumbers.push(i);

    if (end < totalPages - boundary) pageNumbers.push("...");

    if (totalPages > 1 && pageNumbers[pageNumbers.length - 1] !== totalPages) {
      pageNumbers.push(totalPages);
    }
  }

  return pageNumbers.map((pageNumber, index) => {
    if (pageNumber === "...") {
      return (
        <span key={`dots-${index}`} className={styles.dots}>
          ...
        </span>
      );
    }

    const pageNum = pageNumber as number;

    return (
      <button
        key={pageNum}
        onClick={() => goToPage(pageNum)}
        className={
          pageNum === currentPage ? styles.activePage : styles.pageButton
        }
      >
        {pageNum}
      </button>
    );
  });
};

// -----------------------------
// DISH TYPES
// -----------------------------
const dishTypes = [
  {
    value: "all",
    label_ua: "Всі страви",
    label_en: "All dishes",
    image_url: "/photo/AllDishes.jpg",
  },
  {
    value: "soup",
    label_ua: "Суп",
    label_en: "Soup",
    image_url: "/photo/Soups.jpg",
  },
  {
    value: "main_course",
    label_ua: "Основне блюдо",
    label_en: "Main course",
    image_url: "/photo/MainDishes.jpg",
  },
  {
    value: "side_dish",
    label_ua: "Гарнір",
    label_en: "Side dish",
    image_url: "/photo/SideDishes.jpg",
  },
  {
    value: "salad",
    label_ua: "Салат",
    label_en: "Salad",
    image_url: "/photo/Salads.jpg",
  },
  {
    value: "appetizer",
    label_ua: "Закуска",
    label_en: "Appetizer",
    image_url: "/photo/Appetizers.jpg",
  },
];

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function IngredientFilter() {
  const t = useTranslations("IngredientFilter");
  const locale = useLocale();
  const searchParams = useSearchParams();

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

  const [loading, setLoading] = useState<boolean>(true);
  const dishes = paginatedResponse.data;

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // --------------------------
  // LOAD CATEGORY FROM URL
  // --------------------------
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";

    setSelectedCategory(categoryFromUrl);
    setSelectedIngredients([]);
    setSubmittedSearchQuery("");
    setSearchQuery("");
    setCurrentPage(1);
  }, [searchParams]);

  // --------------------------
  // FETCH DISHES
  // --------------------------
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
      console.error("Помилка завантаження страв:", err);
      setPaginatedResponse({
        data: [],
        count: 0,
        page: 1,
        limit: DISHES_PER_PAGE,
      });
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

  // --------------------------
  // HANDLERS
  // --------------------------
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
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
    // setSelectedIngredients([]);
    setCurrentPage(1);
  };

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <p>svg</p>
        <div className={styles.boxTitle}>
          <h2 className={styles.filterTitle}>{t("menuTitle")}</h2>
          <p className={styles.filterSubTitle}>{t("menuSubtitle")}</p>
        </div>
      </div>

      {/* SEARCH */}
      <h2 className={styles.filterTitleSearch}>{t("searchTitle")}</h2>

      <div className={styles.searchContainer}>
        <p>svg</p>

        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch} className={styles.searchButton}>
          {t("searchBtn")}
        </button>
      </div>

      {/* CATEGORY BUTTONS */}
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
              {locale === "uk" ? type.label_ua : type.label_en}
            </span>
          </button>
        ))}
      </div>

      {/* INGREDIENT FILTER */}
      <div className={styles.filterHeader}>
        <div className={styles.header}>
          <p>svg</p>
          <div className={styles.BoxTitle}>
            <h2 className={styles.filterTitle}>{t("ingredientFilterTitle")}</h2>
            <p className={styles.filterSubTitle}>
              {t("ingredientFilterSubtitle")}
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
                {/* {t(category)} */}
                {t(`category.${category}`)}
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
         (ingredient: IngredientOption) => {
          // Змінюємо: повертаємо ingredient.name_ua як унікальний ключ/значення
          const ingredientValue = ingredient.name_ua; // ✅ ВИПРАВЛЕНО
          return (
           <label
            key={ingredientValue} // Використовуємо name_ua як ключ
            className={styles.ingredientLabel}
           >
            <input
             type="checkbox"
             value={ingredientValue} // Передаємо name_ua як значення
             checked={selectedIngredients.includes(
              ingredientValue
             )}
             onChange={() => handleCheckboxChange(ingredientValue)}
            />
            {locale === "uk"
             ? ingredient.name_ua
             : ingredient.name_en}
           </label>
          );
         }
        )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <h3 className={styles.resultsHeader}>
        {t("resultsTitle")} ({t("found")}: {paginatedResponse.count})
      </h3>

      {loading ? (
        <p className={styles.filterText}>{t("loading")}</p>
      ) : dishes.length > 0 ? (
        <>
          <div className={styles.dishList}>
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt; {t("prev")}
              </button>

              {renderPageNumbers(currentPage, totalPages, goToPage)}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {t("next")} &gt;
              </button>
            </div>
          )}
        </>
      ) : (
        <p className={styles.noResults}>{t("noResults")}</p>
      )}
    </div>
  );
}
