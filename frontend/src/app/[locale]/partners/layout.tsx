// src/app/[locale]/partners/layout.tsx

"use client";

// 🛑 ВИПРАВЛЕНО: Використовуємо роутер та шлях, обізнані про локаль
import { useRouter, usePathname } from "@/i18n/navigation"; 
import { useTranslations, useLocale } from "next-intl"; 
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import styles from "./page.module.scss";

// Ключі вкладок (Використовуємо lowercase для ключів перекладу)
const TABS = ["personal", "allDishes", "edit", "orders"];

export default function PartnerLayout({ children }: { children: ReactNode }) {
 const router = useRouter();
 const pathname = usePathname(); // Шлях без локалі (наприклад, /partners/personal)
 const locale = useLocale(); // Отримуємо поточну локаль (uk або en)
 const t = useTranslations("PartnerLayout"); // Для перекладу заголовка та вкладок

 // Отримання стану автентифікації та ролі з Redux
 const { token } = useSelector((state: RootState) => state.auth);
 const { data: profileUser } = useSelector((state: RootState) => state.user);
 const isAuthenticated = !!token;
 const isPartner = profileUser?.role?.toLowerCase() === "partner"; 

 // 🛑 ВИПРАВЛЕНО: Базовий шлях тепер не містить локалі, оскільки `router` та `pathname` її автоматично обробляють.
 const basePath = "/partners"; 

 // Шлях для перенаправлення на сторінку логіну
 const loginPath = "/login";

 useEffect(() => {
  // 1. ПЕРЕВІРКА АВТЕНТИФІКАЦІЇ ТА РОЛІ
  if (!isAuthenticated || !isPartner) {
   // Використовуємо router.replace з next-intl/navigation. 
   // Локаль (locale) буде автоматично додана до шляху.
   router.replace(loginPath); 
   return; 
  } 
  
  // 2. РЕДІРЕКТ НА ПІДСТОРІНКУ (тільки якщо поточний шлях /partners)
  // Примітка: pathname, отриманий з next-intl, має виглядати як "/partners"
  if (pathname === basePath) {
   // Використовуємо router.push з next-intl/navigation.
   router.push(`${basePath}/personal`);
  }
 }, [pathname, router, isAuthenticated, isPartner]); // Видалено basePath, loginPath, оскільки вони стали простішими

 // 3. БЛОКУВАННЯ РЕНДЕРИНГУ
 if (!isAuthenticated || !isPartner) {
  return null;
 } 

 return (
  <div className={styles.container}>
   <h2 className={styles.title}>{t("partnerPanelTitle")}</h2>
   <div className={styles.buttonGroup}>
    {TABS.map((tab) => (
     <button
      key={tab}
      // 🛑 ВИПРАВЛЕНО: router.push автоматично додасть поточну локаль
      onClick={() => router.push(`${basePath}/${tab}`)}
      className={`${styles.button} ${
                pathname === `${basePath}/${tab}` ? styles.active : ""
            }`}
     >
      {t(tab)} 
     </button>
    ))}
   </div>
   <div>{children}</div>
  </div>
 );
}