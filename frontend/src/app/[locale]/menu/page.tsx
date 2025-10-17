// src/app/[locale]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl";
import { fetchDishesApi } from "@/api/dishesApi";
import { Dish, Ingredient } from "@/types/dish";
import PartnersList from "@/components/partners/PartnersList";
import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";

export default function Menu() {
  const t = useTranslations("Menu");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getDishes = async () => {
      try {
        const response = await fetchDishesApi(); // Тепер це повна відповідь з пагінацією

        // 🔑 ВИПРАВЛЕННЯ: Беремо масив страв із властивості 'data'
        setDishes(response.data);
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
        {" "}
        {/* <h1 className={styles.title}>{t("title")}</h1> */}
        {/* <p className={styles.description}>
          {t("text")}
        </p> */}
        <IngredientFilter />
      </main>{" "}
    </div>
  );
}

// // src/app/[locale]/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import styles from "./page.module.scss";
// import { useTranslations, useLocale } from "next-intl"; // ✅ Додано useLocale
// import { fetchDishesApi } from "@/api/dishesApi";
// import { Dish, Ingredient } from "@/types/dish";
// import PartnersList from "@/components/partners/PartnersList";
// import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";

// export default function Menu() {
//   const t = useTranslations("Menu");
//   const [dishes, setDishes] = useState<Dish[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const getDishes = async () => {
//       try {
//         const fetchedDishes = await fetchDishesApi();
//         setDishes(fetchedDishes);
//       } catch (error) {
//         console.error("Помилка при завантаженні страв:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getDishes();
//   }, []);

//   return (
//     <div className={styles.page}>
//       <PartnersList />
//       <main className={styles.main}>
//         <h1 className={styles.title}>{t("title")}</h1>
//         {/* <p className={styles.description}>
//           {t("text")}
//         </p> */}
//         <IngredientFilter />
//       </main>
//     </div>
//   );
// }
