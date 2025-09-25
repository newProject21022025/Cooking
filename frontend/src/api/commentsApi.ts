// src/api/commentsApi.ts

import axios, { AxiosInstance } from 'axios';

// Інтерфейси для коментарів
interface AddCommentPayload {
  dish_id: number;
  comment_text: string;
  rating?: number;
}

// Оновлюємо інтерфейс, щоб він включав вкладені дані користувача та страви
export interface Comment {
  id: number;
  dish_id: number;
  user_id: string;
  comment_text: string;
  rating?: number;
  created_at: string;
  // Додаємо вкладені об'єкти, які ми очікуємо отримати від бекенду
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  dish: {
    id: number;
    name_ua: string;
    name_en: string;
    photo: string;
  };
}

// ✅ Налаштовуємо екземпляр axios для повторного використання
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Додає JWT-токен до заголовків усіх наступних запитів.
 * @param token JWT-токен.
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Додає новий коментар до страви.
 * @param payload Дані коментаря (id страви, текст, рейтинг).
 * @returns Об'єкт створеного коментаря.
 */
export const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
  try {
    const response = await api.post('/dishes/comment', payload);
    return response.data;
  } catch (error) {
    // Обробка помилок Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Не вдалося додати коментар.');
    }
    throw new Error('Виникла невідома помилка.');
  }
};

/**
 * Видаляє коментар за його ID.
 * @param commentId ID коментаря, який потрібно видалити.
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await api.delete(`/dishes/comment/${commentId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Не вдалося видалити коментар.');
    }
    throw new Error('Виникла невідома помилка.');
  }
};

// ✅ Нова функція для отримання всіх коментарів
/**
 * Отримує список усіх коментарів з бекенду.
 * @returns Масив коментарів.
 */
export const getAllComments = async (): Promise<Comment[]> => {
  try {
    const response = await api.get('/dishes/comments');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Не вдалося завантажити коментарі.');
    }
    throw new Error('Виникла невідома помилка.');
  }
};