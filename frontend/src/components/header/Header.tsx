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

type HeaderProps = { locale: "uk" | "en" };

export default function Header({ locale }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { token, user: authUser } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const role = authUser?.role?.toLowerCase();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className={styles.logo}>
        <Link href="/">Ваш Логотип</Link>
        <Link className={styles.menu} href="/menu">Меню</Link>
      </div>

      <nav className={styles.navigation}>
        {!isAuthenticated ? (
          <Link href="/login" className={styles.navLink}>
            Увійти
          </Link>
        ) : (
          <>
            {role === "admin" && (
              <>
                <Link href="/profile" className={styles.navLink}>Профіль</Link>
                <Link href="/admin" className={styles.navLink}>Адмін</Link>
              </>
            )}

            {role === "user" && (
              <Link href="/profile" className={styles.navLink}>Профіль</Link>
            )}

            {role === "partner" && (
              <Link href="/partners" className={styles.navLink}>Партнери</Link>
            )}

            <button onClick={handleLogout} className={styles.navLink}>
              Вийти
            </button>
          </>
        )}
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





// "use client";

// import { usePathname, Link } from "@/i18n/navigation";
// import styles from "./Header.module.scss";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { logout } from "@/redux/slices/authSlice";
// import type { AppDispatch } from "@/redux/store";


// type HeaderProps = {
//   locale: "en" | "uk";
// };

// export default function Header({ locale }: HeaderProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   // const dispatch = useDispatch();
  
// const dispatch = useDispatch<AppDispatch>()

//   const [scrolled, setScrolled] = useState(false);

//   const { token, user: authUser } = useSelector((state: RootState) => state.auth);
//   const isAuthenticated = !!token;

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push("/login");
//   };

//   const changeLanguage = (newLocale: string) => {
//     const currentPathWithoutLocale = pathname.replace(`/${locale}`, "");
//     window.location.href = `/${newLocale}${currentPathWithoutLocale}`;
//   };

//   const role = authUser?.role?.toLowerCase();

//   return (
//     <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
//       <div className={styles.logo}>
//         <Link href="/">Ваш Логотип</Link>
//       </div>

//       <nav className={styles.navigation}>
//         {!isAuthenticated ? (
//           <Link href="/login" className={styles.navLink}>
//             Увійти
//           </Link>
//         ) : (
//           <>
//             {/* Меню за роллю */}
//             {role === "admin" && (
//               <>
//                 <Link href="/profile" className={styles.navLink}>Профіль</Link>
//                 <Link href="/admin" className={styles.navLink}>Адмін</Link>
//               </>
//             )}

//             {role === "user" && (
//               <Link href="/profile" className={styles.navLink}>Профіль</Link>
//             )}

//             {role === "partner" && (
//               <Link href="/partners" className={styles.navLink}>Партнери</Link>
//             )}

//             <button onClick={handleLogout} className={styles.navLink}>Вийти</button>
//           </>
//         )}
//       </nav>

//       <div className={styles.languageSwitcher}>
//         <button
//           onClick={() => changeLanguage("en")}
//           className={`${styles.languageButton} ${locale === "en" ? styles.active : ""}`}
//         >
//           EN
//         </button>
//         <span className={styles.languageSeparator}>|</span>
//         <button
//           onClick={() => changeLanguage("uk")}
//           className={`${styles.languageButton} ${locale === "uk" ? styles.active : ""}`}
//         >
//           UK
//         </button>
//       </div>
//     </header>
//   );
// }


