// src/app/[locale]/profile/layout.tsx
"use client";

import { useState, useMemo } from "react"; // ✅ Додаємо useMemo
import { useRouter, usePathname } from "next/navigation"; // ✅ Додаємо usePathname
import styles from "./layout.module.scss";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Отримуємо поточний шлях // 1. ВИЗНАЧЕННЯ АКТИВНОЇ ВКЛАДКИ НА ОСНОВІ URL

  const activeTab = useMemo(() => {
    // Шлях матиме вигляд, наприклад: /uk/profile/favorites
    const segments = pathname.split("/"); // Останній сегмент (наприклад, 'favorites', 'history', 'profile')
    const currentSegment = segments[segments.length - 1]; // Забезпечуємо, що ми повертаємо одну з валідних вкладок. // Якщо останній сегмент - 'profile' або порожній (коли /profile), // або якщо це взагалі не сторінка профілю, повертаємо 'profile' за замовчуванням.
    if (["profile", "history", "favorites"].includes(currentSegment)) {
      return currentSegment;
    } // Для кореневого шляху профілю (/uk/profile) або будь-якого іншого невідомого шляху

    return "profile";
  }, [pathname]); // Перераховуємо лише при зміні шляху // 2. Локальний стан більше не потрібен, але ми залишаємо handleTabClick для навігації // const [activeTab, setActiveTab] = useState("profile"); // ❌ ВИДАЛЯЄМО

  const handleTabClick = (tab: string) => {
    // setActiveTab(tab); // ❌ НЕ ПОТРІБНО, оновлюється через URL
    // Примітка: router.push сам оновив шлях, що, в свою чергу,
    // оновлює activeTab через useMemo.
    router.push(`/profile/${tab}`);
  };

  return (
    <div className={styles.container}>
         <h1 className={styles.title}>Особистий кабінет</h1>     
      <div className={styles.layout}>
            {/* Боковая панель с навигацией */}   
        <nav className={styles.sidebar}>
               {/* Тепер activeTab коректно відображає поточний URL */} 
            
          <button
            className={`${styles.navButton} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("profile")}
          >
                   Профіль та пароль     
          </button>
                   
          <button
            className={`${styles.navButton} ${
              activeTab === "history" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("history")}
          >
                   Історія замовлень     
          </button>
                   
          <button
            className={`${styles.navButton} ${
              activeTab === "favorites" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("favorites")}
          >
                   Улюблені страви     
          </button>
             
        </nav>
            {/* Основной контент */}   
        <main className={styles.content}>     {children}    </main> 
        
      </div>
       
    </div>
  );
}
