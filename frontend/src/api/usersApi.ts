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

// 🔹 Отримати всіх користувачів
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/");
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



// // src/api/usersApi.ts

// import axios from "axios";
// import { User, UserRole, UpdateUserProfileData } from "@/types/user";

// const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

// const getToken = () => localStorage.getItem("token");

// const apiClient = axios.create({
//   baseURL: API_URL,
// });

// // Додаємо токен до кожного запиту
// apiClient.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Єдиний обробник помилок
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // редірект
//     }
//     return Promise.reject(error);
//   }
// );

// export interface CreateUserData {
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
//   photo?: string | null;
//   phoneNumber?: string | null;
//   deliveryAddress?: string | null;
//   role?: UserRole;
//   averageRating?: number | null;
//   isBlocked?: boolean;
// }

// export interface UpdateUserData extends Partial<UpdateUserProfileData> {}

// // 🔹 Отримати всіх користувачів
// export const getAllUsers = async (): Promise<User[]> => {
//   const { data } = await apiClient.get<User[]>("/");
//   return data;
// };

// // 🔹 Отримати профіль поточного користувача
// export const getCurrentUserProfile = async (): Promise<User> => {
//   const { data } = await apiClient.get<User>("/profile");
//   return data;
// };

// // 🔹 Оновити користувача
// export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
//   const { data } = await apiClient.patch<User>(`/${userId}`, userData);
//   return data;
// };

// // 🔹 Оновити профіль поточного користувача
// export const updateCurrentUserProfile = async (userData: UpdateUserProfileData): Promise<User> => {
//   const currentUser = await getCurrentUserProfile();
  
//   const cleanedData: Record<string, any> = {};
//   Object.entries(userData).forEach(([key, value]) => {
//     if (value !== null && value !== undefined && value !== "") {
//       cleanedData[key] = value;
//     }
//   });

//   const { data } = await apiClient.patch<User>(`/${currentUser.id}`, cleanedData);
//   return data;
// };

// // 🔹 Видалити користувача
// export const deleteUser = async (userId: string): Promise<void> => {
//   await apiClient.delete(`/${userId}`);
// };

// // 🔹 Заблокувати користувача
// export const blockUser = async (userId: string): Promise<User> => {
//   const { data } = await apiClient.patch<User>(`/${userId}/block`);
//   return data;
// };

// // 🔹 Розблокувати користувача
// export const unblockUser = async (userId: string): Promise<User> => {
//   const { data } = await apiClient.patch<User>(`/${userId}/unblock`);
//   return data;
// };

// // 🔹 Завантажити аватар
// export const uploadUserAvatar = async (userId: string, file: File): Promise<User> => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await apiClient.post<User>(`/${userId}/avatar`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data;
// };

// // 🔹 Отримати користувача по ID
// export const getUserById = async (userId: string): Promise<User> => {
//   const { data } = await apiClient.get<User>(`/${userId}`);
//   return data;
// };
