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
  orderId: string;
  userId: string;
  partnerId: string;
  items: {
    dishId: number;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
  }[];
  totalPrice: number;
  createdAt: string;
  status: string;
}

// Отримати історію замовлень конкретного партнера для конкретного користувача
export const fetchPartnerOrderHistoryApi = async (
  partnerId: string,
  userId: string
): Promise<PartnerOrderHistoryItem[]> => {
  const response = await axios.get<PartnerOrderHistoryItem[]>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/history`,
    { params: { partnerId, userId } }
  );
  return response.data;
};
