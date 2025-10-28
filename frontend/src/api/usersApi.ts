// src/api/usersApi.ts

import axios, { AxiosError } from "axios";
import { User, UserRole, UpdateUserProfileData } from "@/types/user";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

// Отримати токен з локального сховища
const getToken = () => localStorage.getItem("token");

// Конфігурація axios
const apiClient = axios.create({
  baseURL: API_URL,
});

// Додаємо токен до кожного запиту
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Єдиний обробник помилок
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // редірект на логін
    }
    return Promise.reject(error);
  }
);

// Типи для створення та оновлення користувача
export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  photo?: string | null;
  phoneNumber?: string | null;
  deliveryAddress?: string | null;
  role?: UserRole;
  averageRating?: number | null;
  isBlocked?: boolean;
}

// Оновлення користувача — тип через Partial
export type UpdateUserData = Partial<UpdateUserProfileData>;

export interface ResetPasswordData {
  email: string;
}

// 🔹 Отримати всіх користувачів
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/");
  return data;
};

// ✅ Новий метод для пошуку користувачів за email
export const searchUsersByEmail = async (email: string): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(
    `/?email=${encodeURIComponent(email)}`
  );
  return data;
};

// 🔹 Отримати профіль поточного користувача
export const getCurrentUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/profile");
  return data;
};

// 🔹 Оновити користувача за ID
export const updateUser = async (
  userId: string,
  userData: UpdateUserData
): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}`, userData);
  return data;
};

// 🔹 Оновити профіль поточного користувача
export const updateCurrentUserProfile = async (
  userData: UpdateUserProfileData
): Promise<User> => {
  const currentUser = await getCurrentUserProfile();

  // Формуємо об'єкт без null/undefined/empty string
  const cleanedData: Partial<UpdateUserProfileData> = {};
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      cleanedData[key as keyof UpdateUserProfileData] = value;
    }
  });

  const { data } = await apiClient.patch<User>(
    `/${currentUser.id}`,
    cleanedData
  );
  return data;
};

// 🔹 Видалити користувача
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/${userId}`);
};

// 🔹 Заблокувати користувача
export const blockUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}/block`);
  return data;
};

// 🔹 Розблокувати користувача
export const unblockUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}/unblock`);
  return data;
};

// 🔹 Завантажити аватар
export const uploadUserAvatar = async (
  userId: string,
  file: File
): Promise<User> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<User>(`/${userId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 🔹 Отримати користувача по ID
export const getUserById = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/${userId}`);
  return data;
};

export const registerUser = async (userData: CreateUserData): Promise<User> => {
  const { data } = await axios.post<User>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`,
    userData
  );
  return data;
};

// 🔹 Відновлення пароля (отримати новий пароль на email)
export const resetPassword = async (
  data: ResetPasswordData
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
    data
  );
  return response.data;
};

// ✅ Функціонал "Обране" (Favorites)
export const addDishToFavorites = async (dishId: string): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/favorites/${dishId}`);
  return data;
};

export const removeDishFromFavorites = async (
  dishId: string
): Promise<User> => {
  const { data } = await apiClient.delete<User>(`/favorites/${dishId}`);
  return data;
};
