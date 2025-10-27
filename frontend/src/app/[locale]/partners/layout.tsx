// src/app/locale/partners/layout.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Припущено, що це правильний шлях
import styles from "./page.module.scss";

const TABS = ["personal", "allDishes", "edit", "orders"];

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // 💡 ДОДАНО: Отримання стану автентифікації та ролі з Redux

  const { token } = useSelector((state: RootState) => state.auth);
  const { data: profileUser } = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!token;
  const isPartner = profileUser?.role?.toLowerCase() === "partner"; // Визначаємо базовий шлях з локаллю

  const loginPath = pathname.startsWith("/en/") ? "/en/login" : "/uk/login";

  const basePath = pathname.startsWith("/en/partners")
    ? "/en/partners"
    : pathname.startsWith("/uk/partners")
    ? "/uk/partners"
    : "/partners";

  useEffect(() => {
    // 1. ПЕРЕВІРКА АВТЕНТИФІКАЦІЇ ТА РОЛІ
    if (!isAuthenticated || !isPartner) {
      // Якщо не залогінений або не партнер, перенаправляємо на сторінку логіну.
      router.replace(loginPath);
      return; // Зупиняємо виконання
    } // 2. РЕДІРЕКТ НА ПІДСТОРІНКУ (тільки якщо автентифікація успішна)

    if (pathname === basePath) {
      router.push(`${basePath}/personal`);
    }
  }, [pathname, router, basePath, isAuthenticated, isPartner, loginPath]); // 3. БЛОКУВАННЯ РЕНДЕРИНГУ

  if (!isAuthenticated || !isPartner) {
    // Не рендеримо вміст, поки не відбулося перенаправлення
    return null;
  } // 💡 Змінено заголовок для сторінки партнерів

  return (
    <div className={styles.container}>
         <h2 className={styles.title}>Панель партнера</h2>  {" "}
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
