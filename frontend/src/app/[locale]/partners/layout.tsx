// src/app/locale/partners/layout.tsx

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import styles from './page.module.scss'

const TABS = ['personal','edit', 'orders']

export default function AUFLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Визначаємо базовий шлях з локаллю
  const basePath = pathname.startsWith('/en/partners')
    ? '/en/partners'
    : pathname.startsWith('/uk/partners')
    ? '/uk/partners'
    : '/partners'

  useEffect(() => {
    // Редірект на /edit, якщо зайшли на базовий /admin
    if (pathname === basePath) {
      router.push(`${basePath}/personal`)
    }
  }, [pathname, router, basePath])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Адмін-панель</h2>
      <div className={styles.buttonGroup}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => router.push(`${basePath}/${tab}`)}
            className={styles.button}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}

