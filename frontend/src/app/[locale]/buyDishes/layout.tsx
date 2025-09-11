// src/app/[locale]/buyDishes/layout.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import styles from "./page.module.scss";

const TABS = ["dishes", "basket", "info"];

export default function AUFLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Визначаємо базовий шлях (buyDishes з локаллю)
  const basePath = pathname.startsWith("/en/buyDishes")
    ? "/en/buyDishes"
    : pathname.startsWith("/uk/buyDishes")
    ? "/uk/buyDishes"
    : "/buyDishes";

  // Якщо користувач просто на /buyDishes → редіректимо на /buyDishes/dishes
  useEffect(() => {
    if (pathname === basePath) {
      router.replace(`${basePath}/dishes${window.location.search}`);

    }
  }, [pathname, router, basePath]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Замовлення блюд</h2>
      <div className={styles.buttonGroup}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              router.push(
                `${basePath}/${tab}${window.location.search}` // 👈 додаємо query з адреси
              )
            }
            className={styles.button}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
