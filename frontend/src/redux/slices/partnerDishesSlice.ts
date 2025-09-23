// src/redux/slices/partnerDishesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PartnerDish, CreatePartnerDishDto, UpdatePartnerDishDto } from "@/types/partner";
import {
  createPartnerDishApi,
  updatePartnerDishApi,
  deletePartnerDishApi,
} from "@/api/partnerDishesApi";
import axios from "axios";


// створення PartnerDish
export const createPartnerDish = createAsyncThunk<
  PartnerDish,
  CreatePartnerDishDto
>("partnerDishes/create", async (dto) => {
  return await createPartnerDishApi(dto);
});

// отримання меню партнера
export const fetchPartnerDishes = createAsyncThunk<PartnerDish[], string>(
  "partnerDishes/fetchAll",
  async (partnerId: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/partner-dishes/menu/${partnerId}`
    );
    return response.data;
  }
);

// оновлення страви
export const updatePartnerDish = createAsyncThunk<
  PartnerDish,
  { id: string; dish: UpdatePartnerDishDto }
>("partnerDishes/update", async ({ id, dish }) => {
  return await updatePartnerDishApi(id, dish);
});

// видалення страви
export const deletePartnerDish = createAsyncThunk<string, string>(
  "partnerDishes/delete",
  async (id: string) => await deletePartnerDishApi(id)
);

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

const partnerDishesSlice = createSlice({
  name: "partnerDishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPartnerDish.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchPartnerDishes.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updatePartnerDish.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePartnerDish.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export default partnerDishesSlice.reducer;

