// src/redux/slices/partnerDishesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PartnerDish, CreatePartnerDishDto } from "@/types/partnerDish";
import {
  createPartnerDishApi,
  fetchPartnerDishesApi,
  updatePartnerDishApi,
  deletePartnerDishApi,
} from "@/api/partnerDishesApi";

// ⚡ Створення PartnerDish у Supabase
export const createPartnerDish = createAsyncThunk<
  PartnerDish,
  CreatePartnerDishDto
>("partnerDishes/create", async (dto) => {
  // dto: { partner_id: string, dish_id: number, price: number, discount?: number, availablePortions: number }
  return await createPartnerDishApi(dto);
});

// отримання всіх страв партнера
export const fetchPartnerDishes = createAsyncThunk<PartnerDish[]>(
  "partnerDishes/fetchAll",
  async () => await fetchPartnerDishesApi()
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
      .addCase(
        createPartnerDish.fulfilled,
        (state, action: PayloadAction<PartnerDish>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        fetchPartnerDishes.fulfilled,
        (state, action: PayloadAction<PartnerDish[]>) => {
          state.items = action.payload;
        }
      )
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

// // src/redux/slices/partnerDishesSlice.ts

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   fetchPartnerDishesApi,
//   createPartnerDishApi,
//   updatePartnerDishApi,
//   deletePartnerDishApi,
// } from "@/api/partnerDishesApi";

// interface PartnerDish {
//   id: string;
//   name: string;
//   description: string;
//   isBlocked: boolean;
// }

// interface PartnerDishesState {
//   items: PartnerDish[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: PartnerDishesState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// // ✅ асинхронні thunks
// export const fetchPartnerDishes = createAsyncThunk(
//   "partnerDishes/fetchAll",
//   async () => await fetchPartnerDishesApi()
// );

// export const createPartnerDish = createAsyncThunk(
//   "partnerDishes/create",
//   async (dish: PartnerDish) => await createPartnerDishApi(dish)
// );

// export const updatePartnerDish = createAsyncThunk(
//   "partnerDishes/update",
//   async ({ id, dish }: { id: string; dish: PartnerDish }) =>
//     await updatePartnerDishApi(id, dish)
// );

// export const deletePartnerDish = createAsyncThunk(
//   "partnerDishes/delete",
//   async (id: string) => await deletePartnerDishApi(id)
// );

// const partnerDishesSlice = createSlice({
//   name: "partnerDishes",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // fetch
//       .addCase(fetchPartnerDishes.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPartnerDishes.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchPartnerDishes.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Помилка завантаження";
//       })
//       // create
//       .addCase(createPartnerDish.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       // update
//       .addCase(updatePartnerDish.fulfilled, (state, action) => {
//         const index = state.items.findIndex((d) => d.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = action.payload;
//         }
//       })
//       // delete
//       .addCase(deletePartnerDish.fulfilled, (state, action) => {
//         state.items = state.items.filter((d) => d.id !== action.payload);
//       });
//   },
// });

// export default partnerDishesSlice.reducer;
