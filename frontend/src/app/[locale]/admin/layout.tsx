// src/app/[locale]/admin/layout.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Припущено, що це правильний шлях
import styles from "./page.module.scss";

const TABS = ["edit", "create", "users", "comments", "partners", "ingredients"];

export default function AUFLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // 💡 ВИПРАВЛЕННЯ: Отримання стану автентифікації та ролі з Redux

  const { token } = useSelector((state: RootState) => state.auth);
  const { data: profileUser } = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!token;
  const isAdmin = profileUser?.role?.toLowerCase() === "admin"; // Визначаємо базовий шлях з локаллю // Припускаємо, що /login знаходиться в корені, а система i18n його автоматично додає.

  const loginPath = pathname.startsWith("/en/") ? "/en/login" : "/uk/login";
  const basePath = pathname.startsWith("/en/admin")
    ? "/en/admin"
    : pathname.startsWith("/uk/admin")
    ? "/uk/admin"
    : "/admin";

  useEffect(() => {
    // 1. ПЕРЕВІРКА АВТЕНТИФІКАЦІЇ ТА РОЛІ
    if (!isAuthenticated || !isAdmin) {
      // Якщо не залогінений або не адмін, перенаправляємо на сторінку логіну.
      router.replace(loginPath);
      return; // Зупиняємо виконання
    } // 2. РЕДІРЕКТ НА ПІДСТОРІНКУ (тільки якщо автентифікація успішна)

    if (pathname === basePath) {
      router.push(`${basePath}/edit`);
    }
  }, [pathname, router, basePath, isAuthenticated, isAdmin, loginPath]); // 3. БЛОКУВАННЯ РЕНДЕРИНГУ

  if (!isAuthenticated || !isAdmin) {
    // Не рендеримо нічого, поки не відбулося перенаправлення
    return null;
  } // Якщо користувач автентифікований та є адміном

  return (
    <div className={styles.container}>
         <h2 className={styles.title}>Адмін-панель</h2>  {" "}
      <div className={styles.buttonGroup}>
           {" "}
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => router.push(`${basePath}/${tab}`)}
            className={styles.button}
          >
                  {tab.toUpperCase()}    {" "}
          </button>
        ))}
          {" "}
      </div>
         <div>{children}</div> {" "}
    </div>
  );
}
