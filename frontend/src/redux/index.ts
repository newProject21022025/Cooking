// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // ✨ Импортируем наш userSlice

export const store = configureStore({
  reducer: {
    user: userReducer, // ✨ Добавляем userReducer в наш стор
  }
});

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
