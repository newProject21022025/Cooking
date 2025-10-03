// src/redux/slices/dishesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Dish, CreateDishDto, UpdateDishDto } from "@/types/dish";
import {
  fetchDishesApi,
  fetchDishByIdApi,
  createDishApi,
  updateDishApi,
  deleteDishApi,
} from "@/api/dishesApi";
import { RootState } from "@/redux/store";
import { PartnerDish } from "@/types/partner";
import { DishesQueryParams, PaginatedDishesResponse } from "@/types/dish";

export const selectMergedDishes = (
  state: RootState,
  partnerDishes: PartnerDish[]
) => {
  return partnerDishes.map((pd: PartnerDish) => {       // ⚡ явно типізуємо pd
    const dish = state.dishes.items.find((d: Dish) => d.id === pd.dish_id); // ⚡ явно типізуємо d
    return {
      id: pd.id,
      price: pd.price,
      discount: pd.discount || 0,
      finalPrice: pd.price - (pd.discount || 0),
      name: dish?.name_ua || "Без назви",
      description: dish?.description_ua || "",
      image: dish?.photo || "",
      availablePortions: pd.availablePortions,
    };
  });
};


// 🔹 Async thunks
export const fetchDishes = createAsyncThunk<
  PaginatedDishesResponse, // 👈 правильний тип
  DishesQueryParams | undefined
>(
  "dishes/fetchAll",
  async (params) => {
    return await fetchDishesApi(params);
  }
);

export const fetchDishById = createAsyncThunk<Dish, number>(
  "dishes/fetchById",
  async (id) => await fetchDishByIdApi(id)
);

export const createDish = createAsyncThunk<Dish, CreateDishDto>(
  "dishes/create",
  async (dishData) => await createDishApi(dishData)
);

export const updateDish = createAsyncThunk<Dish, { id: number; dto: UpdateDishDto }>(
  "dishes/update",
  async ({ id, dto }) => await updateDishApi(id, dto)
);

export const deleteDish = createAsyncThunk<Dish, number>(
  "dishes/delete",
  async (id) => await deleteDishApi(id)
);

interface DishesState {
  items: Dish[];
  count: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: DishesState = {
  items: [],
  count: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDishes.fulfilled,
        (state, action: PayloadAction<PaginatedDishesResponse>) => {
          state.loading = false;
          state.items = action.payload.data;   // 👈 страви
          state.count = action.payload.count;  // 👈 кількість
          state.page = action.payload.page;    // 👈 сторінка
          state.limit = action.payload.limit;  // 👈 ліміт
        }
      )
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не вдалося завантажити страви";
      })
      // create
      .addCase(createDish.fulfilled, (state, action: PayloadAction<Dish>) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(updateDish.fulfilled, (state, action: PayloadAction<Dish>) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // delete
      .addCase(deleteDish.fulfilled, (state, action: PayloadAction<Dish>) => {
        state.items = state.items.filter((d) => d.id !== action.payload.id);
      });
  },
});

export default dishesSlice.reducer;
