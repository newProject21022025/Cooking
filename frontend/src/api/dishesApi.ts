// src/api/dishesApi.ts

import axios from "axios";
import { isAxiosError } from "axios";
import {
  Dish,
  CreateDishDto,
  UpdateDishDto,
  PaginatedDishesResponse,
  DishesQueryParams,
} from "@/types/dish";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dishes`;

export const fetchSelectedDishesApi = async (): Promise<Dish[]> => {
  try {
    const { data } = await axios.get<Dish[]>(`${API_URL}/selected`);
    return data ?? [];
  } catch (err) {
    // Тип тепер unknown
    // Звужуємо тип до AxiosError
    if (isAxiosError(err)) {
      console.error(
        "Помилка запиту fetchSelectedDishesApi:",
        err.response?.data ?? err.message
      );
      throw new Error(
        // Отримуємо повідомлення, якщо воно є, або використовуємо стандартне
        (err.response?.data as { message?: string })?.message ||
          err.message ||
          "Не вдалося завантажити вибрані страви."
      );
    }

    // Якщо це не Axios помилка (наприклад, збій мережі), кидаємо її
    throw new Error("Невідома помилка мережі або системи.");
  }
};

const buildQueryString = (params: DishesQueryParams): string => {
  const searchParams = new URLSearchParams(); // 1. Основні параметри пагінації/фільтрації

  if (params.page !== undefined)
    searchParams.append("page", params.page.toString());
  if (params.limit !== undefined)
    searchParams.append("limit", params.limit.toString());

  // 2. Фільтри (Спрощуємо обробку is_selected, щоб вона не була складною)
  if (params.is_selected !== undefined) {
    // Якщо передається true/false/1/0, використовуємо toLocaleString, що покриє всі випадки.
    searchParams.append("is_selected", params.is_selected.toString());
  }

  if (params.query) searchParams.append("query", params.query);

  // 3. Категорія та Інгредієнти
  if (params.category && params.category !== "all")
    searchParams.append("category", params.category);
  if (params.ingredients && params.ingredients.length > 0) {
    params.ingredients.forEach((ing) =>
      searchParams.append("ingredients", ing)
    );
  }
  return searchParams.toString() ? `?${searchParams.toString()}` : "";
};

export const fetchDishesApi = async (
  params: DishesQueryParams = {}
): Promise<PaginatedDishesResponse> => {
  const { data } = await axios.get<PaginatedDishesResponse>(
    `${API_URL}${buildQueryString(params)}`
  );
  return (
    data ?? {
      data: [],
      count: 0,
      page: params.page || 1,
      limit: params.limit || 10,
    }
  );
};
export const fetchDishByIdApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.get<Dish>(`${API_URL}/${id}`);
  if (!data) throw new Error("Dish not found");
  return data;
};

export const createDishApi = async (dishData: CreateDishDto): Promise<Dish> => {
  const { data } = await axios.post<Dish>(API_URL, dishData);
  if (!data) throw new Error("Failed to create dish");
  return data;
};

export const updateDishApi = async (
  id: number,
  dto: UpdateDishDto
): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}`, dto);
  if (!data) throw new Error("Failed to update dish");
  return data;
};

export const deleteDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.delete<Dish>(`${API_URL}/${id}`);
  if (!data) throw new Error("Failed to delete dish");
  return data;
};

export const selectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/select`);
  if (!data) throw new Error("Failed to select dish");
  return data;
};

export const unselectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/unselect`);
  if (!data) throw new Error("Failed to unselect dish");
  return data;
};

export const fetchAllDishesApi = async (): Promise<Dish[]> => {
  const { data } = await axios.get<Dish[]>(`${API_URL}/all`);
  return data;
};

export const fetchDishesByIdsApi = async (dishIds: string[]): Promise<Dish[]> => {
  if (!dishIds || dishIds.length === 0) {
    return [];
  }

  try {
    // 💡 Припускаємо, що ваш бекенд має ендпоінт для масового отримання,
    // наприклад, POST /dishes/details-by-ids, який приймає { dishIds: string[] }
    const { data } = await axios.post<Dish[]>(`${API_URL}/details-by-ids`, { 
        dishIds 
    });
    
    return data ?? [];
  } catch (err) {
    if (isAxiosError(err)) {
      console.error(
        "Помилка запиту fetchDishesByIdsApi:",
        err.response?.data ?? err.message
      );
      throw new Error(
        (err.response?.data as { message?: string })?.message ||
          err.message ||
          "Не вдалося завантажити деталі обраних страв."
      );
    }
    throw new Error("Невідома помилка мережі або системи.");
  }
};
