// src/types/dish.ts

export interface Ingredient {
  name_ua: string;
  name_en: string;
  quantity?: number;
  unit: string;
}

export interface IngredientForm extends Ingredient {
  category: string; // 👈 додатково тільки для форми
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
