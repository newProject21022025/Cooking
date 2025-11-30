// src/components/userHistory/UserHistory.tsx

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUserHistory } from "@/redux/slices/userHistorySlice";
import styles from "./UserHistory.module.scss";
// ➡️ NEXT-INTL IMPORTS
import { useTranslations } from "next-intl";

interface UserHistoryProps {
  userId?: string | null;
}

export default function UserHistory({ userId }: UserHistoryProps) {
  // ➡️ Ініціалізація функції перекладу
  const t = useTranslations("UserHistory");

  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector(
    (state: RootState) => state.userHistory
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserHistory({ userId }));
    }
  }, [dispatch, userId]);

  // ➡️ Переклад повідомлення про завантаження
  if (loading) return <p>{t("Messages.loading")}</p>;

  if (error) {
    // Якщо 500 (історія відсутня) → показуємо дружнє повідомлення
    if (error.includes("500")) {
      // ➡️ Переклад повідомлення про порожню історію
      return <p>{t("Messages.emptyHistory")}</p>;
    }
    // ➡️ Переклад повідомлення про загальну помилку
    return (
      <p>
        {t("Errors.generalError")}: {error}
      </p>
    );
  }

  // Перевірка на порожню історію, якщо бекенд не повернув 500
  if (history.length === 0) {
    return <p>{t("Messages.emptyHistory")}</p>;
  }

  return (
    <div className={styles.container}>
      {/* <h2>{t("Title")}</h2> */}
      <ul className={styles.historyList}>
        {history.map((order) => (
          <li key={order.orderNumber} className={styles.historyItem}>
            <div className={styles.partnerInfo}>
              {order.partnerPhoto && (
                <img
                  src={order.partnerPhoto}
                  // ⭐️ ЗАЛИШАЄМО ТІЛЬКИ ВАЛІДНИЙ РЯДОК З ШАБЛОНОМ
                  alt={`Фото партнера: ${order.partnerFirstName} ${order.partnerLastName}`}
                  className={styles.partnerPhoto}
                />
              )}
              <h3>
                {order.partnerFirstName} {order.partnerLastName}
              </h3>
            </div>
            {/* ⬇️ ПОЧАТОК ФРАГМЕНТА БЕЗ ПЕРЕКЛАДУ (як на фото) ⬇️ */}
            <div className={styles.orderInfo}>
              <p>
                {/* Жорстко закодований український текст */}
               {t("Fields.orderNumber")}: <strong>{order.orderNumber}</strong>
              </p>
              <p>
                {/* Жорстко закодований український текст */}
                {t("Fields.date")}:{" "}
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </p>
              <div>
                {/* Жорстко закодований український текст */}
                <p>{t("Fields.items")}:</p>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {/* Жорстко закодований український текст (використовуємо 'грн' замість ключа) */}
                      {item.name} x {item.quantity} ={" "}
                      {item.price * item.quantity} грн
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* ⬆️ КІНЕЦЬ ФРАГМЕНТА БЕЗ ПЕРЕКЛАДУ ⬆️ */}
            <div className={styles.orderTotal}>
              <p>
                {/* ➡️ Збережений переклад тексту */}
                {t("Fields.status")}:{" "}
                <strong>{order.status || t("Fields.statusUndefined")}</strong>
              </p>

              <p>
                {/* ➡️ Збережений переклад тексту */}
                {t("Fields.totalSum")}: <strong>{order.totalSum}</strong>{" "}
                {t("Currency")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
