// src/api/partnerDishesApi.ts

import axios from "axios";
import { PartnerDish, CreatePartnerDishDto, UpdatePartnerDishDto } from "@/types/partner";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/partner-dishes`;

// ✅ Новий метод для пошуку страв партнера за назвою
export const searchPartnerDishesApi = async (partnerId: string, query: string): Promise<PartnerDish[]> => {
  // Використовуємо `encodeURIComponent` для безпечного формування URL
  const { data } = await axios.get<PartnerDish[]>(`${BASE_URL}/menu/search/${partnerId}?query=${encodeURIComponent(query)}`);
  return data;
};

// 🔹 Отримати всі страви партнера (або меню)
export const fetchPartnerMenuApi = async (partnerId: string): Promise<PartnerDish[]> => {
  const { data } = await axios.get<PartnerDish[]>(`${BASE_URL}/menu/${partnerId}`);
  return data;
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
  orderNumber: string;
  createdAt: string;
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
  totalSum: number;
  status: string;
}