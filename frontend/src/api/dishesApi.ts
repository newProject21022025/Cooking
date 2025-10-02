// src/api/dishesApi.ts

import axios from "axios";
import { 
  Dish, 
  CreateDishDto, 
  UpdateDishDto, 
  PaginatedDishesResponse, 
  DishesQueryParams 
} from "@/types/dish";


const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dishes`;

/**
 * 💡 Утиліта для формування рядка запиту з параметрів
 */
const buildQueryString = (params: DishesQueryParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params.is_selected !== undefined) {
    searchParams.append('is_selected', params.is_selected.toString());
  }
  if (params.query) {
    searchParams.append('query', params.query);
  }
  
  // ✅ НОВЕ: Додаємо Category
  if (params.category && params.category !== 'all') {
    searchParams.append('category', params.category);
  }
  
  // ✅ НОВЕ: Додаємо Ingredients (якщо їх декілька, вони будуть як ?ingredients=A&ingredients=B)
  if (params.ingredients && params.ingredients.length > 0) {
    params.ingredients.forEach(ing => {
      searchParams.append('ingredients', ing);
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};


// 🔹 Отримати всі страви (з пагінацією, фільтрацією та пошуком)
// Ця функція є єдиною точкою входу для отримання списку страв.
// 🔹 Отримати всі страви (з пагінацією, фільтрацією та пошуком)
export const fetchDishesApi = async (
  params: DishesQueryParams = {}
): Promise<PaginatedDishesResponse> => {
  
  const queryString = buildQueryString(params);
  
  // ❌ ВИДАЛЯЄМО УМОВУ З params.query:
  // Якщо є пошуковий запит, використовуємо маршрут /dishes/search
  // if (params.query) { url = `${API_URL}/search`; }
  
  // ✅ Використовуємо лише універсальний маршрут
  let url = `${API_URL}${queryString}`; 
  
  // ✅ Очікуємо PaginatedDishesResponse від бекенду
  const { data } = await axios.get<PaginatedDishesResponse>(url);
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

// 🔹 API-метод для вибору страви
export const selectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/select`);
  return data;
};

// 🔹 API-метод для скасування вибору страви
export const unselectDishApi = async (id: number): Promise<Dish> => {
  const { data } = await axios.patch<Dish>(`${API_URL}/${id}/unselect`);
  return data;
};

export const fetchSelectedDishesApi = async (): Promise<Dish[]> => {
  const { data } = await axios.get<Dish[]>(`${API_URL}/selected`);
  return data;
};

// ❌ Видаляємо стару searchDishesApi та fetchSelectedDishesApi, 
// оскільки їх функціонал тепер інтегрований у fetchDishesApi.


// // src/api/dishesApi.ts

// import axios from "axios";
// import { Dish, CreateDishDto, UpdateDishDto } from "@/types/dish";

// const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dishes`;

// // 🔹 Отримати всі страви
// export const fetchDishesApi = async (): Promise<Dish[]> => {
//   const { data } = await axios.get<Dish[]>(API_URL);
//   return data;
// };

// // ✅ Новий метод для пошуку страв за назвою
// export const searchDishesApi = async (query: string): Promise<Dish[]> => {
//   // Використовуємо `encodeURIComponent` для безпечного формування URL
//   const { data } = await axios.get<Dish[]>(`${API_URL}/search?query=${encodeURIComponent(query)}`);
//   return data;
// };

// // 🔹 Отримати страву по id
// export const fetchDishByIdApi = async (id: number): Promise<Dish> => {
//   const { data } = await axios.get<Dish>(`${API_URL}/${id}`);
//   return data;
// };

// // 🔹 Створити страву
// export const createDishApi = async (dishData: CreateDishDto): Promise<Dish> => {
//   const { data } = await axios.post<Dish>(API_URL, dishData);
//   return data;
// };

// // 🔹 Оновити страву
// export const updateDishApi = async (id: number, dto: UpdateDishDto): Promise<Dish> => {
//   const { data } = await axios.patch<Dish>(`${API_URL}/${id}`, dto);
//   return data;
// };

// // 🔹 Видалити страву
// export const deleteDishApi = async (id: number): Promise<Dish> => {
//   const { data } = await axios.delete<Dish>(`${API_URL}/${id}`);
//   return data;
// };

// // ✅ Новий API-метод для вибору страви
// export const selectDishApi = async (id: number): Promise<Dish> => {
//   const { data } = await axios.patch<Dish>(`${API_URL}/${id}/select`);
//   return data;
// };

// // ✅ Новий API-метод для скасування вибору страви
// export const unselectDishApi = async (id: number): Promise<Dish> => {
//   const { data } = await axios.patch<Dish>(`${API_URL}/${id}/unselect`);
//   return data;
// };

// // ✅ Нова функція для отримання вибраних страв
// export const fetchSelectedDishesApi = async (): Promise<Dish[]> => {
//   const { data } = await axios.get<Dish[]>(`${API_URL}?is_selected=true`);
//   return data;
// };