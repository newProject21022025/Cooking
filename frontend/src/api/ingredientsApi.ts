// src/api/ingredientsApi.ts

import { Ingredient, CreateIngredientPayload, UpdateIngredientPayload } from '@/types/ingredients';

// Базовий URL для вашого бекенду
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredients`;

/**
 * Отримує всі інгредієнти з бекенду.
 */
export async function fetchIngredients(): Promise<Ingredient[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Ingredient[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    throw error;
  }
}

/**
 * Отримує один інгредієнт за його ID.
 */
export async function fetchIngredientById(id: string): Promise<Ingredient> {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Ingredient = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ingredient with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Створює новий інгредієнт.
 */
export async function createIngredient(payload: CreateIngredientPayload): Promise<Ingredient> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Ingredient = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    throw error;
  }
}

/**
 * Оновлює існуючий інгредієнт за його ID.
 */
export async function updateIngredient(id: string, payload: UpdateIngredientPayload): Promise<Ingredient> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch (e) {
        console.error('Failed to parse error response body:', e);
      }
      throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(errorBody)}`);
    }

    const data: Ingredient = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to update ingredient with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Видаляє інгредієнт за його ID.
 */
export async function deleteIngredient(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Для DELETE зазвичай не повертається тіло, тому просто перевіряємо статус
  } catch (error) {
    console.error(`Failed to delete ingredient with ID ${id}:`, error);
    throw error;
  }
}

export async function fetchIngredientByName(name_en: string): Promise<Ingredient | null> {
  try {
    // ✅ Правильно формуємо URL із параметром запиту
    const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(name_en)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Ingredient = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ingredient by name ${name_en}:`, error);
    throw error;
  }
}