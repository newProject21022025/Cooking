// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // ✨ Імпортуємо наш userSlice
import authReducer from './slices/authSlice'; // Імпортуємо authSlice
import dishesReducer from './slices/dishesSlice'; // Імпортуємо dishesSlice
import partnerDishesReducer from './slices/partnerDishesSlice'; // Імпортуємо partnerDishesSlice
import partnersReducer from './slices/partnersSlice'; // Імпортуємо partnersSlice
import basketReducer from './slices/basketSlice'; // Імпортуємо basketSlice

export const store = configureStore({
  reducer: {
    user: userReducer, 
    auth: authReducer,
    dishes: dishesReducer,
    partnerDishes: partnerDishesReducer,
    partners: partnersReducer,
    basket:basketReducer, 
  }
});

// Типи для використання в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
