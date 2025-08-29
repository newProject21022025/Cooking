// src/types/partner.ts

import { Dish } from "./dish";

// ⚡ Універсальний тип партнера
export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  email: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  role?: string;
  orderHistory?: any[];
  favorites?: any[];
  rating?: number;
  isBlocked?: boolean;
  createdAt?: string;
  password?: string;
}

// ⚡ Універсальний тип страви партнера
export interface PartnerDish {
  id: string;
  partner_id: string;
  dish_id: number;
  price: number;
  discount?: number;
  availablePortions: number;  // ✅ camelCase, щоб збігалося з frontend
  dishes?: Dish;              // якщо хочеш з’єднати з Dish
}

// DTO для створення та оновлення
export type CreatePartnerDishDto = Omit<PartnerDish, "id" | "dishes">;
export type UpdatePartnerDishDto = Partial<CreatePartnerDishDto>;

// Дані для оновлення профілю партнера
export interface UpdatePartnerProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  photo?: string;
}
