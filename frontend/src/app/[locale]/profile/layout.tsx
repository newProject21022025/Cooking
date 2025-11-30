// src/app/[locale]/profile/layout.tsx
"use client";

import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl"; 
import styles from "./layout.module.scss";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const t = useTranslations("ProfileLayout");

  const router = useRouter();
  const pathname = usePathname();

  // 1. ВИЗНАЧЕННЯ АКТИВНОЇ ВКЛАДКИ НА ОСНОВІ URL
  const activeTab = useMemo(() => {
    // Шлях може бути: "/uk/profile", "/uk/profile/", або "/uk/profile/history"
    const segments = pathname.split('/').filter(segment => segment); // Видаляємо порожні сегменти ('', 'uk')
    
    // Останній сегмент повинен бути або 'profile', 'history', або 'favorites'.
    // Якщо segments = ["uk", "profile", "history"], то lastSegment = "history"
    // Якщо segments = ["uk", "profile"], то lastSegment = "profile"
    const lastSegment = segments[segments.length - 1];

    // Якщо шлях закінчується на /profile або /profile/, останній сегмент = 'profile'.
    if (lastSegment === 'profile' || lastSegment === undefined) {
      return "profile";
    }

    // Перевіряємо інші валідні вкладки
    if (["history", "favorites"].includes(lastSegment)) {
      return lastSegment;
    }
    
    // Якщо жоден з вищезазначених, повертаємо 'profile' як стандартний.
    // Це потрібно для шляхів типу: /uk/profile/
    return "profile";
  }, [pathname]);

  const handleTabClick = (tab: string) => {
    // Next.js правильно обробляє відносний шлях, зберігаючи поточну локаль.
    router.push(`/profile/${tab}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1> 
      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          {/* Профіль та пароль */}
          <button
            className={`${styles.navButton} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("profile")}
          >
            {t("tabProfile")} 
          </button>
          
          {/* Історія замовлень */}
          <button
            className={`${styles.navButton} ${
              activeTab === "history" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("history")}
          >
            {t("tabHistory")} 
          </button>
          
          {/* Улюблені страви */}
          <button
            className={`${styles.navButton} ${
              activeTab === "favorites" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("favorites")}
          >
            {t("tabFavorites")} 
          </button>
        </nav>
        
        {/* Основний контент */}
        <main className={styles.content}>{children}</main> 
      </div>
    </div>
  );
}