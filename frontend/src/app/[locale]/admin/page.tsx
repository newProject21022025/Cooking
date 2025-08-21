// src/app/admin/page.tsx


'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AUFRootRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  const basePath = pathname.startsWith('/en/admin')
    ? '/en/admin'
    : pathname.startsWith('/uk/admin')
    ? '/uk/admin'
    : '/admin';

  useEffect(() => {
    router.push(`${basePath}/edit`);
  }, [router, basePath]);

  return null;
}