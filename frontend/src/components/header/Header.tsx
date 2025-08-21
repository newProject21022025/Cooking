// src/components/header/Header.tsx

"use client";

import { usePathname, Link } from "@/i18n/navigation";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice"; // ⚡ экшен для выхода

type HeaderProps = {
  locale: "en" | "uk";
};

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [scrolled, setScrolled] = useState(false);

  // ✅ теперь берём токен и юзера из authSlice
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    dispatch(logout()); // ⚡ экшен очистки auth
    router.push("/login");
  };

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
        {!isAuthenticated ? (
          <Link href="/login" className={styles.navLink}>
            Увійти
          </Link>
        ) : (
          <>
            <Link href="/profile" className={styles.navLink}>
              Профіль
            </Link>
            <button onClick={handleLogout} className={styles.navLink}>
              Вийти
            </button>
          </>
        )}

        {/* Остальные ссылки */}
        <Link href="/admin" className={styles.navLink}>
          Адмін
        </Link>
        <Link href="/partners" className={styles.navLink}>
          Партнери
        </Link>
      </nav>

      <div className={styles.languageSwitcher}>
        <button
          onClick={() => changeLanguage("en")}
          className={`${styles.languageButton} ${locale === "en" ? styles.active : ""}`}
        >
          EN
        </button>
        <span className={styles.languageSeparator}>|</span>
        <button
          onClick={() => changeLanguage("uk")}
          className={`${styles.languageButton} ${locale === "uk" ? styles.active : ""}`}
        >
          UK
        </button>
      </div>
    </header>
  );
}
