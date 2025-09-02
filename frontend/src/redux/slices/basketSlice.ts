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

// Завантажуємо з localStorage, якщо там щось є
const loadBasketFromStorage = (): BasketItem[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("basket");
    if (data) return JSON.parse(data);
  }
  return [];
};

const saveBasketToStorage = (items: BasketItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("basket", JSON.stringify(items));
  }
};

const initialState: BasketState = {
  items: loadBasketFromStorage(),
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<BasketItem>) {
      const { partnerDish } = action.payload;
      const existingItem = state.items.find(
        (item) => item.partnerDish.id === partnerDish.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveBasketToStorage(state.items);
    },
    removeFromBasket(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.partnerDish.id !== action.payload
      );
      saveBasketToStorage(state.items);
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
      saveBasketToStorage(state.items);
    },
    clearBasket(state) {
      state.items = [];
      saveBasketToStorage(state.items);
    },
  },
});

export const { addToBasket, removeFromBasket, updateQuantity, clearBasket } =
  basketSlice.actions;

export default basketSlice.reducer;
