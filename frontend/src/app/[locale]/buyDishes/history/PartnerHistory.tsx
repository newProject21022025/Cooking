// src/app/[locale]/buyDishes/history/PartnerHistory.tsx

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUserHistory } from "@/redux/slices/userHistorySlice";
import styles from "./page.module.scss";

interface PartnerHistoryProps {
  userId: string;
  partnerId: string;
}

export default function PartnerHistory({ userId, partnerId }: PartnerHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector((state: RootState) => state.userHistory);

  useEffect(() => {
    if (userId) {
      // ✅ Тепер передаємо один об'єкт з userId та partnerId
      dispatch(fetchUserHistory({ userId }));
    }
  }, [dispatch, userId]);

  if (loading) return <p>Завантаження історії...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!history.length) return <p>Історія порожня</p>;

  return (
    <div className={styles.container}>
      <h2>Історія замовлень</h2>
      <ul className={styles.historyList}>
        {history.map((order) => (
          <li key={order.orderNumber} className={styles.historyItem}>
            <p>Номер замовлення: {order.orderNumber}</p>
            <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Статус: {order.status || "Не визначено"}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} = {item.price * item.quantity} грн
                </li>
              ))}
            </ul>
            <p>Сума замовлення: {order.totalSum} грн</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
