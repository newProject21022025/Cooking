// src/app/[locale]/buyDishes/history/PartnerHistory.tsx

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerHistory } from "@/redux/slices/partnerHistorySlice";
import styles from "./page.module.scss";

interface PartnerHistoryProps {
  partnerId: string;
  userId: string;
}

export default function PartnerHistory({ partnerId, userId }: PartnerHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector((state: RootState) => state.history);

  useEffect(() => {
    dispatch(fetchPartnerHistory({ partnerId, userId }));
  }, [dispatch, partnerId, userId]);

  if (loading) return <p>Завантаження історії...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!history.length) return <p>Історія порожня</p>;

  return (
    <div className={styles.container}>
      <h2>Історія замовлень</h2>
      <ul className={styles.historyList}>
        {history.map((order) => (
          <li key={order.orderId} className={styles.historyItem}>
            <p>Номер замовлення: {order.orderId}</p>
            <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Статус: {order.status}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} = {item.price * item.quantity} грн
                </li>
              ))}
            </ul>
            <p>Сума замовлення: {order.totalPrice} грн</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
