// src/components/header/Header.tsx

"use client";

import { usePathname, useRouter, Link } from "@/i18n/navigation";
// import { useTranslations } from "next-intl";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";

type HeaderProps = {
  locale: "en" | "uk";
};

export default function Header({ locale }: HeaderProps) {
//   const t = useTranslations("Header");
  const pathname = usePathname();
//   const router = useRouter();
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
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '');    
    window.location.href = `/${newLocale}${currentPathWithoutLocale}`;
  };

  

  return (
    <>
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
              
    </>
  );
}