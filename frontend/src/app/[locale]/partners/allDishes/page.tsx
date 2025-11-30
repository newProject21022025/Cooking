// src/app/[locale]/partners/allDishes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Dish } from "@/types/dish";
import { useLocale, useTranslations } from "next-intl"; // Додаємо useTranslations
import {
 createPartnerDish,
 fetchPartnerDishes,
} from "@/redux/slices/partnerDishesSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Dish categories (will be used for translation keys later)
const dishTypes = [
 { value: "all", labelKey: "allDishes" },
 { value: "soup", labelKey: "soup" },
 { value: "main_course", labelKey: "mainCourse" },
 { value: "side_dish", labelKey: "sideDish" },
 { value: "salad", labelKey: "salad" },
 { value: "appetizer", labelKey: "appetizer" },
];

const getUserIdFromStorage = (): string | null => {
 const storedUserId = localStorage.getItem("userId");
 if (storedUserId) return storedUserId;

 const token = localStorage.getItem("token");
 if (token) {
  try {
   const payload = JSON.parse(atob(token.split(".")[1]));
   return payload.id || payload.userId || payload.sub || null;
  } catch (e) {
   console.error("Error decoding token:", e); // Переклад
  }
 }

 return sessionStorage.getItem("userId") || null;
};

// --- Dish Card Component ---
const DishCard = ({
 dish,
 partnerId,
 added,
 onAdd,
}: {
 dish: Dish;
 partnerId: string;
 added: boolean;
 onAdd: () => void;
}) => {
 const locale = useLocale();
 const t = useTranslations("AllDishes"); // Використовуємо той самий простір імен для кнопок

 const dishName = locale === "uk" ? dish.name_ua : dish.name_en;
 const dishDescription = locale === "uk" ? dish.description_ua : dish.description_en;

 return (
  <div className={styles.dishCard}>
   <img src={dish.photo} alt={dishName} className={styles.dishPhoto} />
   <div className={styles.dishInfo}>
    <h3>{dishName}</h3>
    <p>{dishDescription}</p>
    <button
     onClick={onAdd}
     className={`${styles.addButton} ${added ? styles.added : ""}`}
     disabled={added}
    >
     {added ? t("added") : t("addToMenu")} {/* Переклад */}
    </button>
   </div>
  </div>
 );
};

export default function AllDishesPage() {
 const dispatch = useAppDispatch();
 const t = useTranslations("AllDishes"); // Ініціалізуємо переклади для сторінки

 const { items: dishes, loading, error, count } = useAppSelector(
  (state) => state.dishes
 );
 const { items: partnerDishes } = useAppSelector(
  (state) => state.partnerDishes
 );

 const [partnerId, setPartnerId] = useState<string | null>(null);
 const [category, setCategory] = useState<string>("all");
 const [page, setPage] = useState<number>(1);
 const [limit] = useState<number>(10);
 const totalPages = Math.ceil((count || 0) / limit);

 useEffect(() => {
  const id = getUserIdFromStorage();
  if (id) {
   setPartnerId(id);
   dispatch(fetchPartnerDishes(id)); // Load added dishes
  }
 }, [dispatch]);

 const loadDishes = () => {
  dispatch(
   fetchDishes({
    page,
    limit,
    category: category !== "all" ? category : undefined,
   })
  );
 };

 useEffect(() => {
  if (partnerId) loadDishes();
 }, [page, category, partnerId, dispatch]); // Додано dispatch в залежності

 const handleAdd = async (dishId: number) => {
  if (!partnerId) return;
  await dispatch(
   createPartnerDish({
    partner_id: partnerId,
    dish_id: dishId,
    price: 0,
    discount: 0,
    availablePortions: 0,
   })
  ).unwrap();
  dispatch(fetchPartnerDishes(partnerId)); // Refresh the list
 };

 if (!partnerId)
  return <p className={styles.error}>{t("partnerIdError")}</p>; // Переклад

 const handlePrevPage = () => page > 1 && setPage((p) => p - 1);
 const handleNextPage = () =>
  page < totalPages && setPage((p) => p + 1);

 return (
  <div className={styles.container}>
   <h1>{t("pageTitle")}</h1> {/* Переклад */}

   {/* --- Category Filter --- */}
   <div className={styles.filterContainer}>
    <select
     value={category}
     onChange={(e) => {
      setCategory(e.target.value);
      setPage(1);
     }}
     className={styles.categorySelect}
    >
     {dishTypes.map((type) => (
      <option key={type.value} value={type.value}>
       {t(type.labelKey)} {/* Переклад */}
      </option>
     ))}
    </select>
   </div>

   {loading && <p>{t("loading")}</p>} {/* Переклад */}
   {error && <p className={styles.error}>{error}</p>}

   <div className={styles.grid}>
    {dishes.map((dish) => {
     const isAdded = partnerDishes.some(
      (pd) => pd.dish_id === Number(dish.id)
     );

     return (
      <DishCard
       key={dish.id}
       dish={dish}
       partnerId={partnerId}
       added={isAdded}
       onAdd={() => handleAdd(Number(dish.id))}
      />
     );
    })}
   </div>

   {/* --- Pagination --- */}
   {totalPages > 1 && (
    <div className={styles.pagination}>
     <button onClick={handlePrevPage} disabled={page === 1}>
      ◀️ {t("previous")} {/* Переклад */}
     </button>
     <span>
      {page} / {totalPages}
     </span>
     <button onClick={handleNextPage} disabled={page === totalPages}>
      {t("next")} ▶️ {/* Переклад */}
     </button>
    </div>
   )}
  </div>
 );
}