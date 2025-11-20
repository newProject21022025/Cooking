// src/app/[locale]/articles/page.tsx
import React from "react";
import Link from "next/link";
import { articlesApi, Article } from "@/api/articleApi"; 
import styles from "./page.module.scss";

type Locale = "ua" | "en";

// 1. Оновлюємо тип: params тепер Promise
interface PageProps {
  params: Promise<{ locale: string }>;
}

// 2. Прибираємо деструктуризацію з аргументів функції
export default async function Articles(props: PageProps) {
  // 3. Чекаємо (await) на отримання параметрів
  const params = await props.params;
  const { locale } = params;

  let articles: Article[] = [];
  
  try {
    articles = await articlesApi.getAll();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
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
          const title = article.title[currentLocale];

          return (
            <Link 
              key={article.id} 
              href={`/${currentLocale}/articles/${article.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={article.photo} 
                  alt={title} 
                  className={styles.image} 
                  loading="lazy"
                />
              </div>

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