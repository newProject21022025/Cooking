export interface Ingredient {
    name_ua: string;
    name_en: string;
    quantity?: number;
    unit: string;
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
  }
  
  export type CreateDishDto = Omit<Dish, "id">;
  export type UpdateDishDto = Partial<CreateDishDto>;
  