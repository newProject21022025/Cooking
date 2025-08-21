// src/partners/interfaces/partner.interface.ts

export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  email: string;
  password?: string; // Пароль зазвичай не повертається на фронтенд, але може бути в моделі для бекенду
  phoneNumber?: string;
  deliveryAddress?: string;
  role?: string;
  orderHistory?: any[];
  favorites?: any[];
  rating?: number;
  isBlocked?: boolean;
  createdAt?: string;
}