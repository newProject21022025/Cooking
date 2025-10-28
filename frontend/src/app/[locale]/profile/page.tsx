// src/app/[locale]/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на страницу профиля по умолчанию
    router.push("/profile/profile");
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px' 
    }}>
      Перенаправлення...
    </div>
  );
}