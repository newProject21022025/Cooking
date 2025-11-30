// src/app/[locale]/profile/history/page.tsx
"use client";

import UserHistory from "@/components/userHistory/UserHistory";
import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "@/api/usersApi";
import { User } from "@/types/user";
// ➡️ NEXT-INTL IMPORTS
import { useTranslations } from "next-intl";

export default function PurchaseHistoryPage() {
  // ➡️ Ініціалізація функції перекладу
  const t = useTranslations("PurchaseHistoryPage");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        // ➡️ Переклад повідомлення в консолі
        console.error(t("Errors.loadConsole"), error); 
      }
    };

    loadUser();
  }, [t]); // Додаємо t у залежності для чистоти (хоча t стабільний)

  return (
    <div>
      {/* ➡️ Переклад заголовка */}
      <h2>{t("Title")}</h2>
      {/* ➡️ Переклад опису */}
      <p>{t("Description")}</p>
      
      {user && <UserHistory userId={user.id} />}
    </div>
  );
}