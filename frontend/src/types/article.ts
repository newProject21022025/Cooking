// src/types/article.ts

export interface MultiLang {
  ua: string;
  en: string;
}

export interface ArticleBlock {
  title: MultiLang;
  description: MultiLang;
}

export interface Article {
  id: number;
  created_at: string;  
  updated_at?: string;
  title: MultiLang;
  description: MultiLang;
  photo: string;
  blocks: ArticleBlock[];
}

// Payload для створення нової статті
export type CreateArticlePayload = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;

// Payload для оновлення (часткове)
export type UpdateArticlePayload = Partial<CreateArticlePayload>;
