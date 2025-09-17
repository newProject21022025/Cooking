// src/types/ingredients.ts

// Інтерфейс для одного бенефіту з підтримкою двох мов
export interface Benefit {
    text_uk: string;
    text_en: string;
  }
  
  // Інтерфейс для інгредієнта, який надходить з бекенду
  // Він включає 'id', який додається Supabase
  export interface Ingredient {
    id: string; // Supabase зазвичай повертає UUID як id
    name_uk: string;
    name_en: string;
    image: string;
    benefits: Benefit[];
  }
  
  // Інтерфейс для створення нового інгредієнта (без id)
  export type CreateIngredientPayload = Omit<Ingredient, 'id'>;
  
  // Інтерфейс для оновлення інгредієнта
  // PartialType робить всі поля необов'язковими
  export type UpdateIngredientPayload = Partial<CreateIngredientPayload>;