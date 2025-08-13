// src/app/[locale]/layout.tsx

import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/header/Header";
import "../styles/globals.scss"; // Your global styles file (ensure the path is correct)

import { ReduxProvider } from "@/providers/ReduxProvider"; // Import the new ReduxProvider wrapper

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // await params is correct here for next-intl

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // ✨ Асинхронно загружаем сообщения для текущей локали
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback или обработка ошибки, если файл переводов не найден
    console.error(`Could not load messages for locale ${locale}:`, error);
    notFound(); // Или используйте запасной язык / пустые сообщения
  }

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          {/* ✨ Передаем загруженные сообщения в NextIntlClientProvider */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header locale={locale} />
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

// import { routing } from "@/i18n/routing";
// import { hasLocale, NextIntlClientProvider } from "next-intl";
// import { notFound } from "next/navigation";
// import { ReactNode } from "react";
// import Header from "@/components/header/Header";
// // import Footer from "@/components/footer/Footer";
// // import ScrollToTopOnNavigation from "@/components/scrollToTopOnNavigation/ScrollToTopOnNavigation";
// import "../styles/globals.scss";
// // import { ReduxProvider } from "@/providers/ReduxProvider";
// // import { UserLoader } from "../../redux/UserLoader";
// // import { LogVisitClient } from "./LogVisitClient"; // 📌 Імпортуємо компонент логування

// type Props = {
//   children: ReactNode;
//   params: Promise<{ locale: string }>;
// };

// export default async function LocaleLayout({ children, params }: Props) {
//   const { locale } = await params;
//   if (!hasLocale(routing.locales, locale)) {
//     notFound();
//   }

//   return (
//     <html lang={locale}>
//       {/* <head>
//         <title>next-intl-bug-repro-app-router</title>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link
//           rel="preconnect"
//           href="https://fonts.gstatic.com"
//           crossOrigin="anonymous"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Poppins:wght@400;500;600;700&family=Mea+Culpa&display=swap"
//           rel="stylesheet"
//         />
//       </head> */}
//       <body>
//         {/* <ReduxProvider>
//           <UserLoader />
//           <LogVisitClient /> */}
//           <NextIntlClientProvider locale={locale}>
//             <Header locale={locale} />
//             {children}
//             {/* <ScrollToTopOnNavigation />
//             <Footer /> */}
//           </NextIntlClientProvider>
//         {/* </ReduxProvider> */}
//       </body>
//     </html>
//   );
// }
