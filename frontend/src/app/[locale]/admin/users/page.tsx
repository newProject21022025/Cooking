// src/app/[locale]/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { User } from "@/types/user";
import { getAllUsers, blockUser, unblockUser } from "@/api/usersApi";
import { useTranslations, useLocale } from "next-intl";

interface UsersPageProps {
  params: { locale: string };
}

export default function UsersPage({ params }: UsersPageProps) {
  // const locale = params.locale; // ❌ не мутуємо params, просто копіюємо
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();
  // const t = useTranslations("UsersPage");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(); // API запит з токеном
      setUsers(data);
    } catch (error) {
      console.error("Помилка при отриманні користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (user: User) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.id!);
      } else {
        await blockUser(user.id!);
      }
      await fetchUsers(); // оновлюємо список після зміни
    } catch (error) {
      console.error("Помилка при зміні статусу:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Завантаження користувачів...</div>;

  return (
    <div className={styles.container}>
      <h1>Користувачі</h1>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Ім’я</th>
            <th>Прізвище</th>
            <th>Роль</th>
            <th>Блокування</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleBlockToggle(user)}
                  className={user.isBlocked ? styles.unblockBtn : styles.blockBtn}
                >
                  {user.isBlocked ? "Розблокувати" : "Заблокувати"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
