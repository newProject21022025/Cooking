// src/types/order.ts

export interface OrderItem {
  partnerDishId: string;
  dishId: string;
  name: string;
  photo: string;
  price: number;
  discount?: number;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  userId?: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalSum: number;
  status?: string;
}

export interface CreateOrderDto {
  userId?: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

