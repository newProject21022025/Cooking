// src/app/[locale]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl"; // ✅ Додано useLocale
import { fetchDishesApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import PartnersList from "@/components/partners/PartnersList";
import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";
import IngredientCircle from "@/components/ingredientCircle/IngredientCircle";

export default function Home() {
  const t = useTranslations("Home");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getDishes = async () => {
      try {
        const fetchedDishes = await fetchDishesApi();
        setDishes(fetchedDishes);
      } catch (error) {
        console.error("Помилка при завантаженні страв:", error);
      } finally {
        setLoading(false);
      }
    };

    getDishes();
  }, []);

  return (
    <div className={styles.page}>
      <PartnersList />
      <main className={styles.main}>        
        <h1 className={styles.title}>{t("title")}</h1>
        {/* <p className={styles.description}>
          {t("text")}
        </p> */}
        <IngredientFilter />
      </main>
      <IngredientCircle
        name="Vitamin A"
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjEQ_MZwwJHZ8FP-GPP6gfjSf6YFp-PblJWw&s"
        benefits={[
          { text: "Promotes skin health" },
          { text: "Boosts immune health" },
          { text: "Supports eye health" },
          { text: "Vital for organ function" },
          { text: "Strengthens bones" },
          { text: "Improves metabolism" },
          { text: "Improves metabolism" },
        ]}
      />
    </div>
  );
}
