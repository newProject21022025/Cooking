// src/redux/slices/userHistorySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/types/order";
import { fetchOrdersByUserApi } from "@/api/orderApi";

interface UserHistoryState {
  history: Order[];
  loading: boolean;
  error: string | null;
}

interface FetchUserHistoryPayload {
  userId: string;
}

export const fetchUserHistory = createAsyncThunk<Order[], FetchUserHistoryPayload, { rejectValue: string }>(
  "userHistory/fetch",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const orders = await fetchOrdersByUserApi(userId);
      // Якщо API повертає об'єкт з повідомленням, а не масив,
      // ми можемо це обробити, щоб запобігти помилкам типізації.
      if (Array.isArray(orders)) {
        return orders;
      }
      // Якщо повертається щось інше, це помилка.
      return rejectWithValue("Некоректний формат даних від сервера.");
    } catch (error) {
      // Використовуємо 'instanceof' для перевірки типу помилки
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // Обробка невідомих типів помилок
      return rejectWithValue("Невідома помилка при отриманні історії замовлень.");
    }
  }
);

const initialState: UserHistoryState = {
  history: [],
  loading: false,
  error: null,
};

const userHistorySlice = createSlice({
  name: "userHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHistory.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || "Помилка при отриманні історії";
      });
  },
});

export default userHistorySlice.reducer;