// src/ingredients/interfaces/ingredient.interface.ts

// Інтерфейс для одного бенефіту з двома мовами
export interface Benefit {
    text_uk: string;
    text_en: string;
  }
  
  // Інтерфейс для інгредієнта, який надходить з бази даних
  export interface Ingredient {
    id: string; // Унікальний ідентифікатор (UUID)
    name_uk: string;
    name_en: string;
    image: string;
    benefits: Benefit[];
  }