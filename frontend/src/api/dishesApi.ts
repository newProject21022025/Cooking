// src/api/dishesApi.ts

import axios from "axios";
import { Dish, CreateDishDto, UpdateDishDto } from "@/types/dish";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dishes`;

// 🔹 Отримати всі страви
export const fetchDishesApi = async (): Promise<Dish[]> => {
  const { data } = await axios.get<Dish[]>(API_URL);
  return data;
};

// ✅ Новий метод для пошуку страв за назвою
export const searchDishesApi = async (query: string): Promise<Dish[]> => {
  // Використовуємо `encodeURIComponent` для безпечного формування URL
  const { data } = await axios.get<Dish[]>(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return data;
};

// 🔹 Отримати страву по id
export const fetchDishByIdApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.get<Dish>(`${API_URL}/${id}`);
  return data;
};

// 🔹 Створити страву
export const createDishApi = async (dishData: CreateDishDto): Promise<Dish> => {
  const { data } = await axios.post<Dish>(API_URL, dishData);
  return data;
};

// 🔹 Оновити страву
export const updateDishApi = async (id: number, dto: UpdateDishDto): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}`, dto);
  return data;
};

// 🔹 Видалити страву
export const deleteDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.delete<Dish>(`${API_URL}/${id}`);
  return data;
};

// ✅ Новий API-метод для вибору страви
export const selectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/select`);
  return data;
};

// ✅ Новий API-метод для скасування вибору страви
export const unselectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/unselect`);
  return data;
};

// ✅ Нова функція для отримання вибраних страв
export const fetchSelectedDishesApi = async (): Promise<Dish[]> => {
  const { data } = await axios.get<Dish[]>(`${API_URL}?is_selected=true`);
  return data;
};