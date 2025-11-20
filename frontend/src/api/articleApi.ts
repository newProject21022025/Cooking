// src/api/articleApi.ts

// src/api/articles.ts
import axios from 'axios';

// -----------------------------------------------------------------------------
// 1. ТИПИ ТА ІНТЕРФЕЙСИ (Відповідають вашим DTO)
// -----------------------------------------------------------------------------

export interface MultiLang {
  uk: string;
  en: string;
}

export interface ArticleBlock {
  title: MultiLang;
  description: MultiLang;
}

// Дані для створення/оновлення (без ID)
export interface CreateArticleDto {
  title: MultiLang;
  description: MultiLang;
  photo: string;
  blocks: ArticleBlock[];
}

// Повна сутність статті (з ID та датою, які приходять з БД)
export interface Article extends CreateArticleDto {
  id: number;
  created_at?: string; // Supabase зазвичай повертає це поле
}

// -----------------------------------------------------------------------------
// 2. НАЛАШТУВАННЯ AXIOS
// -----------------------------------------------------------------------------

// const API_URL = 'http://localhost:3000'; // Змініть на ваш URL бекенду
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

const $axios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------------------
// 3. API СЕРВІС
// -----------------------------------------------------------------------------

export const articlesApi = {
  /**
   * Отримати список всіх статей
   */
  async getAll(): Promise<Article[]> {
    const { data } = await $axios.get<Article[]>('/articles');
    return data;
  },

  /**
   * Отримати одну статтю за ID
   */
  async getOne(id: number): Promise<Article> {
    const { data } = await $axios.get<Article>(`/articles/${id}`);
    return data;
  },

  /**
   * Створити нову статтю
   */
  async create(dto: CreateArticleDto): Promise<Article> {
    const { data } = await $axios.post<Article>('/articles', dto);
    return data;
  },

  /**
   * Оновити статтю (можна передавати лише частину полів)
   */
  async update(id: number, dto: Partial<CreateArticleDto>): Promise<Article> {
    const { data } = await $axios.patch<Article>(`/articles/${id}`, dto);
    return data;
  },

  /**
   * Видалити статтю
   */
  async remove(id: number): Promise<{ message: string }> {
    const { data } = await $axios.delete<{ message: string }>(`/articles/${id}`);
    return data;
  },
};