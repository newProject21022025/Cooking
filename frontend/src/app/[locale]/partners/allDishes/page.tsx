// src/app/[locale]/partners/allDishes/page.tsx

// "use client";

"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Dish } from "@/types/dish";
import { useLocale } from "next-intl";
import { createPartnerDish, fetchPartnerDishes } from "@/redux/slices/partnerDishesSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// 🔹 Хелпер для отримання userId (partner_id)
const getUserIdFromStorage = (): string | null => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) return storedUserId;

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch (e) {
      console.error("Помилка декодування токена:", e);
    }
  }

  const sessionUserId = sessionStorage.getItem("userId");
  if (sessionUserId) return sessionUserId;

  return null;
};

const DishCard = ({ dish, partnerId }: { dish: Dish; partnerId: string }) => {
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const handleAdd = async () => {
    const newDish = await dispatch(
      createPartnerDish({
        partner_id: partnerId,
        dish_id: Number(dish.id),
        price: 0,
        discount: 0,
        availablePortions: 0,
      })
    ).unwrap();

    // 🔹 Оновлюємо EditPage (Redux) одразу після додавання
    dispatch(fetchPartnerDishes(partnerId));
  };

  return (
    <div className={styles.dishCard}>
      <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
      <div className={styles.dishInfo}>
        <h3>{locale === "uk" ? dish.name_ua : dish.name_en}</h3>
        <p>{locale === "uk" ? dish.description_ua : dish.description_en}</p>
        <button onClick={handleAdd} className={styles.addButton}>
          Додати до меню
        </button>
      </div>
    </div>
  );
};

export default function AllDishesPage() {
  const dispatch = useAppDispatch();
  const { items: dishes, loading, error } = useAppSelector((state) => state.dishes);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDishes());
    const id = getUserIdFromStorage();
    setPartnerId(id);
  }, [dispatch]);

  if (!partnerId) {
    return <p className={styles.error}>Не вдалося отримати ID партнера</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Усі страви</h1>
      {loading && <p>Завантаження...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} partnerId={partnerId} />
        ))}
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import styles from "./page.module.scss";
// import { Dish } from "@/types/dish";
// import { useLocale } from "next-intl";
// import { createPartnerDish } from "@/redux/slices/partnerDishesSlice";
// import { fetchDishes } from "@/redux/slices/dishesSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// // 🔹 Хелпер для отримання userId (partner_id)
// const getUserIdFromStorage = (): string | null => {
//   const storedUserId = localStorage.getItem("userId");
//   if (storedUserId) return storedUserId;

//   const token = localStorage.getItem("token");
//   if (token) {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.id || payload.userId || payload.sub || null;
//     } catch (e) {
//       console.error("Помилка декодування токена:", e);
//     }
//   }

//   const sessionUserId = sessionStorage.getItem("userId");
//   if (sessionUserId) return sessionUserId;

//   return null;
// };

// // Компонент для відображення однієї страви
// const DishCard = ({ dish, partnerId }: { dish: Dish; partnerId: string }) => {
//   const locale = useLocale();
//   const dispatch = useAppDispatch();

//   const handleAdd = () => {
//     if (!partnerId) return;
  
//     dispatch(
//       createPartnerDish({
//         partner_id: partnerId,      // UUID
//         dish_id: Number(dish.id),   // number
//         price: 0,
//         discount: 0,
//         availablePortions: 0,
//       })
//     );
//   };

//   return (
//     <div className={styles.dishCard}>
//       <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
//       <div className={styles.dishInfo}>
//         <h3>{locale === "uk" ? dish.name_ua : dish.name_en}</h3>
//         <p>{locale === "uk" ? dish.description_ua : dish.description_en}</p>
//         <button onClick={handleAdd} className={styles.addButton}>
//           Додати до редагування
//         </button>
//       </div>
//     </div>
//   );
// };

// // Основна сторінка
// export default function AllDishesPage() {
//   const dispatch = useAppDispatch();
//   const { items: dishes, loading, error } = useAppSelector(
//     (state) => state.dishes
//   );
//   const [partnerId, setPartnerId] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(fetchDishes());

//     const id = getUserIdFromStorage();
//     setPartnerId(id);
//   }, [dispatch]);

//   if (!partnerId) {
//     return <p className={styles.error}>Не вдалося отримати ID партнера</p>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1>Усі страви</h1>

//       {loading && <p>Завантаження...</p>}
//       {error && <p className={styles.error}>{error}</p>}

//       <div className={styles.grid}>
//         {dishes.map((dish) => (
//           <DishCard key={dish.id} dish={dish} partnerId={partnerId} />
//         ))}
//       </div>
//     </div>
//   );
// }


