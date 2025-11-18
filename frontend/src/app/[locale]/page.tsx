// src/app/[locale]/page.tsx
"use client";

import styles from "./page.module.scss";
// Використовуємо useTranslations для декількох просторів імен
import { useTranslations } from "next-intl"; 
import PartnersList from "@/components/partners/PartnersList";
import SelectedDishes from "@/components/selectedDishes/SelectedDishes";
import PartnersCard from "@/components/partnersCard/PartnersCard";
import CategoryNavButtons from "@/components/categoryNavButtons/CategoryNavButtons";
import Link from "next/link";
import Icon_Cup from "@/svg/Icon_Cup/Icon_Cup";
import Icon_Time from "@/svg/Icon_Time/Icon_Time";
import Icon_Smile from "@/svg/Icon_Smile/Icon_Smile";
import Steps_1 from "@/svg/Steps/Steps_1";
import Steps_2 from "@/svg/Steps/Steps_2";
import Steps_3 from "@/svg/Steps/Steps_3";
import Steps_4 from "@/svg/Steps/Steps_4";

export default function Home() {
    // Ініціалізація функції перекладу
    // Використовуємо окремі простори імен для різних секцій
    const t = useTranslations("Home");
    const tSteps = useTranslations("Steps");
    const tMenu = useTranslations("MenuSection");
    const tSelected = useTranslations("SelectedDishesSection");
    const tPartners = useTranslations("PartnersSection");

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {/* --------------------------- ГЛАВНЫЙ БАННЕР --------------------------- */}
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
                                <Icon_Time /> 50{t("minutes")}
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
                {/* ---------------------------------- КРОКИ ---------------------------------- */}
                <section className={styles.steps}>
                    <div className={styles.header}>
                        <h2 className={styles.title} >
                          {tSteps('firstTitle')}
                          <span className={styles.numberColor}>4</span>
                          {tSteps('secondTitle')}
                        </h2>
                        <p className={styles.subtitle}>
                            {tSteps('subtitle')}
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
                                <h3 className={styles.stepTitle}>{tSteps('step1Title')}</h3>
                                <p className={styles.stepDescription}>
                                    {tSteps('step1Description')}
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
                                <h3 className={styles.stepTitle}>{tSteps('step2Title')}</h3>
                                <p className={styles.stepDescription}>
                                    {tSteps('step2Description')}
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
                                <h3 className={styles.stepTitle}>{tSteps('step3Title')}</h3>
                                <p className={styles.stepDescription}>
                                    {tSteps('step3Description')}
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
                                <h3 className={styles.stepTitle}>{tSteps('step4Title')}</h3>
                                <p className={styles.stepDescription}>
                                    {tSteps('step4Description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ---------------------------- КАТЕГОРІЇ (МЕНЮ) ---------------------------- */}

                <section className={styles.menu}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {tMenu("title")}
                        </h2>
                        <p className={styles.subtitle}>
                            {tMenu("subtitle")}
                        </p>
                    </div>
                    <CategoryNavButtons />
                </section>

                {/* ----------------------------- РЕКОМЕНДАЦІЇ ------------------------------ */}
                <section className={styles.selectedDishes}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {tSelected("title")}
                        </h2>
                        <p className={styles.subtitle}>
                            {tSelected("subtitle")}
                        </p>
                    </div>
                    <SelectedDishes />
                </section>
                {/* -------------------------------- ПАРТНЕРИ ------------------------------- */}

                <section className={styles.partners}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {tPartners("title")}
                        </h2>
                        <p className={styles.subtitle}>
                            {tPartners("subtitle")}
                        </p>
                    </div>
                    <PartnersCard />
                </section>
            </main>
        </div>
    );
}