// src/app/[locale]/buyDishes/layout.tsx

"use client";

// 🛑 ВИПРАВЛЕНО: Використовуємо next-intl роутер та шлях
import { useRouter } from "@/i18n/navigation"; 
import { usePathname, useSearchParams } from "next/navigation"; // usePathname та useSearchParams з Next.js 13+ залишаємо
import { useTranslations, useLocale } from "next-intl"; // Додаємо useTranslations
import { ReactNode, useEffect } from "react";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Мапимо назви табів для відображення (тепер це ключі перекладу)
// 🛑 ВИПРАВЛЕНО: Використовуємо ключі для TABS
const TABS = ["dishes", "basket", "info"]; 
const TABS_BASE_PATH = "/buyDishes";

export default function AUFLayout({ children }: { children: ReactNode }) {
 // 🛑 ВИПРАВЛЕНО: next-intl useRouter
 const router = useRouter(); 
 // usePathname та useSearchParams з next/navigation працюють нормально у Client Components
 const pathname = usePathname(); 
 const searchParams = useSearchParams();
 const t = useTranslations("BuyDishesLayout"); // Ініціалізація перекладів
 const locale = useLocale();

 // ... (Ваш код Redux та визначення partnerName) ...
 const { partners, selectedPartnerId } = useSelector(
  (state: RootState) => state.partners
 );

 const urlPartnerId = searchParams.get("partnerId");
 const currentPartnerId = urlPartnerId || selectedPartnerId;
 const selectedPartner = partners.find((p) => p.id === currentPartnerId);
 const partnerName = selectedPartner
  ? `${selectedPartner.firstName} ${selectedPartner.lastName}`
  : "";
 const titleText = partnerName ? `${partnerName}` : " ";
 // ... (Кінець коду Redux) ...

 // 🛑 ВИПРАВЛЕНО: Базовий шлях не потребує визначення локалі, оскільки роутер next-intl її обробляє
 const basePath = TABS_BASE_PATH; 

 // Визначаємо поточну активну вкладку з URL
 const pathSegments = pathname.split("/");
 const currentTab = pathSegments[pathSegments.length - 1]; // Останній сегмент шляху

 // Редірект на /dishes
 useEffect(() => {
  // Перевіряємо, чи ми знаходимося на базовому шляху (наприклад, /uk/buyDishes)
  // Порівнюємо шлях без параметрів пошуку
  const currentPathWithoutSearch = pathname.split('?')[0];

  if (currentPathWithoutSearch.endsWith(basePath)) {
   // 🛑 ВИПРАВЛЕНО: router.replace з next-intl/navigation автоматично додасть локаль
   // Використовуємо .search, щоб зберегти partnerId
   router.replace(`${basePath}/dishes${window.location.search}`);
  }
 }, [pathname, router, basePath]);

 /**
 * 💡 Умовний рендеринг заголовків та підзаголовків
 */
 const renderHeaderContent = () => {
  if (currentTab === 'info') {
   // Сторінка "Інформація"
   return (
    <>
     <h2 className={styles.title}>
      {t("infoTitleStart")}
      <span className={styles.titleName}>{titleText}</span>
     </h2>
     <p className={styles.subTitle}>
      {t("infoSubtitle")}
     </p>
    </>
   );
  } else {
   // Сторінки "Меню" (dishes) та "Кошик" (basket)
   return (
    <>
     <h2 className={styles.title}>
      {t("dishesBasketTitleStart")}
      <span className={styles.titleName}>{titleText}</span>
     </h2>
     <p className={styles.subTitle}>
      {t("dishesBasketSubtitle1")}
     </p>
     <p className={styles.subTitle}>
      {t("dishesBasketSubtitle2")}
     </p>
    </>
   );
  }
 };

 return (
  <div className={styles.container}>
   {renderHeaderContent()} 
   
   <div className={styles.buttonGroup}>
    {TABS.map((tab) => {
     // Перевірка active state
     const pathWithoutLocale = pathname.replace(`/${locale}`, '');
     const isActive = pathWithoutLocale === `${basePath}/${tab}`;
     
     return (
      <button
       key={tab}
       onClick={() =>
        // 🛑 ВИПРАВЛЕНО: router.push з next-intl/navigation
        router.push(
         `${basePath}/${tab}${window.location.search}`,
        )
       }
       className={`${styles.button} ${isActive ? styles.buttonActive : ''}`} 
      >
       {t(tab)} 
      </button>
     );
    })}
   </div>
   <div>{children}</div>
  </div>
 );
}