// src/components/userHistory/UserHistory.tsx

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUserHistory } from "@/redux/slices/userHistorySlice";
import styles from "./UserHistory.module.scss";

interface UserHistoryProps {
  userId?: string | null;
}

export default function UserHistory({ userId }: UserHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector(
    (state: RootState) => state.userHistory
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserHistory({ userId }));
    }
  }, [dispatch, userId]);

  if (loading) return <p>Завантаження історії...</p>;
  if (error) {
    // Якщо 500 (історія відсутня) → показуємо дружнє повідомлення
    if (error.includes("500")) {
      return <p>Історія замовлень порожня</p>;
    }
    return <p>Помилка: {error}</p>;
  }

  return (
    <div className={styles.container}>
      {/* <h2>Історія замовлень</h2> */}
      <ul className={styles.historyList}>
        {history.map((order) => (
          <li key={order.orderNumber} className={styles.historyItem}>
            <div className={styles.partnerInfo}>
              {order.partnerPhoto && (
                <img
                  src={order.partnerPhoto}
                  alt={`${order.partnerFirstName} ${order.partnerLastName}`}
                  className={styles.partnerPhoto}
                />
              )}
              <h3>
                {order.partnerFirstName} {order.partnerLastName}
              </h3>
            </div>
            <div className={styles.orderInfo}>
              <p>
                Номер замовлення: <strong>{order.orderNumber}</strong>
              </p>
              <p>
                Дата:{" "}
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </p>
              <div>
                <p>Страви:</p>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity} ={" "}
                      {item.price * item.quantity} грн
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.orderTotal}>
              <p>
                Статус: <strong>{order.status || "Не визначено"}</strong>
              </p>

              <p>
                Сума замовлення: <strong>{order.totalSum}</strong> грн
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
