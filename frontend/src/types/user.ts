// src/types/user.ts

export type UserRole = 'user' | 'partner' | 'admin';

export interface User {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  photo: string | null;
  phoneNumber: string | null;
  deliveryAddress: string | null;
  role: UserRole | null;
  averageRating: number | null;
  isBlocked?: boolean;
}

export interface UserState extends User {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Додатковий тип для оновлення профілю
export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  deliveryAddress?: string | null;
  photo?: string | null; // додано поле для URL фото
  password?: string; // додано поле для пароля
}