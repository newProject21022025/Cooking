// src/components/header/Header.tsx

"use client";

import { usePathname, Link } from "@/i18n/navigation";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";

type HeaderProps = {
  locale: "en" | "uk";
};

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (newLocale: string) => {
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "");
    window.location.href = `/${newLocale}${currentPathWithoutLocale}`;
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link href="/">Ваш Логотип</Link>
      </div>

      <nav className={styles.navigation}>
        <Link href="/login" className={styles.navLink}>
          Увійти
        </Link>
        <Link href="/admin" className={styles.navLink}>
          Адмін
        </Link>
        <Link href="/partners" className={styles.navLink}>
          Партнери
        </Link>
        <Link href="/profile" className={styles.navLink}>
          Профіль користувача
        </Link>
      </nav>

      <div className={styles.languageSwitcher}>
        <button
          onClick={() => changeLanguage("en")}
          className={`${styles.languageButton} ${
            locale === "en" ? styles.active : ""
          }`}
        >
          EN
        </button>
        <span className={styles.languageSeparator}>|</span>
        <button
          onClick={() => changeLanguage("uk")}
          className={`${styles.languageButton} ${
            locale === "uk" ? styles.active : ""
          }`}
        >
          UK
        </button>
      </div>
    </header>
  );
}
