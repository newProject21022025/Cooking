// src/app/[locale]/articles/page.tsx

// src/app/[locale]/articles/page.tsx
import React from "react";
import Link from "next/link";
// Імпортуємо наш об'єкт articlesApi з попереднього кроку
import { articlesApi, Article } from "@/api/articleApi"; 
// import { Article } from "@/types/article"; // Або шлях до ваших типів
import styles from "./page.module.scss";

type Locale = "ua" | "en";

interface PageProps {
  params: { locale: string };
}

export default async function Articles({ params: { locale } }: PageProps) {
  // 1. Отримуємо статті через наш сервіс
  // Важливо: Оскільки це Server Component, ми можемо викликати це напряму
  let articles: Article[] = [];
  
  try {
    articles = await articlesApi.getAll();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    // Тут можна додати відображення помилки, якщо API не працює
  }

  const currentLocale = (locale as Locale) || "ua";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Корисні статті</h1>
        <p className={styles.subtitle}>Читайте про найцікавіше зі світу кулінарії</p>
      </header>

      <div className={styles.grid}>
        {articles.map((article) => {
          // Отримуємо заголовок поточною мовою
          const title = article.title[currentLocale];

          return (
            <Link 
              key={article.id} 
              href={`/${currentLocale}/articles/${article.id}`}
              className={styles.card}
            >
              {/* Обгортка для фото */}
              <div className={styles.imageWrapper}>
                <img 
                  src={article.photo} 
                  alt={title} 
                  className={styles.image} 
                  loading="lazy"
                />
              </div>

              {/* Назва статті */}
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
      
      {articles.length === 0 && (
        <div className={styles.empty}>На жаль, статті поки відсутні.</div>
      )}
    </div>
  );
}


// import React from "react";
// import Link from "next/link";
// import { fetchAllArticles } from "@/api/articleApi";
// import { Article } from "@/types/article";
// import styles from "./page.module.scss";

// // Типізація для ключів перекладу (на основі вашого коду)
// type Locale = "ua" | "en"; // Додайте інші мови, якщо є

// export default async function Articles({
//   params: { locale },
// }: {
//   params: { locale: string };
// }) {
//   // 1. Отримуємо всі статті
//   const articles = await fetchAllArticles();
  
//   // Використовуємо поточну локаль або дефолтну "ua"
//   const currentLocale = (locale as Locale) || "ua";

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h2 className={styles.pageTitle}>Корисні статті</h2>
//         <p className={styles.pageSubtitle}>Натхнення для щоденних кулінарних відкриттів</p>
//       </div>

//       <div className={styles.articlesList}>
//         {articles.map((article: Article) => {
//           // Отримуємо перекладені дані
//           const title = article.title[currentLocale as keyof typeof article.title];
//           const description = article.description[currentLocale as keyof typeof article.description];

//           return (
//             <article key={article.id} className={styles.articleCard}>
//               {/* Заголовок та опис над фото */}
//               <div className={styles.textInfo}>
//                 <h3 className={styles.articleTitle}>{title}</h3>
//                 <p className={styles.articleDescription}>{description}</p>
//               </div>

//               {/* Контейнер для фото та кнопки */}
//               <div className={styles.imageWrapper}>
//                 <img 
//                   src={article.photo} 
//                   alt={typeof title === 'string' ? title : 'Article image'} 
//                   className={styles.articleImage} 
//                 />
                
//                 {/* Кнопка посилання */}
//                 <Link 
//                   href={`/${locale}/articles/${article.id}`} 
//                   className={styles.readButton}
//                 >
//                   Читати статтю
//                 </Link>
//               </div>
              
//               {/* Декоративна лінія (як на скріншоті) */}
//               <div className={styles.separator}></div>
//             </article>
//           );
//         })}
//       </div>
//     </div>
//   );
// }