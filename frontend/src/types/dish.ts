// src/types/dish.ts

// ✅ Новий інтерфейс для пагінованої відповіді
export interface PaginatedDishesResponse {
  data: Dish[];     // Масив страв на поточній сторінці
  count: number;    // Загальна кількість страв, що відповідають фільтрам/пошуку
  page: number;     // Поточний номер сторінки
  limit: number;    // Кількість страв на сторінці
}

// ✅ Інтерфейс для параметрів запиту пагінації/фільтрації
export interface DishesQueryParams {
  page?: number;        // Номер сторінки
  limit?: number;       // Кількість елементів на сторінці
  is_selected?: boolean | number | undefined;  // Фільтр за вибраними стравами
  query?: string;       // Пошуковий запит
  category?: string;    // Фільтр за категорією страви (наприклад, 'soup', 'salad')
  ingredients?: string[]; // Фільтр за інгредієнтами (масив назв інгредієнтів)  
}

export interface Ingredient {
  name_ua: string;
  name_en: string;
  quantity?: number;
  unit: string;
}

export interface IngredientForm extends Ingredient {
  category: string; // 👈 додатково тільки для форми
}

export interface Comment {
  id: number;
  dish_id: number;
  user_id: string;
  comment_text: string;
  rating?: number;
  created_at: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    photo?: string;

  };
}

export interface Dish {
  id: number;
  name_ua: string;
  name_en: string;
  type: string;
  description_ua: string;
  description_en: string;
  photo: string;
  standard_servings: number;
  important_ingredients: Ingredient[];
  optional_ingredients: Ingredient[];
  recipe_ua: string;
  recipe_en: string;
  is_selected: boolean;
  comments?: Comment[];
}

export type CreateDishDto = Omit<Dish, "id">;
export type UpdateDishDto = Partial<CreateDishDto>;

// ✅ Тип для форми
export interface FormValues
  extends Omit<
    CreateDishDto,
    "important_ingredients" | "optional_ingredients"
  > {
  important_ingredients: IngredientForm[];
  optional_ingredients: IngredientForm[];
}
