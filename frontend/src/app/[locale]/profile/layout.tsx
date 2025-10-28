// src/app/[locale]/profile/layout.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./layout.module.scss";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    router.push(`/profile/${tab}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Особистий кабінет</h1>
      
      <div className={styles.layout}>
        {/* Боковая панель с навигацией */}
        <nav className={styles.sidebar}>
          <button
            className={`${styles.navButton} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => handleTabClick("profile")}
          >
            📊 Профіль та пароль
          </button>
          
          <button
            className={`${styles.navButton} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => handleTabClick("history")}
          >
            📖 Історія покупок
          </button>
          
          <button
            className={`${styles.navButton} ${activeTab === "favorites" ? styles.active : ""}`}
            onClick={() => handleTabClick("favorites")}
          >
            ❤️ Улюблені страви
          </button>
        </nav>

        {/* Основной контент */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}