// src/components/header/Header.tsx

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import Link from "next/link";
// 🛑 ВАЖЛИВО: Імпортуємо useTranslations та useLocale
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl"; 
import { logout } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import styles from "./Header.module.scss";
import Logo from "@/svg/Logo/Logo";
import Icon_enter from "@/svg/Icon_enter/Icon_enter";
import Icon_heart_empty from "@/svg/Icon_heart/Icon_heart_empty";

// 🛑 HeaderProps більше не потрібен locale, оскільки ми використовуємо useLocale()
type HeaderProps = {}; 

// 🛑 ВИДАЛЯЄМО { locale }: HeaderProps зі вхідних параметрів
export default function Header() {
 // 🛑 Ініціалізуємо useTranslations для секції "Header"
 const t = useTranslations("Header");
 const currentLocale = useLocale();
 
 const [mounted, setMounted] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 const pathname = usePathname();
 const router = useRouter();
 const dispatch = useDispatch<AppDispatch>();

 const { token } = useSelector((state: RootState) => state.auth);
 const isAuthenticated = !!token;

 const { data: profileUser } = useSelector((state: RootState) => state.user);
 const role = profileUser?.role?.toLowerCase();

 useEffect(() => {
  setMounted(true);

  const handleScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 if (!mounted) return <header className={styles.header} />;

 const handleLogout = () => {
  dispatch(logout());
  router.push("/");
 };

 const changeLanguage = (newLocale: string) => {
  // Використовуємо currentLocale з useLocale()
  const currentPathWithoutLocale = pathname.replace(`/${currentLocale}`, ""); 
  router.push(currentPathWithoutLocale, { locale: newLocale as any });
 };

 return (
  <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
   <Link className={styles.menu} href="/menu">
    {t("menu")} {/* 🛑 ПЕРЕКЛАД */}
   </Link>
   <div className={styles.logo}>
    <Link href="/">
     <Logo />
    </Link>
   </div>
   <nav className={styles.navigation}>
    {!isAuthenticated ? (
     <Link href="/login" className={styles.navLink}>
      {t("login")} {/* 🛑 ПЕРЕКЛАД */}
     </Link>
    ) : (
     <>
      {role === "admin" && (
       <>
        <Link href="/profile" className={styles.navLink}>
         <Icon_enter />
        </Link>
        <Link href="/admin" className={styles.navLink}>
         {t("admin")} {/* 🛑 ПЕРЕКЛАД */}
        </Link>
        <Link href="/profile/favorites" className={styles.navLink}>
         <Icon_heart_empty />
        </Link>
       </>
      )}
      {role === "user" && (
       <div>
        <Link href="/profile/favorites" className={styles.navLink}>
         <Icon_heart_empty />
        </Link>
        <Link href="/profile" className={styles.navLink}>
         <Icon_enter />
        </Link>
       </div>
      )}
      {role === "partner" && (
       <Link href="/partners" className={styles.navLink}>
        <Icon_enter />
       </Link>
      )}
      <button onClick={handleLogout} className={styles.navLink}>
       {t("logout")} {/* 🛑 ПЕРЕКЛАД */}
      </button>
     </>
    )}
    <div className={styles.languageSwitcher}>
     <button
      onClick={() => changeLanguage("en")}
      className={`${styles.languageButton} ${
       currentLocale === "en" ? styles.active : ""
      }`}
     >
      EN
     </button>
     <span className={styles.languageSeparator}>|</span>
     <button
      onClick={() => changeLanguage("uk")}
      className={`${styles.languageButton} ${
       currentLocale === "uk" ? styles.active : ""
      }`}
     >
      UK
     </button>
    </div>
   </nav>
  </header>
 );
}