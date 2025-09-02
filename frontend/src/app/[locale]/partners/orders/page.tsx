// src/app/[locale]/partners/orders/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Order } from "@/types/order";
import {
  fetchOrdersByPartnerApi,
  updateOrderStatusApi,
  deleteOrderApi,
} from "@/api/orderApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authUser = useSelector((state: RootState) => state.auth.user);
  const partnerId = authUser?.id?.toString(); // завжди string

  useEffect(() => {
    if (!partnerId) return;

    const loadOrders = async () => {
      try {
        const partnerOrders = await fetchOrdersByPartnerApi(partnerId);
        setOrders(partnerOrders);
      } catch (err: any) {
        setError(err.message || "Помилка при завантаженні замовлень");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [partnerId]);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    try {
      const response = await updateOrderStatusApi(orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? response.order : o))
      );
    } catch (err: any) {
      alert("Помилка оновлення статусу: " + err.message);
    }
  };

  const handleDelete = async (orderNumber: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це замовлення?")) return;
    try {
      await deleteOrderApi(orderNumber);
      setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
    } catch (err: any) {
      alert("Помилка видалення замовлення: " + err.message);
    }
  };

  if (loading) return <div className={styles.container}>Завантаження...</div>;
  if (error) return <div className={styles.container}>Помилка: {error}</div>;
  if (!orders.length)
    return <div className={styles.container}>Замовлень ще немає</div>;

  return (
    <div className={styles.container}>
      <h2>Замовлення</h2>
      <ul className={styles.orderList}>
        {orders.map((order) => (
          <li key={order.orderNumber} className={styles.orderItem}>
            <h3>Номер: {order.orderNumber}</h3>
            <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>
            <p>
              Клієнт: {order.firstName} {order.lastName}
            </p>
            <p>Телефон: {order.phone}</p>
            <p>Адреса: {order.address}</p>
            <p>Загальна сума: {order.totalSum} грн</p>
            <p>Статус: {order.status}</p>

            <ul>
              {order.items.map((item) => (
                <li key={item.partnerDishId}>
                  {item.name} — {item.quantity} × {item.price} грн
                </li>
              ))}
            </ul>

            <div className={styles.orderControls}>
              {/* Кнопка "Замовлення" / "Виконано" */}
              <button
                className={styles.completeBtn}
                onClick={() =>
                  handleStatusChange(
                    order.orderNumber,
                    order.status === "completed" ? "created" : "completed"
                  )
                }
              >
                {order.status === "completed" ? "Виконано" : "Замовлення"}
              </button>

              {/* Кнопка видалення */}
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(order.orderNumber)}
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
