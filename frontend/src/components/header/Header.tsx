// src/components/header/Header.tsx

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import { logout } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import styles from "./Header.module.scss";
import Logo from "@/svg/Logo/Logo";

type HeaderProps = { locale: "uk" | "en" };

export default function Header({ locale }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // 💡 ВИПРАВЛЕНО: Отримуємо лише токен для перевірки автентифікації (з authSlice)

  const { token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token; // 💡 ВИПРАВЛЕНО: Отримуємо актуальні дані користувача (для ролі) з userSlice

  const { data: profileUser } = useSelector((state: RootState) => state.user);
  const role = profileUser?.role?.toLowerCase();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Очікуємо mounted перед рендерингом вмісту, щоб уникнути помилок гідратації

  if (!mounted) return <header className={styles.header} />;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const changeLanguage = (newLocale: string) => {
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "");
    window.location.href = `/${newLocale}${currentPathWithoutLocale}`;
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      {" "}
      <Link className={styles.menu} href="/menu">
        Меню{" "}
      </Link>{" "}
      <div className={styles.logo}>
        {" "}
        <Link href="/">
          <Logo />{" "}
        </Link>{" "}
      </div>{" "}
      <nav className={styles.navigation}>
        {" "}
        {!isAuthenticated ? (
          <Link href="/login" className={styles.navLink}>
            Увійти{" "}
          </Link>
        ) : (
          <>
            {" "}
            {/* Тепер використовуємо role з profileUser (state.user) */}{" "}
            {role === "admin" && (
              <>
                {" "}
                <Link href="/profile" className={styles.navLink}>
                  Профіль{" "}
                </Link>{" "}
                <Link href="/admin" className={styles.navLink}>
                  Адмін{" "}
                </Link>{" "}
              </>
            )}{" "}
            {role === "user" && (
              <Link href="/profile" className={styles.navLink}>
                Профіль{" "}
              </Link>
            )}{" "}
            {role === "partner" && (
              <Link href="/partners" className={styles.navLink}>
                Партнери{" "}
              </Link>
            )}{" "}
            {/* Кнопка Вийти відображається, якщо isAuthenticated = true (тобто є токен) */}{" "}
            <button onClick={handleLogout} className={styles.navLink}>
              Вийти{" "}
            </button>{" "}
          </>
        )}{" "}
        <div className={styles.languageSwitcher}>
          {" "}
          <button
            onClick={() => changeLanguage("en")}
            className={`${styles.languageButton} ${
              locale === "en" ? styles.active : ""
            }`}
          >
            EN{" "}
          </button>
          <span className={styles.languageSeparator}>|</span>{" "}
          <button
            onClick={() => changeLanguage("uk")}
            className={`${styles.languageButton} ${
              locale === "uk" ? styles.active : ""
            }`}
          >
            UK{" "}
          </button>{" "}
        </div>{" "}
      </nav>{" "}
    </header>
  );
}
