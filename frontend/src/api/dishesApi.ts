import axios from "axios";
import { Dish, CreateDishDto, UpdateDishDto } from "@/types/dish";

const API_URL = "http://localhost:3000/dishes";

// 🔹 Отримати всі страви
export const fetchDishesApi = async (): Promise<Dish[]> => {
  const { data } = await axios.get<Dish[]>(API_URL);
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
