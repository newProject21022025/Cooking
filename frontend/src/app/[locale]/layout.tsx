// src/app/[locale]/layout.tsx

import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/header/Header";
// import Footer from "@/components/footer/Footer";
// import ScrollToTopOnNavigation from "@/components/scrollToTopOnNavigation/ScrollToTopOnNavigation";
import "../styles/globals.css";
// import { ReduxProvider } from "@/providers/ReduxProvider";
// import { UserLoader } from "../../redux/UserLoader";
// import { LogVisitClient } from "./LogVisitClient"; // 📌 Імпортуємо компонент логування

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      {/* <head>
        <title>next-intl-bug-repro-app-router</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Poppins:wght@400;500;600;700&family=Mea+Culpa&display=swap"
          rel="stylesheet"
        />
      </head> */}
      <body>
        {/* <ReduxProvider>
          <UserLoader />
          <LogVisitClient /> */}
          <NextIntlClientProvider locale={locale}>
            <Header locale={locale} />            
            {children}
            {/* <ScrollToTopOnNavigation />
            <Footer /> */}
          </NextIntlClientProvider>
        {/* </ReduxProvider> */}
      </body>
    </html>
  );
}


