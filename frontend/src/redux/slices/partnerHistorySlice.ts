// src/redux/slices/partnerHistorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPartnerOrderHistoryApi, PartnerOrderHistoryItem } from "@/api/partnerDishesApi";

interface PartnerHistoryState {
  history: PartnerOrderHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerHistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchPartnerHistory = createAsyncThunk<
  PartnerOrderHistoryItem[],
  { partnerId: string; userId: string },
  { rejectValue: string }
>("partnerHistory/fetch", async ({ partnerId, userId }, { rejectWithValue }) => {
  try {
    return await fetchPartnerOrderHistoryApi(partnerId, userId);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Помилка при завантаженні історії");
  }
});

const partnerHistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPartnerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Помилка при завантаженні історії";
      });
  },
});

export default partnerHistorySlice.reducer;
