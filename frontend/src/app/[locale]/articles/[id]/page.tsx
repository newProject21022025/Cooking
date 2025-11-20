// // src/app/[locale]/articles/[id]/page.tsx
import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}


// import { fetchArticleById } from "@/api/articleApi";
// import { Article, ArticleBlock } from "@/types/article";

// async function getArticle(id: number) {
//   const article = await fetchArticleById(id);
//   return article;
// }

// const currentLocale = "ua";

// export default async function ArticlePage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const article = await getArticle(Number(params.id));

//   const title = article.title[currentLocale as keyof Article["title"]];
//   const introDescription =
//     article.description[currentLocale as keyof Article["description"]];

//   return (
//     <article>
//       <h1>{title}</h1>

//       <img src={article.photo} alt={title} className="article-main-photo" />

//       <p className="article-intro">{introDescription}</p>

//       <section className="article-content">
//         {article.blocks.map((block, index) => (
//           <div key={index} className="content-block">
//             <h2>{block.title[currentLocale as keyof ArticleBlock["title"]]}</h2>
//             <p>
//               {
//                 block.description[
//                   currentLocale as keyof ArticleBlock["description"]
//                 ]
//               }
//             </p>
//           </div>
//         ))}
//       </section>
//     </article>
//   );
// }
