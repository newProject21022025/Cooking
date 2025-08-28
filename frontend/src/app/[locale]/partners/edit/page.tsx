// src/app/[locale]/partners/edit/page.tsx


"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPartnerDishes,
  updatePartnerDish,
  deletePartnerDish,
} from "@/redux/slices/partnerDishesSlice";
import styles from "./page.module.scss";
import { useLocale } from "next-intl";

export default function Edit() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.partnerDishes);
  const locale = useLocale();

  useEffect(() => {
    dispatch(fetchPartnerDishes());
  }, [dispatch]);

  const handleChange = (id: string, field: string, value: string | number) => {
    const dish = items.find((d) => d.id === id);
    if (dish) {
      dispatch(updatePartnerDish({ id, dish: { ...dish, [field]: value } }));
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deletePartnerDish(id));
  };

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
              <th>Знижка</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((dish) => (
              <tr key={dish.id}>
                <td>
                  {locale === "uk"
                    ? dish.dishes?.name_ua
                    : dish.dishes?.name_en}
                </td>
                <td>
                  {locale === "uk"
                    ? dish.dishes?.description_ua
                    : dish.dishes?.description_en}
                </td>
                <td>
                  <input
                    type="number"
                    value={dish.price || 0}
                    onChange={(e) =>
                      handleChange(dish.id, "price", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={dish.discount || 0}
                    onChange={(e) =>
                      handleChange(dish.id, "discount", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleDelete(dish.id)}>
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Немає вибраних страв</p>
      )}
    </div>
  );
}
