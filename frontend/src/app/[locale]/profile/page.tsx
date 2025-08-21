// src/app/[locale]/profile/page.tsx
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
 const token = localStorage.getItem("access_token");


  useEffect(() => {
    const loadProfile = async () => {
      console.log("==> Завантаження профілю почалося.");
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("==> Токен відсутній. Перехід у неавторизований стан.");
        setError("Ви не авторизовані");
        setLoading(false);
        return;
      }

      try {
        console.log("==> Токен знайдено. Відправка запиту на бекенд...");
        const res = await fetch("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("==> Помилка запиту:", res.status, errorData);
          if (res.status === 401) {
            setError("Сесія завершена. Увійдіть знову.");
            localStorage.removeItem("token");
            return;
          }
          throw new Error(errorData.message || "Не вдалося отримати дані профілю");
        }

        const data = await res.json();
        console.log("==> Дані профілю успішно отримано:", data);
        setUser(data);

      } catch (err: any) {
        console.error("==> Виняток під час завантаження:", err.message);
        setError(err.message || "Помилка завантаження профілю");
      } finally {
        console.log("==> Завантаження завершено. setLoading(false)");
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
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Ім’я:</strong> {user.firstName}
        </p>
        <p>
          <strong>Прізвище:</strong> {user.lastName}
        </p>
        {user.phoneNumber && (
          <p>
            <strong>Телефон:</strong> {user.phoneNumber}
          </p>
        )}
        {user.deliveryAddress && (
          <p>
            <strong>Адреса доставки:</strong> {user.deliveryAddress}
          </p>
        )}
        <p>
          <strong>Роль:</strong> {user.role}
        </p>
        {user.averageRating !== undefined && (
          <p>
            <strong>Середній рейтинг:</strong> {user.averageRating}
          </p>
        )}
      </div>
    </div>
  );
}