// src/redux/slices/partnerDishesSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPartnerDishesApi,
  createPartnerDishApi,
  updatePartnerDishApi,
  deletePartnerDishApi,
} from "@/api/partnerDishesApi";

interface PartnerDish {
  id: string;
  name: string;
  description: string;
  isBlocked: boolean;
}

interface PartnerDishesState {
  items: PartnerDish[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerDishesState = {
  items: [],
  loading: false,
  error: null,
};

// ✅ асинхронні thunks
export const fetchPartnerDishes = createAsyncThunk(
  "partnerDishes/fetchAll",
  async () => await fetchPartnerDishesApi()
);

export const createPartnerDish = createAsyncThunk(
  "partnerDishes/create",
  async (dish: PartnerDish) => await createPartnerDishApi(dish)
);

export const updatePartnerDish = createAsyncThunk(
  "partnerDishes/update",
  async ({ id, dish }: { id: string; dish: PartnerDish }) =>
    await updatePartnerDishApi(id, dish)
);

export const deletePartnerDish = createAsyncThunk(
  "partnerDishes/delete",
  async (id: string) => await deletePartnerDishApi(id)
);

const partnerDishesSlice = createSlice({
  name: "partnerDishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPartnerDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPartnerDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Помилка завантаження";
      })
      // create
      .addCase(createPartnerDish.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(updatePartnerDish.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // delete
      .addCase(deletePartnerDish.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export default partnerDishesSlice.reducer;
