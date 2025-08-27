// src/app/locale/partners/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();
  const pathname = usePathname();

  const basePath = pathname.startsWith('/en/partners')
    ? '/en/partners'
    : pathname.startsWith('/uk/partners')
    ? '/uk/partners'
    : '/partners';

  useEffect(() => {
    router.replace(`${basePath}/personal`); // краще replace, щоб не додавати в історію
  }, [router, basePath]);

  return <div>Redirecting to admin edit...</div>; // 👈 обов'язково повертаємо React-елемент
}


