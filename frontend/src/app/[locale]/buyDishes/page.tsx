// src/app/[locale]/buyDishes/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function buyDishes() {
  const router = useRouter();
  const pathname = usePathname();

  const basePath = pathname.startsWith('/en/dishes')
    ? '/en/dishes'
    : pathname.startsWith('/uk/dishes')
    ? '/uk/dishes'
    : '/dishes';

  useEffect(() => {
    router.replace(`${basePath}/dishes`); // краще replace, щоб не додавати в історію
  }, [router, basePath]);

  return <div>Redirecting to admin edit...</div>; // 👈 обов'язково повертаємо React-елемент
}


