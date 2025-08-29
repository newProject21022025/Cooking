// src/redux/slices/basketSlice.ts
// src/redux/slices/basketSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PartnerDish } from "@/types/partner";
import { Dish } from "@/types/dish";

export interface BasketItem {
  partnerDish: PartnerDish;
  dish: Dish;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<BasketItem>) {
      const { partnerDish } = action.payload;
      // Якщо така страва від цього партнера вже є, збільшуємо кількість
      const existingItem = state.items.find(
        (item) => item.partnerDish.id === partnerDish.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromBasket(state, action: PayloadAction<string>) {
      // видаляємо по id partnerDish
      state.items = state.items.filter(
        (item) => item.partnerDish.id !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ partnerDishId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.partnerDish.id === action.payload.partnerDishId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearBasket(state) {
      state.items = [];
    },
  },
});

export const { addToBasket, removeFromBasket, updateQuantity, clearBasket } =
  basketSlice.actions;

export default basketSlice.reducer;

