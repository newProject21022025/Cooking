// src/app/[locale]/page.tsx
"use client";

// import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useTranslations, useLocale } from "next-intl"; // ✅ Додано useLocale
// import { fetchDishesApi } from "@/api/dishesApi";
// import { Dish } from "@/types/dish";
import PartnersList from "@/components/partners/PartnersList";
// import IngredientFilter from "@/components/ingredientFilter/IngredientFilter";
import SelectedDishes from "@/components/selectedDishes/SelectedDishes";
import PartnersCard from "@/components/partnersCard/PartnersCard";
import CategoryNavButtons from "@/components/categoryNavButtons/CategoryNavButtons";
import Link from "next/link";
import Icon_Cup from "@/svg/Icon_Cup/Icon_Cup";
import Icon_Time from "@/svg/Icon_Time/Icon_Time";
import Icon_Customers from "@/svg/Icon_Smile/Icon_Smile";
import Icon_Smile from "@/svg/Icon_Smile/Icon_Smile";
import Steps_1 from "@/svg/Steps/Steps_1";
import Steps_2 from "@/svg/Steps/Steps_2";
import Steps_3 from "@/svg/Steps/Steps_3";
import Steps_4 from "@/svg/Steps/Steps_4";

export default function Home() {
  const t = useTranslations("Home");
  // const [dishes, setDishes] = useState<Dish[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const getDishes = async () => {
  //     try {
  //       const fetchedDishes = await fetchDishesApi();
  //       setDishes(fetchedDishes);
  //     } catch (error) {
  //       console.error("Помилка при завантаженні страв:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getDishes();
  // }, []);

  return (
    <div className={styles.page}>
      {/* <PartnersList /> */}
      <main className={styles.main}>
        {/* --------------------------------------------------------------------------- */}
        <section className={styles.general}>
          <div className={styles.generalInfo}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.generalText}>{t("text")}</p>
            <Link className={styles.generalMenu} href="/menu">
              {t("button")}
            </Link>
          </div>

          <div className={styles.generalStats}>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <span className={styles.iconCup}>
                  <Icon_Cup />
                </span>{" "}
                500+
              </h2>
              <p className={styles.statLabel}>{t("recipes")}</p>
            </div>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <Icon_Time /> 50хв
              </h2>
              <p className={styles.statLabel}>{t("time")}</p>
            </div>
            <div className={styles.statBox}>
              <h2 className={styles.statNumber}>
                <Icon_Smile /> 50k+
              </h2>
              <p className={styles.statLabel}>{t("customers")}</p>
            </div>
          </div>
        </section>
        {/* --------------------------------------------------------------------------- */}

        <section className={styles.steps}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Лише
              <span className={styles.numberColor}>4</span>
              кроки до смачної страви
            </h2>
            <p className={styles.subtitle}>
              Зробіть кілька простих кроків, від перегляду меню до замовлення на
              ваш стіл.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {/* Крок 1 */}
            <div className={styles.step}>
              <div className={styles.iconContainer}>
                <Steps_1 />
              </div>
              <div className={styles.textContainer}>
                <span className={styles.stepNumber}>1</span>
                <h3 className={styles.stepTitle}>Введіть інгредієнти</h3>
                <p className={styles.stepDescription}>
                  Вкажіть, що у вас є вдома - і отримайте підбірку рецептів.
                </p>
              </div>
            </div>

            {/* Крок 2 */}
            <div className={styles.step}>
              <div className={styles.iconContainer}>
                <Steps_2 />
              </div>
              <div className={styles.textContainer}>
                <span className={styles.stepNumber}>2</span>
                <h3 className={styles.stepTitle}>Перегляньте меню</h3>
                <p className={styles.stepDescription}>
                  Перейдіть у розділ "Меню" через головне меню сайту або кнопку
                  на банері.
                </p>
              </div>
            </div>

            {/* Крок 3 */}
            <div className={styles.step}>
              <div className={styles.iconContainer}>
                <Steps_3 />
              </div>
              <div className={styles.textContainer}>
                <span className={styles.stepNumber}>3</span>
                <h3 className={styles.stepTitle}>Оберіть дію</h3>
                <p className={styles.stepDescription}>
                  Готуйте за рецептом самостійно або Замовляйте вже готову
                  страву.
                </p>
              </div>
            </div>

            {/* Крок 4 */}
            <div className={styles.step}>
              <div className={styles.iconContainer}>
                <Steps_4 />
              </div>
              <div className={styles.textContainer}>
                <span className={styles.stepNumber}>4</span>
                <h3 className={styles.stepTitle}>Насолоджуйтесь результатом</h3>
                <p className={styles.stepDescription}>
                  Швидко, зручно і смачно!
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* --------------------------------------------------------------------------- */}

        <section className={styles.menu}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Не знаєте, що обрати? Почніть з хітових категорій
              {/* {t("menuTitle")} */}
            </h2>
            <p className={styles.subtitle}>
              Швидкий вибір серед того, що люблять найбільше. Іноді вибір
              занадто великий, і складно зупинитися на чомусь одному. Саме для
              цього ми підготували хітові категорії - страви, які користуються
              найбільшою популярністю. Це перевірені смаки, які обирають знову і
              знову. Якщо сумніваєтесь то почніть з них.
              {/* {t("menuSubtitle")} */}
            </p>
          </div>
          <CategoryNavButtons />
        </section>

        {/* --------------------------------------------------------------------------- */}
        <section className={styles.selectedDishes}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Головна порада від майстра: насолоджуйтесь!
              {/* {t("menuTitle")} */}
            </h2>
            <p className={styles.subtitle}>
              Швидкий вибір серед того, що люблять найбільше. Іноді вибір
              занадто великий, і складно зупинитися на чомусь одному. Саме для
              цього ми підготували хітові категорії - страви, які користуються
              найбільшою популярністю. Це перевірені смаки, які обирають знову і
              знову. Якщо сумніваєтесь то почніть з них.
              {/* {t("menuSubtitle")} */}
            </p>
          </div>
          <SelectedDishes />
        </section>
        {/* --------------------------------------------------------------------------- */}

        <section className={styles.partners}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Де готують найсмачніше
              {/* {t("menuTitle")} */}
            </h2>
            <p className={styles.subtitle}>
              Ми вибрали для Вас заклади, де кожна страва готується з душею,
              увагою до деталей і любов&apos;ю до смаку. Тут не просто їжа - це
              маленькі гастрономічні відкриття, якими можна насолоджуватися
              прямо вдома. Замовляйте улюблене і відчуйте атмосферу ресторану
              без черг та зайвого клопоту
              {/* {t("menuSubtitle")} */}
            </p>
          </div>
          <PartnersCard />
        </section>  
        
        <p className={styles.subtitle}>
              Ми вибрали для Вас заклади, де кожна страва готується з душею,
              увагою до деталей і любов&apos;ю до смаку. Тут не просто їжа - це
              маленькі гастрономічні відкриття, якими можна насолоджуватися
              прямо вдома. Замовляйте улюблене і відчуйте атмосферу ресторану
              без черг та зайвого клопоту
              {/* {t("menuSubtitle")} */}
            </p>
      </main>
    </div>
  );
}
