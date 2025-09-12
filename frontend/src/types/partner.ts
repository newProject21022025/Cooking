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
  description?: string;
  role?: string;
  orderHistory?: unknown[];
  favorites?: unknown[];
  rating?: number;
  isBlocked?: boolean;
  createdAt?: string;
  password?: string;
  socials?: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}

// ⚡ Універсальний тип страви партнера
export interface PartnerDish {
  id: string;
  partner_id: string;
  dish_id: number;
  price: number;
  discount?: number;
  availablePortions: number; // ✅ camelCase, щоб збігалося з frontend
  dishes?: Dish; // якщо хочеш з’єднати з Dish
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
  description?: string;
  socials?: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}
