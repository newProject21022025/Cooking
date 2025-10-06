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
import PartnersCard from "@/components/partnersCard/PartnersCard";
import CategoryNavButtons from "@/components/categoryNavButtons/CategoryNavButtons";
import Link from "next/link";
import Icon_Cup from "@/svg/Icon_Cup/Icon_Cup";
import Icon_Time from "@/svg/Icon_Time/Icon_Time";
import Icon_Customers from "@/svg/Icon_Smile/Icon_Smile";
import Icon_Smile from "@/svg/Icon_Smile/Icon_Smile";

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
      {/* <PartnersList /> */}
      <main className={styles.main}>
        {/* --------------------------------------------------------------------------- */}
        <section className={styles.general}>
          <div className={styles.generalInfo}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.generalText}>{t("text")}</p>
            <Link className={styles.generalMenu} href="/menu">
              {t("button")}
            </Link>
          </div>

          <div className={styles.generalStats}>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <span className={styles.iconCup}>
                  <Icon_Cup />
                </span>{" "}
                500+
              </h2>
              <p className={styles.statLabel}>{t("recipes")}</p>
            </div>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <Icon_Time /> 50хв
              </h2>
              <p className={styles.statLabel}>{t("time")}</p>
            </div>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <Icon_Smile /> 50k+
              </h2>
              <p className={styles.statLabel}>{t("customers")}</p>
            </div>
          </div>
        </section>
        {/* --------------------------------------------------------------------------- */}

        <SelectedDishes />

        <CategoryNavButtons />
        <div>
          {" "}
          <PartnersCard />
        </div>
      </main>
    </div>
  );
}
