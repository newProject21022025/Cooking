// src/components/header/Header.tsx

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl"; 
import { logout } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import styles from "./Header.module.scss";
import Logo from "@/svg/Logo/Logo";
import Icon_enter from "@/svg/Icon_enter/Icon_enter";
import Icon_heart_empty from "@/svg/Icon_heart/Icon_heart_empty";


type HeaderProps = { locale: "uk" | "en" }; 

// 🛑 ПОВЕРТАЄМО: Приймаємо locale як проп
export default function Header({ locale }: HeaderProps) {
 const t = useTranslations("Header");
 // const currentLocale = useLocale(); // ВИДАЛЯЄМО: використовуємо проп locale

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
  // ВИПРАВЛЕНО: Використовуємо проп locale для коректної заміни в роутері
  router.push(pathname, { locale: newLocale as "uk" | "en" });
 };

 return (
  <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
   <Link className={styles.menu} href="/menu">
    {t("menu")}
   </Link>
   <div className={styles.logo}>
    <Link href="/">
     <Logo />
    </Link>
   </div>
   <nav className={styles.navigation}>
    {!isAuthenticated ? (
     <Link href="/login" className={styles.navLink}>
      {t("login")}
     </Link>
    ) : (
     <>
      {role === "admin" && (
       <>
        <Link href="/profile" className={styles.navLink}>
         <Icon_enter />
        </Link>
        <Link href="/admin" className={styles.navLink}>
         {t("admin")}
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
       {t("logout")}
      </button>
     </>
    )}
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
   </nav>
  </header>
 );
}