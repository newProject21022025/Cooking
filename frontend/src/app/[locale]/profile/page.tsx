"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  role: "user" | "partner" | "admin";
  averageRating?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Ви не авторизовані");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Сесія завершена. Увійдіть знову.");
            localStorage.removeItem("access_token");
            setLoading(false);
            return;
          }
          throw new Error("Не вдалося отримати дані користувача");
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Помилка завантаження профілю");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Завантаження профілю...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>Дані користувача відсутні</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профіль користувача</h1>
      <div className={styles.card}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ім’я:</strong> {user.firstName}</p>
        <p><strong>Прізвище:</strong> {user.lastName}</p>
        {user.phoneNumber && <p><strong>Телефон:</strong> {user.phoneNumber}</p>}
        {user.deliveryAddress && <p><strong>Адреса доставки:</strong> {user.deliveryAddress}</p>}
        <p><strong>Роль:</strong> {user.role}</p>
        {user.averageRating !== undefined && (
          <p><strong>Середній рейтинг:</strong> {user.averageRating}</p>
        )}
      </div>
    </div>
  );
}
