// src/api/partnerDishesApi.ts

import axios from "axios";
import { PartnerDish, CreatePartnerDishDto, UpdatePartnerDishDto } from "@/types/partner";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/partner-dishes`;

export const fetchPartnerDishesApi = async (): Promise<PartnerDish[]> => {
  const response = await axios.get<PartnerDish[]>(BASE_URL);
  return response.data;
};

// ⚡ create приймає DTO без id
export const createPartnerDishApi = async (dish: CreatePartnerDishDto): Promise<PartnerDish> => {
  const response = await axios.post<PartnerDish>(BASE_URL, dish);
  return response.data;
};

// update теж приймає DTO без id
export const updatePartnerDishApi = async (id: string, dish: UpdatePartnerDishDto): Promise<PartnerDish> => {
  const response = await axios.patch<PartnerDish>(`${BASE_URL}/${id}`, dish);
  return response.data;
};

export const deletePartnerDishApi = async (id: string): Promise<string> => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};

export interface PartnerOrderHistoryItem {
  orderNumber: string; // раніше orderId
  createdAt: string;   // або Date, якщо конвертуєте
  userId?: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    partnerDishId: string;
    dishId: string;
    name: string;
    photo: string;
    price: number;
    discount?: number;
    quantity: number;
  }[];
  totalSum: number; // раніше totalPrice
  status: string;
}


export const fetchPartnerOrderHistoryApi = async (
  partnerId: string,
  userId: string
): Promise<PartnerOrderHistoryItem[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/history`,
    { params: { partnerId, userId } }
  );

  // Перевірка на success
  if (!res.data || (res.data as any).success === false) {
    return [];
  }

  return res.data.map((order: any) => ({
    orderNumber: order.order_number, // ⚡ збігається з бекендом і типом
    createdAt: order.created_at,
    status: order.status,
    items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
    totalSum: parseFloat(order.total_sum), // ⚡ збігається з бекендом і типом
    userId: order.user_id,
    partnerId: order.partner_id,
    firstName: order.first_name,
    lastName: order.last_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
  }));
};



// export interface PartnerOrderHistoryItem {
//   orderId: string;
//   userId: string;
//   partnerId: string;
//   items: {
//     dishId: number;
//     name: string;
//     price: number;
//     quantity: number;
//     discount?: number;
//   }[];
//   totalPrice: number;
//   createdAt: string;
//   status: string;
// }

// // Отримати історію замовлень конкретного партнера для конкретного користувача
// export const fetchPartnerOrderHistoryApi = async (
//   partnerId: string,
//   userId: string
// ): Promise<PartnerOrderHistoryItem[]> => {
//   const response = await axios.get<PartnerOrderHistoryItem[]>(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/history`,
//     { params: { partnerId, userId } }
//   );
//   return response.data;
// };
