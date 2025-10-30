// src/app/[locale]/profile/history/page.tsx
"use client";

import UserHistory from "@/components/userHistory/UserHistory";
import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "@/api/usersApi";
import { User } from "@/types/user";

export default function PurchaseHistoryPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Помилка завантаження користувача:", error);
      }
    };

    loadUser();
  }, []);

  return (
    <div>
      <h2>Історія замовлень</h2>
      <p>Дивіться свої попередні замовлення та замовляйте знову.</p>
      
      {user && <UserHistory userId={user.id} />}
    </div>
  );
}