// src/app/[locale]/admin/layout.tsx

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import styles from './page.module.scss'

const TABS = ['edit', 'create', 'users', 'partners']

export default function AUFLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Визначаємо базовий шлях з локаллю
  const basePath = pathname.startsWith('/en/admin')
    ? '/en/admin'
    : pathname.startsWith('/uk/admin')
    ? '/uk/admin'
    : '/admin'

  useEffect(() => {
    // Редірект на /edit, якщо зайшли на базовий /admin
    if (pathname === basePath) {
      router.push(`${basePath}/edit`)
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


// 'use client'


// import { useRouter, usePathname } from 'next/navigation'
// import { ReactNode, useEffect } from 'react'
// import styles from './page.module.scss'

// const TABS = ['edit', 'create', 'users', 'partners']

// export default function AUFLayout({ children }: { children: ReactNode }) {
//   const router = useRouter()
//   const pathname = usePathname()

//   // Визначаємо базовий шлях (з локаллю)
//   const basePath = pathname.startsWith('/en/admin')
//     ? '/en/admin'
//     : pathname.startsWith('/uk/admin')
//     ? '/uk/admin'
//     : '/admin'

//   useEffect(() => {
//     // Редірект на tab1, якщо просто /adminUrbanFusion
//     if (pathname === basePath) {
//       router.push(`${basePath}/edit`)
//     }
//   }, [pathname, router, basePath])

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Перемикач вкладок</h2>
//       <div className={styles.buttonGroup}>
//         {TABS.map(tab => (
//           <button
//             key={tab}
//             onClick={() => router.push(`${basePath}/${tab}`)}
//             className={styles.button}
//           >
//             {tab.toUpperCase()}
//           </button>
//         ))}
//       </div>
//       <div>{children}</div>
//     </div>
//   )
// }