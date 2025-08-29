// src/app/[locale]/partners/edit/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPartnerDishes,
  updatePartnerDish,
  deletePartnerDish,
} from "@/redux/slices/partnerDishesSlice";
import styles from "./page.module.scss";
import { useLocale } from "next-intl";

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

  return sessionStorage.getItem("userId") || null;
};

export default function Edit() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.partnerDishes);
  const locale = useLocale();
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // Локальний стейт для редагування
  const [editingValues, setEditingValues] = useState<Record<
    string,
    { price: number; discount: number }
  >>({});

  useEffect(() => {
    const id = getUserIdFromStorage();
    if (id) {
      setPartnerId(id);
      dispatch(fetchPartnerDishes(id));
    }
  }, [dispatch]);

  useEffect(() => {
    // Ініціалізуємо локальний стейт з даних з Redux
    const initialValues: Record<string, { price: number; discount: number }> = {};
    items.forEach((d) => {
      initialValues[d.id] = { price: d.price || 0, discount: d.discount || 0 };
    });
    setEditingValues(initialValues);
  }, [items]);

  const handleInputChange = (id: string, field: "price" | "discount", value: number) => {
    setEditingValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = (id: string) => {
    const values = editingValues[id];
    const dish = items.find((d) => d.id === id);
  
    if (dish && values && partnerId) {
      dispatch(
        updatePartnerDish({
          id,
          dish: {
            partner_id: dish.partner_id || partnerId, // UUID
            dish_id: dish.dish_id,                   // number
            price: values.price,
            discount: values.discount,
            availablePortions: dish.availablePortions ?? 0,
          },
        })
      );
    }
  };
  
  
  const handleDelete = (id: string) => {
    dispatch(deletePartnerDish(id));
  };

  if (!partnerId) return <p className={styles.error}>Не вдалося отримати ID партнера</p>;

  return (
    <div className={styles.container}>
      <h1>Редагування страв</h1>

      {loading ? (
        <p>Завантаження...</p>
      ) : items.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Опис</th>
              <th>Ціна</th>
              <th>Знижка (%)</th>
              <th>Ціна зі знижкою</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((dish) => {
              const { price, discount } = editingValues[dish.id] || { price: 0, discount: 0 };
              const discountPrice = price - (price * discount) / 100;
              return (
                <tr key={dish.id}>
                  <td>{locale === "uk" ? dish.dishes?.name_ua : dish.dishes?.name_en}</td>
                  <td>{locale === "uk" ? dish.dishes?.description_ua : dish.dishes?.description_en}</td>
                  <td>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => handleInputChange(dish.id, "price", +e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => handleInputChange(dish.id, "discount", +e.target.value)}
                    />
                  </td>
                  <td>{discountPrice.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleSave(dish.id)}>Зберегти</button>
                    <button onClick={() => handleDelete(dish.id)}>Видалити</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Немає вибраних страв</p>
      )}
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   fetchPartnerDishes,
//   updatePartnerDish,
//   deletePartnerDish,
// } from "@/redux/slices/partnerDishesSlice";
// import styles from "./page.module.scss";
// import { useLocale } from "next-intl";

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

// export default function Edit() {
//   const dispatch = useAppDispatch();
//   const { items, loading } = useAppSelector((state) => state.partnerDishes);
//   const locale = useLocale();
//   const [partnerId, setPartnerId] = useState<string | null>(null);

//   useEffect(() => {
//     const id = getUserIdFromStorage();
//     if (id) {
//       setPartnerId(id);
//       dispatch(fetchPartnerDishes(id)); // ⚡ передаємо partnerId на бекенд
//     }
//   }, [dispatch]);

//   const handleChange = (id: string, field: string, value: string | number) => {
//     const dish = items.find((d) => d.id === id);
//     if (dish) {
//       dispatch(updatePartnerDish({ id, dish: { ...dish, [field]: value } }));
//     }
//   };

//   const handleDelete = (id: string) => {
//     dispatch(deletePartnerDish(id));
//   };

//   if (!partnerId) {
//     return <p className={styles.error}>Не вдалося отримати ID партнера</p>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1>Редагування страв</h1>

//       {loading ? (
//         <p>Завантаження...</p>
//       ) : items.length > 0 ? (
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Назва</th>
//               <th>Опис</th>
//               <th>Ціна</th>
//               <th>Знижка</th>
//               <th>Дії</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((dish) => (
//               <tr key={dish.id}>
//                 <td>{locale === "uk" ? dish.dishes?.name_ua : dish.dishes?.name_en}</td>
//                 <td>
//                   {locale === "uk"
//                     ? dish.dishes?.description_ua
//                     : dish.dishes?.description_en}
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={dish.price || 0}
//                     onChange={(e) =>
//                       handleChange(dish.id, "price", +e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={dish.discount || 0}
//                     onChange={(e) =>
//                       handleChange(dish.id, "discount", +e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <button onClick={() => handleDelete(dish.id)}>Видалити</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Немає вибраних страв</p>
//       )}
//     </div>
//   );
// }
