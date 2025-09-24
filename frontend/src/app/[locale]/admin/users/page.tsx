// src/app/[locale]/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { User } from "@/types/user";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser as deleteUserApi,
  searchUsersByEmail, // ✅ Імпортуємо новий API-метод
} from "@/api/usersApi";
import { useTranslations, useLocale } from "next-intl";

export default function UsersPage() {
  const t = useTranslations("adminUsers");
  const locale = useLocale();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // ✅ Стан для пошукового запиту

  // ✅ Оновлена функція для завантаження користувачів з можливістю пошуку
  const loadUsers = async (query = "") => {
    try {
      setLoading(true);
      const data = query
        ? await searchUsersByEmail(query) // Викликаємо пошук, якщо є запит
        : await getAllUsers(); // Інакше завантажуємо всіх користувачів
      setUsers(data);
    } catch (error) {
      console.error(t("fetchError"), error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Блокування/розблокування користувача
  const handleBlockToggle = async (user: User) => {
    if (!user.id) return;
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }
      await loadUsers(searchQuery); // ✅ Оновлюємо список після дії
    } catch (error) {
      console.error(t("statusChangeError"), error);
    }
  };

  // 🔹 Видалення користувача
  const handleDeleteUser = async (userId: string | null | undefined) => {
    if (!userId) return;
    if (!confirm(t("confirmDelete"))) return;

    try {
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // ✅ Не викликаємо loadUsers, оскільки ми вже оновили стан
    } catch (error) {
      console.error(t("deleteError"), error);
    }
  };

  // ✅ Функція для обробки пошуку
  const handleSearch = () => {
    loadUsers(searchQuery);
  };

  // ✅ Функція для скидання пошуку
  const handleClearSearch = () => {
    setSearchQuery("");
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h1>{t("title")}</h1>
      
      {/* ✅ Блок пошуку */}
      <div className={styles.searchContainer}>
        <input
          type="email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchBtn}>
          🔍 {t("search")}
        </button>
        {searchQuery && (
          <button onClick={handleClearSearch} className={styles.clearBtn}>
            ❌
          </button>
        )}
      </div>
      
      {!users.length && !searchQuery ? (
        <div className={styles.emptyMessage}>{t("noUsers")}</div>
      ) : !users.length && searchQuery ? (
        <div className={styles.emptyMessage}>{t("noUsersFound")}</div>
      ) : (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>{t("email")}</th>
              <th>{t("firstName")}</th>
              <th>{t("lastName")}</th>
              <th>{t("role")}</th>
              <th>{t("block")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.email}>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={
                      user.isBlocked ? styles.unblockBtn : styles.blockBtn
                    }
                    disabled={!user.id}
                  >
                    {user.isBlocked ? t("unblock") : t("block")}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className={styles.deleteBtn}
                    disabled={!user.id}
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}