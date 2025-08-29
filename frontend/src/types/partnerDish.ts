// // src/types/partnerDish.ts

// import { Dish } from "./dish";

// export interface PartnerDish {
//   id: string;
//   partner_id: string;
//   dish_id: number;  // ✅ number
//   price: number;
//   discount?: number;
//   availablePortions: number;

//   dishes?: Dish;
// }

// export type CreatePartnerDishDto = Omit<PartnerDish, "id" | "dishes">;
// export type UpdatePartnerDishDto = Partial<CreatePartnerDishDto>;
