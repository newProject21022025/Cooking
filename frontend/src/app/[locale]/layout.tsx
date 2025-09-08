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
  // const { locale } = await params; // await params is correct here for next-intl
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    
    console.error(`Could not load messages for locale ${locale}:`, error);
    notFound(); 
  }

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header locale={locale} />
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
