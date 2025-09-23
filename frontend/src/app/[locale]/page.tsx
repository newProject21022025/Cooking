// src/app/[locale]/page.tsx
"use client";

// import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl"; // ✅ Додано useLocale
// import { fetchDishesApi } from "@/api/dishesApi";
// import { Dish } from "@/types/dish";
import PartnersList from "@/components/partners/PartnersList";
// import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";
import SelectedDishes from "@/components/selectedDishes/SelectedDishes";


export default function Home() {
  const t = useTranslations("Home");
  // const [dishes, setDishes] = useState<Dish[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const getDishes = async () => {
  //     try {
  //       const fetchedDishes = await fetchDishesApi();
  //       setDishes(fetchedDishes);
  //     } catch (error) {
  //       console.error("Помилка при завантаженні страв:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getDishes();
  // }, []);

  return (
    <div className={styles.page}>
      <PartnersList />
      <main className={styles.main}>        
        <h1 className={styles.title}>{t("title")}</h1>
        <SelectedDishes/> 
        {/* <p className={styles.description}>
          {t("text")}
        </p> */}      
      </main>      
    </div>
  );
}
