// src/app/[locale]/buyDishes/layout.tsx

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Мапимо назви табів для відображення
const TAB_TITLES: { [key: string]: string } = {
  dishes: "Меню",
  basket: "Кошик",
  info: "Інформація",
};
const TABS = Object.keys(TAB_TITLES); // ["dishes", "basket", "info"]

export default function AUFLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const basePath = pathname.startsWith("/en/buyDishes")
    ? "/en/buyDishes"
    : pathname.startsWith("/uk/buyDishes")
    ? "/uk/buyDishes"
    : "/buyDishes";

  // Визначаємо поточну активну вкладку з URL
  const pathSegments = pathname.split("/");
  const currentTab = pathSegments[pathSegments.length - 1]; // Останній сегмент шляху

  // Редірект на /dishes
  useEffect(() => {
    if (pathname === basePath) {
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
            Відкрийте для себе
            <span className={styles.titleName}>{titleText}</span>
          </h2>
          <p className={styles.subTitle}>
            Дізнайтесь більше про історію, цінності та пропозиції{" "}
          </p>
        </>
      );
    } else {
      // Сторінки "Меню" (dishes) та "Кошик" (basket)
      return (
        <>
          <h2 className={styles.title}>
            Замовлення страв
            <span className={styles.titleName}>{titleText}</span>
          </h2>
          <p className={styles.subTitle}>
            Ми зібрали найсмачніше від наших партнерів - саме для Вас!
          </p>
          <p className={styles.subTitle}>
            Ваша страва вже поруч - оберіть страву та замовте!
          </p>
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* 👈 Рендеримо заголовок залежно від вкладки */}
      {renderHeaderContent()} 
      
      <div className={styles.buttonGroup}>
        {TABS.map((tab) => {
          const isActive = currentTab === tab || (currentTab === 'buyDishes' && tab === 'dishes');
          
          return (
            <button
              key={tab}
              onClick={() =>
                router.push(
                  `${basePath}/${tab}${window.location.search}`
                )
              }
              className={`${styles.button} ${isActive ? styles.buttonActive : ''}`} 
            >
              {TAB_TITLES[tab] || tab.toUpperCase()} 
            </button>
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
}