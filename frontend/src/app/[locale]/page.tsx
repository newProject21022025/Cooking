// src/app/[locale]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl"; // ✅ Додано useLocale
import { fetchDishesApi } from "@/api/dishesApi";
import { Dish } from "@/types/dish";
import Link from "next/link";
import PartnersList from "@/components/partners/PartnersList";
import DishCard from "@/components/dishCard/DishCard";
import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";

// Компонент для відображення однієї страви
// const DishCard = ({ dish }: { dish: Dish }) => {
//   const locale = useLocale(); // ✅ Отримуємо поточну локаль

//   return (
//     <Link href={`/dishes/${dish.id}`} className={styles.dishCard}>
//       <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
//       <div className={styles.dishInfo}>
//         <h3 className={styles.dishTitle}>
//           {locale === "uk" ? dish.name_ua : dish.name_en} {/* ✅ Умовний рендеринг назви */}
//         </h3>
//         <p className={styles.dishDescription}>
//           {locale === "uk" ? dish.description_ua : dish.description_en} {/* ✅ Умовний рендеринг опису */}
//         </p>
//       </div>
//     </Link>
//   );
// };

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
      <main className={styles.main}>
      <PartnersList/>
        <h1 className={styles.title}>{t("title")}</h1>
        {/* <p className={styles.description}>
          {t("text")}
        </p> */}
          <IngredientFilter />
        
        {/* <div className={styles.dishList}>
          {loading ? (
            <p className={styles.loadingMessage}>Завантаження страв...</p>
          ) : (
            dishes.length > 0 ? (
              dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)
            ) : (
              <p className={styles.errorMessage}>Немає доступних страв.</p>
            )
          )}
        </div> */}
        
      </main>
    </div>
  );
}
