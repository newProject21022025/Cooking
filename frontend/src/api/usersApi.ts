// src/api/usersApi.ts

import axios from "axios";
import { User, UserRole, UpdateUserProfileData } from "@/types/user";

const API_URL = "http://localhost:3000/users";

const getToken = () => {
  return localStorage.getItem("token");
};

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Додайте обробку помилок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Можна додати перенаправлення на логін
    }
    return Promise.reject(error);
  }
);

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

// Використовуйте новий тип для оновлення
export interface UpdateUserData extends Partial<UpdateUserProfileData> {}

// Отримати профіль поточного користувача
export const getCurrentUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/profile");
  return data;
};

// Оновити дані користувача
export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}`, userData);
  return data;
};

// Оновити профіль поточного користувача (спеціальна функція)
// src/api/usersApi.ts
export const updateCurrentUserProfile = async (userData: UpdateUserProfileData): Promise<User> => {
  // Отримуємо поточного користувача для отримання ID
  const currentUser = await getCurrentUserProfile();
  
  const cleanedData: any = {};
  
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleanedData[key] = value;
    }
  });

  console.log("Оновлення користувача з ID:", currentUser.id, "Дані:", cleanedData);
  
  try {
    // Використовуємо правильний ендпоінт з ID користувача
    const { data } = await apiClient.patch<User>(`/${currentUser.id}`, cleanedData);
    console.log("Успішна відповідь:", data);
    return data;
  } catch (error: any) {
    console.error("Помилка оновлення профілю:", error.response?.data);
    throw error;
  }
};

// Видалити користувача
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/${userId}`);
};

// Заблокувати користувача
export const blockUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}/block`, {});
  return data;
};

// Розблокувати користувача
export const unblockUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/${userId}/unblock`, {});
  return data;
};

// Завантажити аватар користувача
export const uploadUserAvatar = async (userId: string, file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<User>(`/${userId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Отримати користувача по ID
export const getUserById = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/${userId}`);
  return data;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


